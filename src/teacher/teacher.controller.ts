import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateTeacherDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { TeacherService } from './teacher.service';

@UseGuards(JwtGuard)
@Controller('teachers')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}
  @Post()
  async createTeacher(@Body() dto: CreateTeacherDto) {
    console.log({ dto });
    return this.teacherService.createTeacher(dto);
  }
}
