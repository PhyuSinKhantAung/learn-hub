import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GetAssignmentsDto } from './dto/getAssignments.dto';
import { CreateAssignmentSubmissionDto } from './dto/createAssignmentSubmission.dto';
import { File } from 'src/utils/file-uploading.utils';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

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

  async submitAssignment(dto: CreateAssignmentSubmissionDto, files: File[]) {
    Logger.log({ files });
    try {
      const submission = await this.prisma.assignmentSubmission.create({
        data: {
          ...dto,
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
}
