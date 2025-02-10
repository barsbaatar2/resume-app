// userExperiences.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserExperiencesDto, UpdateUserExperiencesDto } from './dto/create-user-experiences.dto';
import { UserExperience } from '../../database/entities/user-experience.entity';

@Injectable()
export class UserExperiencesService {
  constructor(
    @InjectRepository(UserExperience)
    private readonly userExperiencesRepository: Repository<UserExperience>,
  ) { }

  async createUserExperiences(createUserExperiencesDto: CreateUserExperiencesDto, id: number): Promise<UserExperience | any> {
    try {
      createUserExperiencesDto.userId = id;
      const userExperiences = this.userExperiencesRepository.create(createUserExperiencesDto);
      return this.userExperiencesRepository.save(userExperiences);
    } catch (error) {
      // console.log(error)
      return null;
    }
  }

  async listExperienceNames(name: string): Promise<string[]> {
    const userExperiences = await this.userExperiencesRepository.find({
      select: { name: true },
    });

    if (!userExperiences) {
      throw new NotFoundException('UserExperiences not found');
    }
    const targetUserIds = userExperiences.map((block) => block.name);

    return targetUserIds;
  }

  async getUserExperiences(id: number): Promise<UserExperience> {
    const userExperiences = await this.userExperiencesRepository.findOne({
      where: { userId: id },
    });
    if (!userExperiences) {
      throw new NotFoundException('UserExperiences not found');
    }
    return userExperiences;
  }

  async getUserExperiencesById(id: number): Promise<UserExperience> {
    const userExperiences = await this.userExperiencesRepository.findOne({
      where: { id: id },
    });
    if (!userExperiences) {
      throw new NotFoundException('UserExperiences not found');
    }
    return userExperiences;
  }

  async updateUserExperiences(id: number, updateUserExperiencesDto: UpdateUserExperiencesDto): Promise<UserExperience> {
    const userExperiences = await this.getUserExperiencesById(id);
    Object.assign(userExperiences, updateUserExperiencesDto);
    return this.userExperiencesRepository.save(userExperiences);
  }

  async deleteUserExperiences(id: number): Promise<void> {
    const userExperiences = await this.getUserExperiencesById(id);
    await this.userExperiencesRepository.remove(userExperiences);
  }
}
