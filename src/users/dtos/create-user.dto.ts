import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  admin: boolean;
}
