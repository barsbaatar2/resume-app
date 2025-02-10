import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsNumber, IsDateString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserSkillsDto {
  userId: number;

  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateUserSkillsDto extends PartialType(CreateUserSkillsDto) {}

export class DefaultColumnsResponse extends CreateUserSkillsDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
