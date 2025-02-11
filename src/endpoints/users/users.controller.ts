import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  CreateUserDto,
  DefaultColumnsResponse,
  UpdateUserDto,
} from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { Public } from 'src/utils/public.decorator';
import { PayloadToken } from 'src/models/token.model';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @ApiOperation({ summary: 'create a user with individual types' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Get()
  async findAll(@Request() req: { user: PayloadToken }) {
    const users = await this.usersService.findAll(req.user);
    return { message: 'success', result: users };
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponse,
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Put()
  async updateAnyUser(
    @Param('id') id: number,
    @Request() req: { user: PayloadToken },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.update(req.user.id, updateUserDto);
    return result;
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'create a user resume' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Post('resume') 
  async generatePdf(@Request() req: { user: PayloadToken }) {
    return this.usersService.generatePdf(req.user.id);
  }

}