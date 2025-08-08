import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ description: 'Cloudinary public ID' })
  publicId: string;

  @ApiProperty({ description: 'File URL' })
  url: string;

  @ApiProperty({ description: 'File secure URL' })
  secureUrl: string;

  @ApiProperty({ description: 'File format' })
  format: string;

  @ApiProperty({ description: 'File size in bytes' })
  bytes: number;

  @ApiProperty({ description: 'Image width (for images)' })
  width?: number;

  @ApiProperty({ description: 'Image height (for images)' })
  height?: number;

  @ApiProperty({ description: 'Duration in seconds (for videos)' })
  duration?: number;

  @ApiProperty({ description: 'Upload timestamp' })
  createdAt: Date;
} 