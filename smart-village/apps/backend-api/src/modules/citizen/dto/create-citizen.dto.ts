import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsBoolean, Matches, Length, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

export class CreateCitizenDto {
  @IsString()
  @Length(16, 16)
  nik: string;

  @IsString()
  name: string;

  @IsString()
  placeOfBirth: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  bloodType?: string;

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
  district: string;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsString()
  religion: string;

  @IsString()
  maritalStatus: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  spouseName?: string;

  @IsOptional()
  @IsString()
  familyStatus?: string;

  @IsOptional()
  @IsString()
  photo?: string;

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
  @IsString()
  placeOfBirth?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  bloodType?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  rt?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  rw?: string;

  @IsOptional()
  @IsString()
  village?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  religion?: string;

  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  spouseName?: string;

  @IsOptional()
  @IsString()
  familyStatus?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsBoolean()
  isAlive?: boolean;

  @IsOptional()
  @IsDateString()
  deathDate?: string;
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

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}