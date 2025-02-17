import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../../config';
import { UsersService } from 'src/endpoints/users/users.service';
import { PayloadToken } from 'src/models/token.model';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    @Inject(config.KEY)
    configService: ConfigType<typeof config>,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: PayloadToken) {
    const authHeader = request.headers.authorization;
    const refreshToken = authHeader ? authHeader.split(' ')[1] : null;

    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }
    return this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.id);
  }
}
