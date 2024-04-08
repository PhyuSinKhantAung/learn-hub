import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssignmentSubmissionDto {
  @IsString()
  @IsNotEmpty()
  assignmentParagraph: string;
}
