import {
  editFileName,
  rightFileFormatFilter,
} from './../utils/file-uploading.utils';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  // UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { CreateEpisodeDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('episodes')
export class EpisodeController {
  constructor(private episodeService: EpisodeService) {}

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: rightFileFormatFilter,
    }),
  )
  @Post()
  async createEpisode(
    @Body() dto: CreateEpisodeDto,
    @UploadedFile() file: any,
  ) {
    console.log({ file });
    const extractedFile = {
      originalName: file.originalname,
      fileName: file.fieldname,
    };
    console.log({ extractedFile });
    return await this.episodeService.createEpisode(dto, file);
  }

  @Roles(Role.STUDENT, Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async getEpisodesByLessonId(@Query('lessonId') lessonId: string) {
    return await this.episodeService.getEpisodesByLessonId(lessonId);
  }
}
