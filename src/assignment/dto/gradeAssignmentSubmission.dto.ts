import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GradeAssignmentSubmissionDto {
  @IsString()
  @IsNotEmpty()
  graderBy: string;

  @IsNumber()
  @IsNotEmpty()
  result: number;

  @IsBoolean()
  @IsNotEmpty()
  isChecked: boolean;
}
