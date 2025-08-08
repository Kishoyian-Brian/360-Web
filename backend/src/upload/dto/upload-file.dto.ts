import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export class UploadFileDto {
  @ApiProperty({ description: 'File type (image or video)', required: false })
  @IsEnum(FileType)
  @IsOptional()
  type?: FileType;

  @ApiProperty({ description: 'Folder path in Cloudinary (optional)' })
  @IsString()
  @IsOptional()
  folder?: string;

  @ApiProperty({ description: 'Transformation options (optional)' })
  @IsString()
  @IsOptional()
  transformation?: string;
} 