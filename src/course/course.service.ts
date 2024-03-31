import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, EnrollCourseDto, EditCourseDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses() {
    const courses = await this.prisma.course.findMany();

    return { data: courses, count: courses.length };
  }

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
    try {
      const course = await this.prisma.course.update({
        where: {
          id: +courseId,
        },
        data: {
          ...dto,
        },
      });

      return course;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('Course not found to update');
      }
    }
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
    try {
      await this.prisma.course.delete({
        where: {
          id: +courseId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('Course not found to delete');
      }
    }
  }
  async enrollCourse(dto: EnrollCourseDto) {
    try {
      const enrolledCourse = await this.prisma.courseEnrollMent.create({
        data: {
          ...dto,
        },
      });

      return enrolledCourse;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ConflictException('Duplicated course enrollments');
      }
    }
  }

  async getEnrolledCourses(userId: number | undefined) {
    const filter = {
      ...(userId ? { userId } : {}),
    };

    const enrolledCourses = await this.prisma.courseEnrollMent.findMany({
      where: filter,
    });

    return enrolledCourses;
  }
}
