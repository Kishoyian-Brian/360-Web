import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsArray, IsUrl } from 'class-validator';
import { BlogPostStatus } from '@prisma/client';

export class CreateBlogPostDto {
  @ApiProperty({ description: 'Blog post title', example: 'How to Use Bank Logs Safely' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Blog post slug (URL-friendly)', example: 'how-to-use-bank-logs-safely' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Blog post content (HTML/markdown)', example: '<p>This is the blog content...</p>' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Blog post excerpt/summary', example: 'Learn the best practices for using bank logs safely and securely.', required: false })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ description: 'Blog post status', enum: BlogPostStatus, example: BlogPostStatus.DRAFT })
  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus = BlogPostStatus.DRAFT;

  @ApiProperty({ description: 'Featured image URL', example: 'https://example.com/featured-image.jpg', required: false })
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiProperty({ description: 'Meta title for SEO', example: 'Bank Logs Safety Guide - 360LogzShop', required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ description: 'Meta description for SEO', example: 'Learn how to use bank logs safely with our comprehensive guide.', required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ description: 'SEO keywords', example: 'bank logs, safety, guide, tutorial', required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({ description: 'Whether the post is featured', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @ApiProperty({ description: 'Category ID', example: 'clx1234567890abcdef', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: 'Tag IDs array', type: [String], example: ['tag1', 'tag2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiProperty({ description: 'Publish date (ISO string)', example: '2024-01-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsString()
  publishedAt?: string;
} 