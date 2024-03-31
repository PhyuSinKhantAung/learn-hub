import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateTeacherDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { TeacherService } from './teacher.service';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';

@Roles(Role.ADMIN, Role.SUPERADMIN)
@UseGuards(JwtGuard, RoleGuard)
@Controller('teachers')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}
  @Post()
  async createTeacher(@Body() dto: CreateTeacherDto) {
    console.log({ dto });
    return this.teacherService.createTeacher(dto);
  }
}
