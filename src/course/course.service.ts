import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto';
import { EditCourseDto } from './dto/editCourse.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(dto: CreateCourseDto) {
    const course = await this.prisma.course.create({
      data: {
        name: dto.name,
        courseDetails: dto.courseDetails,
      },
    });
    return course;
  }

  async editCourse(dto: EditCourseDto, courseId: number) {
    const course = await this.prisma.course.update({
      where: {
        id: +courseId,
      },
      data: {
        ...dto,
      },
    });
    return course;
  }

  async getCourseById(courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: +courseId,
      },
    });

    return course;
  }

  async deleteCourse(courseId: number) {
    await this.prisma.course.delete({
      where: {
        id: +courseId,
      },
    });
  }
}
