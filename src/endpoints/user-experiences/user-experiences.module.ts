import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserExperiencesController } from './user-experiences.controller';
import { UserExperience } from '../../database/entities/user-experience.entity';
import { UserExperiencesService } from './user-experiences.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserExperience])],
  controllers: [UserExperiencesController],
  providers: [UserExperiencesService],
  exports: [UserExperiencesService],
})
export class UserExperiencesModule {}
