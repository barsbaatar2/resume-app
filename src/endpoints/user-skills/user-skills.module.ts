import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSkillsController } from './user-skills.controller';
import { UserSkill } from '../../database/entities/user-skill.entity';
import { UserSkillsService } from './user-skills.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSkill])],
  controllers: [UserSkillsController],
  providers: [UserSkillsService],
  exports: [UserSkillsService],
})
export class UserSkillsModule {}
