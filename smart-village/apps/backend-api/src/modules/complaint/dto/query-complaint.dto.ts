import { Type } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ComplaintStatus, ComplaintCategory } from '../../../shared/enums/complaint.enum';

export class QueryComplaintDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;

  @IsOptional()
  @IsEnum(ComplaintCategory)
  category?: ComplaintCategory;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
