import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, Length, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
  LAKI_LAKI = 'LAKI_LAKI',
  PEREMPUAN = 'PEREMPUAN',
}

export class CreateCitizenDto {
  @IsString()
  @Length(16, 16)
  nik: string;

  @IsString()
  name: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  address: string;

  @IsString()
  @Length(3, 3)
  rt: string;

  @IsString()
  @Length(3, 3)
  rw: string;

  @IsString()
  villageId: string;

  @IsString()
  religion: string;

  @IsOptional()
  @IsString()
  familyCardId?: string;

  @IsOptional()
  @IsBoolean()
  isAlive?: boolean;
}

export class UpdateCitizenDto {
  @IsOptional()
  @IsString()
  @Length(16, 16)
  nik?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  rt?: string;

  @IsOptional()
  @IsString()
  rw?: string;

  @IsOptional()
  @IsString()
  religion?: string;

  @IsOptional()
  @IsString()
  familyCardId?: string;

  @IsOptional()
  @IsBoolean()
  isAlive?: boolean;
}

export class QueryCitizenDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  villageId?: string;

  @IsOptional()
  @IsString()
  rt?: string;

  @IsOptional()
  @IsString()
  rw?: string;

  @IsOptional()
  @IsBoolean()
  isAlive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}