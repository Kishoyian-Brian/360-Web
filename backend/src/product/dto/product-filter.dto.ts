import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductType } from '@prisma/client';

export class ProductFilterDto {
  @ApiProperty({
    description: 'Search term for product name or description',
    required: false,
    example: 'bank log',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by product type',
    enum: ProductType,
    required: false,
    example: ProductType.BANK_LOG,
  })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;

  @ApiProperty({
    description: 'Filter by category ID',
    required: false,
    example: 'clx1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Filter by category slug',
    required: false,
    example: 'bank-logs',
  })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiProperty({
    description: 'Filter by category type',
    required: false,
    example: 'MAIN',
  })
  @IsOptional()
  @IsString()
  categoryType?: string;

  @ApiProperty({
    description: 'Filter by active status',
    required: false,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Filter by in stock status',
    required: false,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  inStock?: boolean;

  @ApiProperty({
    description: 'Filter by featured status',
    required: false,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    description: 'Minimum price filter',
    required: false,
    example: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price filter',
    required: false,
    example: 1000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Filter by bank name',
    required: false,
    example: 'Chase',
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({
    description: 'Filter by country',
    required: false,
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Filter by platform',
    required: false,
    example: 'PayPal',
  })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({
    description: 'Filter by card type',
    required: false,
    example: 'Visa',
  })
  @IsOptional()
  @IsString()
  cardType?: string;

  @ApiProperty({
    description: 'Filter by transfer speed',
    required: false,
    example: 'Instant',
  })
  @IsOptional()
  @IsString()
  speed?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Field to sort by',
    required: false,
    example: 'price',
    enum: ['name', 'price', 'createdAt', 'stockQuantity'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Sort order (asc or desc)',
    required: false,
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
} 