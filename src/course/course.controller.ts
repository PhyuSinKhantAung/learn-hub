import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCourseDto } from './dto';
import { CourseService } from './course.service';
import { EditCourseDto } from './dto/editCourse.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { CourseUserRole, Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/guard/role.guard';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  async getAllCourses() {
    return await this.courseService.getAllCourses();
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createCourse(@Body() dto: CreateCourseDto) {
    return await this.courseService.createCourse(dto);
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/courseEnrollments')
  async getCourseEnrollments(@GetUser('id') userId: number) {
    return await this.courseService.getEnrolledCourses(userId);
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('/:id')
  async editCourse(@Body() dto: EditCourseDto, @Param('id') id: number) {
    return await this.courseService.editCourse(dto, id);
  }

  @Get('/:id')
  async getCourseById(@Param('id') id: number) {
    return await this.courseService.getCourseById(id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('/:id')
  async deleteCourse(@Param('id') id: number) {
    return await this.courseService.deleteCourse(id);
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:id/courseEnrollments')
  async enrollCourse(
    @Param('id') id: number,
    @GetUser('role') role: CourseUserRole,
    @GetUser('id') userId: number,
  ) {
    return await this.courseService.enrollCourse({
      courseId: +id,
      userId,
      role,
    });
  }
}
