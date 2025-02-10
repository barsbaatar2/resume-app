// userSkills.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserSkillsDto, UpdateUserSkillsDto } from './dto/create-user-skills.dto';
import { UserSkill } from '../../database/entities/user-skill.entity';

@Injectable()
export class UserSkillsService {
  constructor(
    @InjectRepository(UserSkill)
    private readonly userSkillsRepository: Repository<UserSkill>,
  ) { }

  async createUserSkills(createUserSkillsDto: CreateUserSkillsDto, id: number): Promise<UserSkill | any> {
    try {
      createUserSkillsDto.userId = id;
      const userSkills = this.userSkillsRepository.create(createUserSkillsDto);
      return this.userSkillsRepository.save(userSkills);
    } catch (error) {
      // console.log(error)
      return null;
    }
  }

  async listSkillNames(name: string): Promise<string[]> {
    const userSkills = await this.userSkillsRepository.find({
      select: { name: true },
    });

    if (!userSkills) {
      throw new NotFoundException('UserSkills not found');
    }
    const targetUserIds = userSkills.map((block) => block.name);

    return targetUserIds;
  }

  async getUserSkills(id: number): Promise<UserSkill> {
    const userSkills = await this.userSkillsRepository.findOne({
      where: { userId: id },
    });
    if (!userSkills) {
      throw new NotFoundException('UserSkills not found');
    }
    return userSkills;
  }

  async getUserSkillsById(id: number): Promise<UserSkill> {
    const userSkills = await this.userSkillsRepository.findOne({
      where: { id: id },
    });
    if (!userSkills) {
      throw new NotFoundException('UserSkills not found');
    }
    return userSkills;
  }

  async updateUserSkills(id: number, updateUserSkillsDto: UpdateUserSkillsDto): Promise<UserSkill> {
    const userSkills = await this.getUserSkillsById(id);
    Object.assign(userSkills, updateUserSkillsDto);
    return this.userSkillsRepository.save(userSkills);
  }

  async deleteUserSkills(id: number): Promise<void> {
    const userSkills = await this.getUserSkillsById(id);
    await this.userSkillsRepository.remove(userSkills);
  }
}
