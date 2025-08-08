import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from './create-category.dto';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Bank Logs',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Category slug (URL-friendly name)',
    example: 'bank-logs',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'High-quality bank logs from various banks',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Category type',
    enum: CategoryType,
    required: false,
  })
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;

  @ApiProperty({
    description: 'Parent category ID (for subcategories)',
    example: 'clx1234567890abcdef',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: 'Category active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Category display order',
    example: 1,
    minimum: 0,
    maximum: 999,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  order?: number;
} 