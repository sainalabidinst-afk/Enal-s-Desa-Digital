import { IsString, IsOptional, IsEnum } from 'class-validator';
import { LetterStatus } from '../../../shared/enums/letter.enum';

export class CreateLetterDto {
  @IsString()
  citizenId!: string;

  @IsString()
  letterTypeId!: string;

  @IsString()
  subject!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(LetterStatus)
  status?: LetterStatus;
}