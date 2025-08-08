import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { FileResponseDto } from './dto/file-response.dto';
import { FileType } from './dto/upload-file.dto';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
    transformation?: string,
  ): Promise<FileResponseDto> {
    try {
      const uploadOptions: any = {
        resource_type: 'image',
        folder: folder || '360-web/images',
      };

      if (transformation) {
        uploadOptions.transformation = transformation;
      }

      const result = await cloudinary.uploader.upload(file.path, uploadOptions);

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: new Date(result.created_at),
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload image: ' + error.message);
    }
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder?: string,
    transformation?: string,
  ): Promise<FileResponseDto> {
    try {
      const uploadOptions: any = {
        resource_type: 'video',
        folder: folder || '360-web/videos',
      };

      if (transformation) {
        uploadOptions.transformation = transformation;
      }

      const result = await cloudinary.uploader.upload(file.path, uploadOptions);

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        duration: result.duration,
        createdAt: new Date(result.created_at),
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload video: ' + error.message);
    }
  }

  async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      throw new BadRequestException('Failed to delete file: ' + error.message);
    }
  }

  async getFileUrl(publicId: string, transformation?: string): Promise<string> {
    try {
      const url = cloudinary.url(publicId, {
        secure: true,
        transformation: transformation,
      });
      return url;
    } catch (error) {
      throw new BadRequestException('Failed to get file URL: ' + error.message);
    }
  }

  async optimizeImage(publicId: string, options: any = {}): Promise<FileResponseDto> {
    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        eager: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto' },
          { width: 400, height: 300, crop: 'fill', quality: 'auto' },
        ],
        ...options,
      });

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: new Date(result.created_at),
      };
    } catch (error) {
      throw new BadRequestException('Failed to optimize image: ' + error.message);
    }
  }
} 