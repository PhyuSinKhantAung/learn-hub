import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto, GradeAssignmentSubmissionDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GetAssignmentsDto } from './dto/getAssignments.dto';
import { CreateAssignmentSubmissionDto } from './dto/createAssignmentSubmission.dto';
import { File } from 'src/utils/file-uploading.utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AssignmentService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createAssignment(dto: CreateAssignmentDto) {
    try {
      const assignment = await this.prisma.assignment.create({
        data: {
          ...dto,
        },
      });

      return assignment;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('Lesson not found');
        }
      }
    }
  }

  async getAssignments(dto: GetAssignmentsDto) {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        episodeId: +dto.episodeId,
      },
    });
    return { data: assignments, count: assignments.length };
  }

  async submitAssignment(
    assignmentId: string,
    dto: CreateAssignmentSubmissionDto,
    files: File[],
    userId: number,
  ) {
    Logger.log({ files });
    try {
      const submission = await this.prisma.assignmentSubmission.create({
        data: {
          ...dto,
          assignmentId: +assignmentId,
          userId,
          ...(files.length !== 0
            ? {
                assignmentFiles: {
                  create: files,
                },
              }
            : {}),
        },
      });

      return submission;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('Assignment Id or User Id not found');
        }
      }
    }
  }

  async gradeAssignmentSubmission(
    dto: GradeAssignmentSubmissionDto,
    submissionId: string,
    userId: number,
  ) {
    const user = await this.userService.getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    const submission = await this.prisma.assignmentSubmission.update({
      where: {
        id: +submissionId,
      },
      data: {
        ...dto,
        graderBy: user.name,
      },
    });

    return submission;
  }
}
