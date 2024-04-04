import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { randomBytes, scrypt } from 'crypto';
import { User } from './user.entity';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(user: CreateUserDTO): Promise<User> {
    const existingUser = await this.userService.find(user.email);

    if (existingUser.length) {
      throw new BadRequestException('User exists with email address');
    }

    const salt = randomBytes(8).toString('hex');
    const secretHash = (await scryptAsync(user.password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + secretHash.toString('hex');

    return this.userService.create({
      email: user.email,
      password: hashedPassword,
    } as User);
  }

  async signin(user: CreateUserDTO): Promise<User> {
    const [existingUser] = await this.userService.find(user.email);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = existingUser.password.split('.');

    const secretHash = (
      (await scryptAsync(user.password, salt, 32)) as Buffer
    ).toString('hex');

    if (storedHash !== secretHash) {
      throw new BadRequestException('Invalid Password');
    }

    return existingUser;
  }
}
