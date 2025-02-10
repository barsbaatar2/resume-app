// userExperiences.controller.ts

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
import { UserExperiencesService } from './user-experiences.service';
import { UpdateUserExperiencesDto, CreateUserExperiencesDto } from './dto/create-user-experiences.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefaultColumnsResponse } from './dto/create-user-experiences.dto';
import { PayloadToken } from 'src/models/token.model';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@ApiTags('user/experiences')
@Controller('user/experiences')
@UseGuards(JwtAuthGuard) //  makes the all routs as private by default
export class UserExperiencesController {
  constructor(private readonly userExperiencesService: UserExperiencesService) {}

  @ApiOperation({ summary: 'create a user experiences' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Post()
  async createUserExperiences(@Body() createUserExperiencesDto: CreateUserExperiencesDto, @Request() req: { user: PayloadToken }) {
      const result = await this.userExperiencesService.createUserExperiences(createUserExperiencesDto, req.user.id);
      return { message: 'success', result: result };
  }

  @ApiOperation({ summary: 'list user experiences' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Get()
  async listUserExperiences(@Request() req: { user: PayloadToken }) {
    const userExperiences = await this.userExperiencesService.getUserExperiences(req.user.id);
    if (!userExperiences) {
      throw new NotFoundException('UserExperiences not found');
    }
    const result = await userExperiences;

    return { message: 'success', result: result };
  }

  @ApiOperation({ summary: 'get a user experiences' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Get('list')
  async listExperienceNames(@Query() query) {
    const userExperiences = await this.userExperiencesService.listExperienceNames(query.name);
    if (!userExperiences) {
      throw new NotFoundException('UserExperiences not found');
    }
    const result = await userExperiences;
    return { message: 'success', result: result };
  }

  @ApiOperation({ summary: 'update a user experiences' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Put(':id')
  async updateUserExperiences(@Param('id') id: number, @Body() updateUserExperiencesDto: UpdateUserExperiencesDto) {
    const result = await this.userExperiencesService.updateUserExperiences(id, updateUserExperiencesDto);
    return { message: 'success', result: result };
  }

  @ApiOperation({ summary: 'delete a user experiences' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Delete(':id')
  async deleteUserExperiences(@Param('id') id: number) {
    const result = await this.userExperiencesService.deleteUserExperiences(id);
    return { message: 'success', result: result };
  }
}
