import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}
