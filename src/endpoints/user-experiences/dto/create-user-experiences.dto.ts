import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsNumber, IsDateString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserExperiencesDto {
  userId: number;
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  year: number;
}

export class UpdateUserExperiencesDto extends PartialType(CreateUserExperiencesDto) {}

export class DefaultColumnsResponse extends CreateUserExperiencesDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
