import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  lessonId: number;

  @IsArray()
  resources: string[];
}
