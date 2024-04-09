import { IsNotEmpty, IsString } from 'class-validator';

export class GetAssignmentsDto {
  @IsString()
  @IsNotEmpty()
  episodeId?: string;
}
