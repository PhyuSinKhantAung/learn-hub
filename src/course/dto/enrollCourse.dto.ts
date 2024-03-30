import { CourseUserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class EnrollCourseDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsEnum(CourseUserRole)
  @IsNotEmpty()
  role: CourseUserRole;
}
