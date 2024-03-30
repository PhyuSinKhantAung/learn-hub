import { IsOptional, IsString } from 'class-validator';

export class EditCourseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  courseDetails?: string;
}
