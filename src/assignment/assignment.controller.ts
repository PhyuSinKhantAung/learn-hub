import { AssignmentService } from './assignment.service';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAssignmentDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { FileType, Role } from '@prisma/client';
import { CreateAssignmentSubmissionDto } from './dto/createAssignmentSubmission.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFormatFilter, getFilename } from 'src/utils/file-uploading.utils';

@Controller('assignments')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createAssignment(@Body() dto: CreateAssignmentDto) {
    Logger.log({ dto });

    return this.assignmentService.createAssignment(dto);
  }

  @Get()
  async getAssignments(@Query('episodeId') episodeId: string) {
    Logger.log({ episodeId });
    return this.assignmentService.getAssignments({ episodeId });
  }

  @Roles(Role.STUDENT)
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
  @Post('/submissions')
  async submitAssignment(
    @Body() dto: CreateAssignmentSubmissionDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetUser('id') userId: number,
  ) {
    Logger.log({ dto });
    const reshapedFiles = files.map((file) => {
      return {
        pathname: file.filename,
        name: file.originalname,
        type: FileType.ASSIGNNMENT,
        userId,
      };
    });
    return this.assignmentService.submitAssignment(dto, reshapedFiles);
  }
}
