import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAssignmentSubmissionDto {
  @IsString()
  @IsNotEmpty()
  assignmentParagraph: string;

  @IsNumber()
  @IsNotEmpty()
  assignmentId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
