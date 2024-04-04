import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  resources: string[];
}
