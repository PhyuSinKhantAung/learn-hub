import { UserService } from './../user/user.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TeacherService {
  constructor(private userService: UserService) {}

  async createTeacher(dto: CreateTeacherDto, role: Role = Role.TEACHER) {
    try {
      const teacher = await this.userService.createUser({ ...dto, role });
      return teacher;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }
}
