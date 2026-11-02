import { IsString, IsOptional } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  villageId!: string;

  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  condition?: string;
}
