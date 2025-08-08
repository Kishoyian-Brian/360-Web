import { ApiProperty } from '@nestjs/swagger';
import { StaticPageStatus } from '@prisma/client';

export class StaticPageResponseDto {
  @ApiProperty({ description: 'Page ID', example: 'clx1234567890abcdef' })
  id: string;

  @ApiProperty({ description: 'Page title', example: 'Terms of Service' })
  title: string;

  @ApiProperty({ description: 'Page slug', example: 'terms-of-service' })
  slug: string;

  @ApiProperty({ description: 'Page content', example: '<h1>Terms of Service</h1><p>Welcome to our service...</p>' })
  content: string;

  @ApiProperty({ description: 'Meta title', example: 'Terms of Service - 360LogzShop', required: false })
  metaTitle?: string;

  @ApiProperty({ description: 'Meta description', example: 'Read our terms of service and conditions.', required: false })
  metaDescription?: string;

  @ApiProperty({ description: 'Page status', enum: StaticPageStatus, example: StaticPageStatus.PUBLISHED })
  status: StaticPageStatus;

  @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
} 