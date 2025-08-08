import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { StaticPageStatus } from '@prisma/client';

export class CreateStaticPageDto {
  @ApiProperty({ description: 'Page title', example: 'Terms of Service' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Page slug (URL-friendly)', example: 'terms-of-service' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Page content (HTML)', example: '<h1>Terms of Service</h1><p>Welcome to our service...</p>' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Meta title for SEO', example: 'Terms of Service - 360LogzShop', required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ description: 'Meta description for SEO', example: 'Read our terms of service and conditions.', required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ description: 'Page status', enum: StaticPageStatus, example: StaticPageStatus.PUBLISHED, required: false })
  @IsOptional()
  @IsEnum(StaticPageStatus)
  status?: StaticPageStatus = StaticPageStatus.PUBLISHED;
} 