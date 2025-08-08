import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Delete,
  Param,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { UploadFileDto, FileType } from './dto/upload-file.dto';
import { FileResponseDto } from './dto/file-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Express } from 'express';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('image')
  @ApiOperation({ summary: 'Upload image to Cloudinary' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully', type: FileResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file or upload failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Automatically set type to 'image' for image uploads
    uploadFileDto.type = FileType.IMAGE;

    return this.uploadService.uploadImage(
      file,
      uploadFileDto.folder,
      uploadFileDto.transformation,
    );
  }

  @Post('video')
  @ApiOperation({ summary: 'Upload video to Cloudinary' })
  @ApiResponse({ status: 201, description: 'Video uploaded successfully', type: FileResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file or upload failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm)$/)) {
          return cb(new Error('Only video files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
      },
    }),
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Automatically set type to 'video' for video uploads
    uploadFileDto.type = FileType.VIDEO;

    return this.uploadService.uploadVideo(
      file,
      uploadFileDto.folder,
      uploadFileDto.transformation,
    );
  }

  @Delete(':publicId')
  @ApiOperation({ summary: 'Delete file from Cloudinary' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'Failed to delete file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async deleteFile(@Param('publicId') publicId: string): Promise<{ message: string }> {
    await this.uploadService.deleteFile(publicId);
    return { message: 'File deleted successfully' };
  }

  @Get(':publicId/url')
  @ApiOperation({ summary: 'Get file URL from Cloudinary' })
  @ApiResponse({ status: 200, description: 'File URL retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Failed to get file URL' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getFileUrl(
    @Param('publicId') publicId: string,
    @Query('transformation') transformation?: string,
  ): Promise<{ url: string }> {
    const url = await this.uploadService.getFileUrl(publicId, transformation);
    return { url };
  }

  @Post(':publicId/optimize')
  @ApiOperation({ summary: 'Optimize image in Cloudinary' })
  @ApiResponse({ status: 200, description: 'Image optimized successfully', type: FileResponseDto })
  @ApiResponse({ status: 400, description: 'Failed to optimize image' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async optimizeImage(
    @Param('publicId') publicId: string,
    @Body() options: any,
  ): Promise<FileResponseDto> {
    return this.uploadService.optimizeImage(publicId, options);
  }
} 