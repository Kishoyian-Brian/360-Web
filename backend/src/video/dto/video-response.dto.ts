import { ApiProperty } from '@nestjs/swagger';

export class VideoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  thumbnailUrl?: string;

  @ApiProperty()
  duration?: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  platform?: string;

  @ApiProperty()
  productId?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  views: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 