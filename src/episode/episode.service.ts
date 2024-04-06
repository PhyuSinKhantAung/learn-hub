import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEpisodeDto } from './dto';

type File = {
  pathname: string;
  name: string;
};

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  async createEpisode(dto: CreateEpisodeDto, files: File[]) {
    console.log(files);
    console.log(dto.resources);
    const r = dto?.resources?.map((link) => {
      return { link };
    });

    console.log('here', dto);
    const episode = await this.prisma.episode.create({
      data: {
        lessonId: +dto.lessonId,
        title: dto.title,
        ...(dto.resources
          ? {
              resources: {
                create: r,
              },
            }
          : {}),
        ...(files.length !== 0
          ? {
              files: {
                create: files,
              },
            }
          : {}),
      },
    });

    return episode;
  }

  async getEpisodesByLessonId(lessonId: string) {
    const episodes = await this.prisma.episode.findMany({
      where: {
        lessonId: +lessonId,
      },
      include: {
        resources: true,
      },
    });

    return { data: episodes, count: episodes.length };
  }
}
