import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEpisodeDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { File } from 'src/utils/file-uploading.utils';

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  async createEpisode(dto: CreateEpisodeDto, files: File[]) {
    try {
      const r = dto?.resources?.map((link) => {
        return { link };
      });

      const episode = await this.prisma.episode.create({
        data: {
          lessonId: +dto.lessonId,
          title: dto.title,
          ...(r
            ? {
                resources: {
                  create: r,
                },
              }
            : {}),
          ...(files?.length !== 0
            ? {
                files: {
                  create: files,
                },
              }
            : {}),
        },
      });

      return episode;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003')
          throw new NotFoundException('Lesson not found');
      }
      throw error;
    }
  }

  async getEpisodesByLessonId(lessonId: string) {
    const episodes = await this.prisma.episode.findMany({
      where: {
        lessonId: +lessonId,
      },
      include: {
        resources: true,
        files: true,
        assignments: true,
      },
    });

    return { data: episodes, count: episodes.length };
  }
}
