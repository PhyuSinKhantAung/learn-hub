import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class GradeAssignmentSubmissionDto {
  @IsNumber()
  @IsNotEmpty()
  result: number;

  @IsBoolean()
  @IsNotEmpty()
  isChecked: boolean;

  @IsNumber()
  @IsNotEmpty()
  submissionId: number;
}
