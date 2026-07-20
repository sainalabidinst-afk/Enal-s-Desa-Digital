import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrPhone!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}
