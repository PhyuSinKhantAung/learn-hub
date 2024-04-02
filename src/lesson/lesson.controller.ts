import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto';
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
    console.log({ dto });
    return this.lessonService.createLesson(dto);
  }
}
