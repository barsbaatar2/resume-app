import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  views?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  follows?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  workMode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  workType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  workCommitment?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  rateValue?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rateType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  primaryJob?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  secondaryJob?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  aboutMe?: string;
}

export class UpdateUserDto extends OmitType(CreateUserDto, ['email', 'password'] as const) {
}


export class DefaultColumnsResponse extends CreateUserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
