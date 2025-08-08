import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CategoryType {
  MAIN = 'MAIN',
  MORE_LOGS = 'MORE_LOGS',
  LINKABLES = 'LINKABLES',
  TRANSFERS = 'TRANSFERS',
}

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Bank Logs',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Category slug (URL-friendly name)',
    example: 'bank-logs',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

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
    example: CategoryType.MAIN,
  })
  @IsEnum(CategoryType)
  type: CategoryType;

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
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Category display order',
    example: 1,
    minimum: 0,
    maximum: 999,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  order?: number = 0;
} 