import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
    console.log({ dto });
    return await this.episodeService.createEpisode(dto);
  }
}
