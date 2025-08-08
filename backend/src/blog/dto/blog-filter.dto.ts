import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { BlogPostStatus } from '@prisma/client';

export class BlogFilterDto {
  @ApiProperty({
    description: 'Search term for blog title or content',
    required: false,
    example: 'bank logs',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by blog post status',
    enum: BlogPostStatus,
    required: false,
    example: BlogPostStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;

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
    example: 'tutorials',
  })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiProperty({
    description: 'Filter by tag ID',
    required: false,
    example: 'clx1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  tagId?: string;

  @ApiProperty({
    description: 'Filter by tag slug',
    required: false,
    example: 'banking',
  })
  @IsOptional()
  @IsString()
  tagSlug?: string;

  @ApiProperty({
    description: 'Filter by author ID',
    required: false,
    example: 'clx1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  authorId?: string;

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
    description: 'Filter by published date (year)',
    required: false,
    example: 2024,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  year?: number;

  @ApiProperty({
    description: 'Filter by published date (month)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number;

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
    example: 'createdAt',
    enum: ['title', 'createdAt', 'publishedAt', 'viewCount'],
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