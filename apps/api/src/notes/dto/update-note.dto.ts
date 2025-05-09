import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateNoteDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  timestamp?: number;

  @IsString()
  @IsOptional()
  content?: string;
}
