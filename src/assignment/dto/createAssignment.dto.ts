import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  episodeId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
