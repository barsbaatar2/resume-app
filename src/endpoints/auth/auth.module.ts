import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from '../../config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.jwtSecret,
          signOptions: {
            expiresIn: configService.jwt.accessTokenExpiration,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtRefreshTokenStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
