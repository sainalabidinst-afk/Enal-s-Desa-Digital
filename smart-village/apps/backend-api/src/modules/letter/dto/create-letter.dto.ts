import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { LetterStatus } from '../../../shared/enums/letter.enum';

export class CreateLetterDto {
  @IsUUID()
  citizenId: string;

  @IsUUID()
  letterTypeId: string;

  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(LetterStatus)
  status?: LetterStatus;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
