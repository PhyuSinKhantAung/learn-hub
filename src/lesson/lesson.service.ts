import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async createLesson(dto: CreateLessonDto) {
    const lesson = await this.prisma.lesson.create({
      data: {
        ...dto,
      },
    });

    return lesson;
  }
}
