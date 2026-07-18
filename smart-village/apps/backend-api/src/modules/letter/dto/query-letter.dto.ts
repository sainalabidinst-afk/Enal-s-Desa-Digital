import { Type } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsUUID, IsNumber } from 'class-validator';
import { LetterStatus } from '../../../shared/enums/letter.enum';

export class QueryLetterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(LetterStatus)
  status?: LetterStatus;

  @IsOptional()
  @IsUUID()
  citizenId?: string;

  @IsOptional()
  @IsUUID()
  letterTypeId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
