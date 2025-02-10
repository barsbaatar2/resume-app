import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class PostLoginResponse {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;
}

export class GetRefreshResponse {
  @ApiProperty()
  readonly accessToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly resetToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}

export class GoogleLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
