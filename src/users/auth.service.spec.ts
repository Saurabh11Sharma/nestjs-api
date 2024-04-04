import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const testUser = {
    email: 'test@test.com',
    password: '123',
  } as CreateUserDTO;
  const users: User[] = [];
  const mockUserService: Partial<UsersService> = {
    find: (email: string) => {
      const filteredUsers = users.filter((user) => user.email === email);
      return Promise.resolve(filteredUsers);
    },
    create: (body: User) => {
      const user = {
        id: Math.floor(Math.random() * 999999),
        email: body.email,
        password: body.password,
      } as User;
      users.push(user);
      return Promise.resolve(user);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create a new user with hash password', async () => {
    const response = await authService.signup(testUser);
    expect(response.email).toEqual(testUser.email);
  });

  it('should throw error with user already exits', async () => {
    await expect(authService.signup(testUser)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should login a new user', async () => {
    const response = await authService.signin(testUser);
    expect(response.email).toEqual(testUser.email);
  });

  it('throws if an invalid password is provided', async () => {
    const invalidUser = {
      ...testUser,
      password: 'password',
    };
    await expect(authService.signin(invalidUser)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    const invalidUser = {
      ...testUser,
      email: 'noemail@test.com',
    };
    await expect(authService.signin(invalidUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});
