import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditLessonDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  courseId: number;
}
