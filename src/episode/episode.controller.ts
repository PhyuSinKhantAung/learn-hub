import { fileFormatFilter, getFilename } from './../utils/file-uploading.utils';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { CreateEpisodeDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('episodes')
export class EpisodeController {
  constructor(private episodeService: EpisodeService) {}

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: getFilename,
      }),
      fileFilter: fileFormatFilter,
    }),
  )
  @Post()
  async createEpisode(
    @Body() dto: CreateEpisodeDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const reshapedFiles = files.map((file) => {
      return {
        pathname: file.filename,
        name: file.originalname,
      };
    });

    return await this.episodeService.createEpisode(dto, reshapedFiles);
  }

  @Roles(Role.STUDENT, Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async getEpisodesByLessonId(@Query('lessonId') lessonId: string) {
    return await this.episodeService.getEpisodesByLessonId(lessonId);
  }
}
