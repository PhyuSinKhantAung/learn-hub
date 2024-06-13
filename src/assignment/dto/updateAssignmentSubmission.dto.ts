import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAssignmentSubmissionDto {
  @IsString()
  @IsNotEmpty()
  assignmentParagraph: string;
}
