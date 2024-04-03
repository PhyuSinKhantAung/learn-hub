import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEpisodeDto } from './dto';

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  async createEpisode(dto: CreateEpisodeDto) {
    const r = dto.resources.map((link) => {
      return { link };
    });

    const episode = await this.prisma.episode.create({
      data: {
        lessonId: dto.lessonId,
        title: dto.title,
        resources: {
          create: r,
        },
      },
    });

    return episode;
  }
}
