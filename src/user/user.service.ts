import { AssignmentService } from 'src/assignment/assignment.service';
import { CourseService } from './../course/course.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { UpdateUserDto } from 'src/auth/dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private courseService: CourseService,
    private assignmentService: AssignmentService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await argon.hash(dto.password);

    const data = { ...dto, password: hashedPassword };

    const user = await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    return user;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async updateUserById(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        grade: {
          upsert: {
            update: {
              value: dto.grade,
            },
            create: {
              value: dto.grade,
            },
          },
        },
      },
    });

    return user;
  }

  async getUserEnrolledCourses(userId: number) {
    const enrolledCourses = await this.courseService.getEnrolledCourses(userId);

    return enrolledCourses;
  }

  async getUserAssignmentSubmissions(userId: number) {
    const assignmentSubmissions =
      await this.assignmentService.getAssignmentSubmissions({ userId });

    return assignmentSubmissions;
  }
}
