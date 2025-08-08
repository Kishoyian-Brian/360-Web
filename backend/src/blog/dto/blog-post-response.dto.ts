import { ApiProperty } from '@nestjs/swagger';
import { BlogPostStatus } from '@prisma/client';

export class BlogPostResponseDto {
  @ApiProperty({ description: 'Blog post ID', example: 'clx1234567890abcdef' })
  id: string;

  @ApiProperty({ description: 'Blog post title', example: 'How to Use Bank Logs Safely' })
  title: string;

  @ApiProperty({ description: 'Blog post slug', example: 'how-to-use-bank-logs-safely' })
  slug: string;

  @ApiProperty({ description: 'Blog post content', example: '<p>This is the blog content...</p>' })
  content: string;

  @ApiProperty({ description: 'Blog post excerpt', example: 'Learn the best practices...', required: false })
  excerpt?: string;

  @ApiProperty({ description: 'Blog post status', enum: BlogPostStatus, example: BlogPostStatus.PUBLISHED })
  status: BlogPostStatus;

  @ApiProperty({ description: 'Featured image URL', example: 'https://example.com/image.jpg', required: false })
  featuredImage?: string;

  @ApiProperty({ description: 'Meta title', example: 'Bank Logs Safety Guide', required: false })
  metaTitle?: string;

  @ApiProperty({ description: 'Meta description', example: 'Learn how to use bank logs safely', required: false })
  metaDescription?: string;

  @ApiProperty({ description: 'SEO keywords', example: 'bank logs, safety, guide', required: false })
  keywords?: string;

  @ApiProperty({ description: 'View count', example: 150 })
  viewCount: number;

  @ApiProperty({ description: 'Whether the post is featured', example: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Publish date', example: '2024-01-01T00:00:00.000Z', required: false })
  publishedAt?: Date;

  @ApiProperty({ description: 'Author ID', example: 'clx1234567890abcdef' })
  authorId: string;

  @ApiProperty({ description: 'Category ID', example: 'clx1234567890abcdef', required: false })
  categoryId?: string;

  @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  // Related data
  @ApiProperty({ description: 'Author information', required: false })
  author?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiProperty({ description: 'Category information', required: false })
  category?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({ description: 'Tags array', type: [Object], required: false })
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  @ApiProperty({ description: 'Comments count', example: 5, required: false })
  commentsCount?: number;
} 