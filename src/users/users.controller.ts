import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authSerice: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDTO,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authSerice.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async loginUser(
    @Body() body: CreateUserDTO,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authSerice.signin(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async logoutUser(@Session() session: any): Promise<void> {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string): Promise<User | null> {
    const userId = parseInt(id);
    return this.usersService.findOne(userId);
  }

  @Get('')
  async findAllUsers(@Query('email') email: string): Promise<User[]> {
    return this.usersService.find(email);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: Partial<CreateUserDTO>,
  ): Promise<User> {
    const userId = parseInt(id);
    return this.usersService.update(userId, body);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    const userId = parseInt(id);
    return this.usersService.delete(userId);
  }
}
