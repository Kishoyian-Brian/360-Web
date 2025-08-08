import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from './create-category.dto';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Bank Logs',
  })
  name: string;

  @ApiProperty({
    description: 'Category slug',
    example: 'bank-logs',
  })
  slug: string;

  @ApiProperty({
    description: 'Category description',
    example: 'High-quality bank logs from various banks',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Category type',
    enum: CategoryType,
    example: CategoryType.MAIN,
  })
  type: CategoryType;

  @ApiProperty({
    description: 'Parent category ID',
    example: 'clx1234567890abcdef',
    required: false,
  })
  parentId?: string;

  @ApiProperty({
    description: 'Category active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Category display order',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Category creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Category last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Number of products in this category',
    example: 25,
  })
  productCount?: number;

  @ApiProperty({
    description: 'Number of subcategories',
    example: 3,
  })
  subcategoryCount?: number;
} 