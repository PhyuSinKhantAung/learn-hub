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
import { GetUser } from 'src/auth/decorator';
import { CourseUserRole } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  async createCourse(@Body() dto: CreateCourseDto) {
    return await this.courseService.createCourse(dto);
  }

  @Patch('/:id')
  async editCourse(@Body() dto: EditCourseDto, @Param('id') id: number) {
    return await this.courseService.editCourse(dto, id);
  }

  @Get('/:id')
  async getCourseById(@Param('id') id: number) {
    return await this.courseService.getCourseById(id);
  }
  @Delete('/:id')
  async deleteCourse(@Param('id') id: number) {
    return await this.courseService.deleteCourse(id);
  }
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
