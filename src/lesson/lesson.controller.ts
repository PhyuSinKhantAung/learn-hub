import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto, EditLessonDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';

@Controller('lessons')
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createLesson(@Body() dto: CreateLessonDto) {
    return this.lessonService.createLesson(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getLessons(@Query('courseId') courseId: string) {
    return this.lessonService.getLessons(courseId);
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('/:lessonId')
  async editLesson(
    @Param('lessonId') lessonId: string,
    @Body() dto: EditLessonDto,
  ) {
    return this.lessonService.editLesson(lessonId, dto);
  }
}
