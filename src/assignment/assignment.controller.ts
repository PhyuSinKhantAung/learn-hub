import { UserService } from 'src/user/user.service';
import { AssignmentService } from './assignment.service';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAssignmentDto, GradeAssignmentSubmissionDto } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { FileType, Role } from '@prisma/client';
import { CreateAssignmentSubmissionDto } from './dto/createAssignmentSubmission.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFormatFilter, getFilename } from 'src/utils/file-uploading.utils';
import { UpdateAssignmentSubmissionDto } from './dto/updateAssignmentSubmission.dto';

@Controller('assignments')
export class AssignmentController {
  constructor(
    private assignmentService: AssignmentService,
    private userService: UserService,
  ) {}

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createAssignment(@Body() dto: CreateAssignmentDto) {
    Logger.log({ dto });

    return this.assignmentService.createAssignment(dto);
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard)
  @Get('/:assignmentId/submissions')
  async getAssignmentSubmissions(@Param('assignmentId') assignmentId: string) {
    Logger.log({ assignmentId });
    return this.assignmentService.getAssignmentSubmissions({
      assignmentId: +assignmentId,
    });
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
  @Post('/:assignmentId/submissions')
  async submitAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() dto: CreateAssignmentSubmissionDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetUser('id') userId: number,
  ) {
    Logger.log({ dto });
    const reshapedFiles = files?.map((file) => {
      return {
        pathname: file.filename,
        name: file.originalname,
        type: FileType.ASSIGNNMENT,
        userId,
      };
    });

    Logger.log({ userId });
    return this.assignmentService.submitAssignment(
      assignmentId,
      dto,
      reshapedFiles,
      userId,
    );
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('/:assignmentId/grades')
  async gradeAssignmentSubmission(
    @Param('assignmentId') assignmentId: string,
    @Body() dto: GradeAssignmentSubmissionDto,
    @GetUser('id') userId: number,
  ) {
    const submission = await this.assignmentService.gradeAssignmentSubmission(
      dto,
      dto?.submissionId,
      +assignmentId,
      userId,
    );

    const {
      _sum: { result },
    } = await this.assignmentService.getUserAssignmentsResult(
      submission.userId,
    );

    await this.userService.updateUserById(submission.userId, { grade: result });

    return submission;
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('/:assignmentId/submissions/:submissionId')
  async updateAssignmentSubmissionById(
    @Param('assignmentId') assignmentId: string,
    @Param('submissionId') submissionId: string,
    @Body() dto: UpdateAssignmentSubmissionDto,
    @GetUser('id') userId: number,
  ) {
    const { userId: ownerUserId } =
      await this.assignmentService.getAssignmentSubmissionById(+submissionId);

    if (ownerUserId !== userId) {
      throw new UnauthorizedException('You can only modify your submission.');
    }
    const submission =
      await this.assignmentService.updateAssignmentSubmissionById(
        +submissionId,
        +assignmentId,
        dto,
      );

    return submission;
  }
}
