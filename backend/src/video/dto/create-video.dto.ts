import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsNumber, IsBoolean } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ description: 'Video title', example: 'Complete Cashout Tutorial' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Video description', example: 'Step-by-step guide to successful cashout', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Video URL', example: 'https://example.com/video.mp4', required: false })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({ description: 'Thumbnail URL', example: 'https://example.com/thumbnail.jpg', required: false })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Video duration in seconds', example: 300, required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: 'Video category', example: 'cashout' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Video platform', example: 'youtube', required: false })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ description: 'Related product ID', example: 'clx1234567890abcdef', required: false })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ description: 'Whether the video is active', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
} 