import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { CreateEpisodeDto } from './dto';

@Controller('episodes')
export class EpisodeController {
  constructor(private episodeService: EpisodeService) {}

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createEpisode(@Body() dto: CreateEpisodeDto) {
    return await this.episodeService.createEpisode(dto);
  }

  @Roles(Role.STUDENT, Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async getEpisodesByLessonId(@Query('lessonId') lessonId: string) {
    return await this.episodeService.getEpisodesByLessonId(lessonId);
  }
}
