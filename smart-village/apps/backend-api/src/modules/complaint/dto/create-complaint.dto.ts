import { IsString, IsOptional, IsEnum, IsArray, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ComplaintCategory } from '../../../shared/enums/complaint.enum';

export class CreateComplaintDto {
  @IsEnum(ComplaintCategory)
  category: ComplaintCategory;

  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Max(180)
  @Min(-180)
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @IsString()
  reporterName: string;

  @IsString()
  reporterPhone: string;

  @IsOptional()
  @IsString()
  reporterEmail?: string;

  @IsOptional()
  isAnonymous?: boolean;
}
