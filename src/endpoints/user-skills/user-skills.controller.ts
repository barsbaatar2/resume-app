// userSkills.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UserSkillsService } from './user-skills.service';
import { UpdateUserSkillsDto, CreateUserSkillsDto } from './dto/create-user-skills.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultColumnsResponse } from './dto/create-user-skills.dto';
import { PayloadToken } from 'src/models/token.model';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@ApiTags('user/skills')
@Controller('user/skills')
@UseGuards(JwtAuthGuard) //  makes the all routs as private by default
export class UserSkillsController {
  constructor(private readonly userSkillsService: UserSkillsService) {}

  @ApiOperation({ summary: 'create a user skills' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Post()
  async createUserSkills(@Body() createUserSkillsDto: CreateUserSkillsDto, @Request() req: { user: PayloadToken }) {
      const result = await this.userSkillsService.createUserSkills(createUserSkillsDto, req.user.id);
      return { message: 'success', result: result };
  }

  @ApiOperation({ summary: 'list user skills' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Get()
  async listUserSkills(@Request() req: { user: PayloadToken }) {
    const userSkills = await this.userSkillsService.getUserSkills(req.user.id);
    if (!userSkills) {
      throw new NotFoundException('UserSkills not found');
    }
    const result = await userSkills;

    return { message: 'success', result: result };
  }

  @ApiOperation({ summary: 'get a user skills' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Get('list')
  async listSkillNames(@Query() query) {
    const userSkills = await this.userSkillsService.listSkillNames(query.name);
    if (!userSkills) {
      throw new NotFoundException('UserSkills not found');
    }
    const result = await userSkills;
    return { message: 'success', result: result };
  }

  @ApiOperation({ summary: 'update a user skills' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Put(':id')
  async updateUserSkills(@Param('id') id: number, @Body() updateUserSkillsDto: UpdateUserSkillsDto) {
    const result = await this.userSkillsService.updateUserSkills(id, updateUserSkillsDto);
    return { message: 'success', result: result };
  }

  @ApiOperation({ summary: 'delete a user skills' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Delete(':id')
  async deleteUserSkills(@Param('id') id: number) {
    const result = await this.userSkillsService.deleteUserSkills(id);
    return { message: 'success', result: result };
  }
}
