import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto, EditLessonDto } from './dto';

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

  async getLessons(courseId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        courseId: +courseId,
      },
    });

    return { data: lessons, count: lessons.length };
  }
  async editLesson(lessonId: string, dto: EditLessonDto) {
    console.log({ lessonId, dto });
    const lesson = await this.prisma.lesson.update({
      where: {
        id: +lessonId,
      },
      data: {
        ...dto,
      },
    });

    return lesson;
  }
}
