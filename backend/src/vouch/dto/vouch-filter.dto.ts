import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsBoolean, IsString, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { VouchStatus } from '@prisma/client';

export class VouchFilterDto {
  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Items per page', default: 10, maximum: 100 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Filter by username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false, description: 'Filter by rating' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ required: false, description: 'Filter by verification status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ required: false, description: 'Filter by status', enum: VouchStatus })
  @IsOptional()
  @IsEnum(VouchStatus)
  status?: VouchStatus;

  @ApiProperty({ required: false, description: 'Search in review text' })
  @IsOptional()
  @IsString()
  search?: string;
} 