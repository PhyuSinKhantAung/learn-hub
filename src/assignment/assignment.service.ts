import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto, GradeAssignmentSubmissionDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateAssignmentSubmissionDto } from './dto/createAssignmentSubmission.dto';
import { File } from 'src/utils/file-uploading.utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AssignmentService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getAssignmentsByEpisodeId(episodeId: string) {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        episodeId: +episodeId,
      },
    });
    return { data: assignments, count: assignments.length };
  }

  async getAssignmentSubmissions(assignmentId: string) {
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: {
        assignmentId: +assignmentId,
      },
      include: {
        assignmentFiles: true,
        assignment: true,
      },
    });

    return { data: submissions, count: submissions.length };
  }

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

  async submitAssignment(
    assignmentId: string,
    dto: CreateAssignmentSubmissionDto,
    files: File[],
    userId: number,
  ) {
    Logger.log({
      data: {
        ...dto,
        assignmentId: +assignmentId,
        userId,
        ...(files?.length !== 0
          ? {
              assignmentFiles: {
                create: files,
              },
            }
          : {}),
      },
    });
    try {
      const submission = await this.prisma.assignmentSubmission.create({
        data: {
          ...dto,
          assignmentId: +assignmentId,
          userId: +userId,
          ...(files && files?.length !== 0
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
      Logger.log({ error });
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('Assignment Id or User Id not found');
        }

        if (error.code === 'P2002') {
          throw new ConflictException('User already submitted this assignment');
        }
      }

      throw error;
    }
  }

  async gradeAssignmentSubmission(
    dto: GradeAssignmentSubmissionDto,
    submissionId: string,
    assignmentId: string,
    userId: number,
  ) {
    const user = await this.userService.getUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    const submission = await this.prisma.assignmentSubmission.update({
      where: {
        id: +submissionId,
        assignmentId: +assignmentId,
      },
      data: {
        ...dto,
        graderBy: user.name,
      },
    });

    return submission;
  }

  async getAssignmentById(assignmentId: number) {
    const assignment = await this.prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

    return assignment;
  }

  async getUserAssignmentsResult(userId: number) {
    const result = await this.prisma.assignmentSubmission.aggregate({
      where: {
        userId,
      },

      _sum: {
        result: true,
      },
    });

    return result;
  }
}
