import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { Brackets, FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  CreateUserDto,
  UpdateUserDto,
} from './dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';
import { PayloadToken } from 'src/models/token.model';
import { ResumeService } from './resume.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly resumeService: ResumeService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (user) {
      throw new BadRequestException('Duplicate email');
    }

    const createdUser = this.userRepository.create(createUserDto);

    let saveUser = await this.userRepository.save(createdUser);
    return { message: 'success', result: saveUser };
  }

  async generatePdf(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      },
      relations: {
        skills: true,
        experiences: true
      }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resume = await this.resumeService.generateResume(user);
    const publicDirIndex = resume.indexOf('/public');
    const relativePath = resume.substring(publicDirIndex + 7);

    const result = await this.userRepository.update(id, {
      pdfData: relativePath,
      pdfDate: new Date(),
    });

    return { message: 'success', result: relativePath };
  }

  async findAll(
    user: PayloadToken
  ): Promise<User> {

    const users = await this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        skills: true,
        experiences: true,
      },
    });

    if (!users) {
      throw new NotFoundException('Users not found');
    }
    return users;
  }

  async findByEmailAndGetPassword(email: string) {
    return await this.userRepository.findOne({
      select: ['id', 'password'],
      where: { email },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
      },
    });

    return { message: 'success', result: user };
  }

  async findById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
      },
    });
    return { message: 'success', result: user };
  }

  async findByIdRaw(userId: number) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      // relations: {
      //   enterpriseUser: {
      //     company: true,
      //   },
      // },
    });
    return { message: 'success', result: user };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },

    });
  }

  async removeRefreshToken(userId: number) {
    await this.findById(userId);

    return this.userRepository.update(
      userId,
      {
        refreshToken: '',
      },
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    await this.userRepository.save(user);
    return { message: 'success', result: user };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    await this.userRepository.remove(user);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = await bcrypt.hashSync(hash, 10);
    return await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOne({
      select: ['id', 'refreshToken'],
      where: { id: userId },
    });

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isRefreshTokenMatching = await bcrypt.compare(hash, user.refreshToken);

    if (isRefreshTokenMatching) {
      return { id: user.id };
    }
  }

  async checkPassword(userId: number) {
    const user = await this.userRepository.findOne({
      select: ['id', 'password',],
      where: { id: userId },
    });
    if (user && user.password != null && user.password != '') {
      return true;
    } else {
      return false;
    }
  }
}
