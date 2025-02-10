import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  PostLoginResponse,
  ResetPasswordDto,
} from './dto/login.dto';
import { PayloadToken } from 'src/models/token.model';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from 'src/utils/local-auth.guard';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

type AuthorizedRequest = Express.Request & {
  headers: { authorization: string };
  user: PayloadToken;
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: PayloadToken }, @Body() body: any) {
    const user = req.user;
    return this.authService.login(user, body);
  }

  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logOut(@Request() req: { user: PayloadToken }) {
    await this.authService.logout(req.user);
  }

}
