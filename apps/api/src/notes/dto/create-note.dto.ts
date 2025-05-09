import { IsNotEmpty, IsNumber, IsString, IsUrl, Min } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  videoId: string;

  @IsUrl()
  @IsNotEmpty()
  videoUrl: string;

  @IsNumber()
  @Min(0)
  timestamp: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
