import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { In, Repository } from 'typeorm';
import config from '../../config';
import { GoogleLoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { PayloadToken } from 'src/models/token.model';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {
  }

  async validateUser(email: string, password: string): Promise<PayloadToken | null> {
    const user = await this.usersService.findByEmailAndGetPassword(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password ?? '');

      if (isMatch) {
        return {
          id: user.id
        };
      }
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async login(user: PayloadToken, body: any) {
   
    const { accessToken } = this.jwtToken(user);
    const refreshToken = this.jwtRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    const users = await this.usersService.findOne(user.id);
    
    return {
      accessToken,
      refreshToken,
      user: users.result,
    };
  }

  jwtToken(user: PayloadToken) {
    const payload: PayloadToken = {
      id: user.id,
    };
    return {
      accessToken: this.jwtService.sign({
        id: user.id,
      }),
    };
  }

  jwtTokenUpdate(user: PayloadToken) {
    const payload: PayloadToken = {
      id: user.id
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  jwtRefreshToken(user: PayloadToken) {
    const payload: PayloadToken = {
      id: user.id
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.jwt.jwtRefreshSecret,
      expiresIn: `${this.configService.jwt.refreshTokenExpiration}`,
    });
  }

  async logout(user: PayloadToken) {
    return await this.usersService.removeRefreshToken(user.id);
  }

  async createAccessTokenFromRefreshToken(user: PayloadToken) {
    return this.jwtToken(user);
  }
}
