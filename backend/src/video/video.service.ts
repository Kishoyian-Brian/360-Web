import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoResponseDto } from './dto/video-response.dto';

@Injectable()
export class VideoService {
  constructor(private readonly prisma: PrismaService) { }

  async createVideo(createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    const video = await this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        description: createVideoDto.description,
        videoUrl: createVideoDto.videoUrl,
        thumbnailUrl: createVideoDto.thumbnailUrl,
        duration: createVideoDto.duration,
        category: createVideoDto.category,
        platform: createVideoDto.platform,
        productId: createVideoDto.productId,
        isActive: createVideoDto.isActive,
      },
    });

    return this.mapToVideoResponse(video);
  }

  async findAll(query: any) {
    const { category, platform, isActive } = query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (platform) {
      where.platform = platform;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const videos = await this.prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      videos: videos.map(video => this.mapToVideoResponse(video)),
      total: videos.length,
    };
  }

  async findOne(id: string): Promise<VideoResponseDto> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return this.mapToVideoResponse(video);
  }

  async updateVideo(id: string, updateVideoDto: UpdateVideoDto): Promise<VideoResponseDto> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    const updatedVideo = await this.prisma.video.update({
      where: { id },
      data: updateVideoDto,
    });

    return this.mapToVideoResponse(updatedVideo);
  }

  async deleteVideo(id: string): Promise<{ message: string }> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    await this.prisma.video.delete({
      where: { id },
    });

    return { message: 'Video deleted successfully' };
  }

  async incrementViews(id: string): Promise<{ message: string }> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    await this.prisma.video.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return { message: 'Views incremented successfully' };
  }

  private mapToVideoResponse(video: any): VideoResponseDto {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      category: video.category,
      platform: video.platform,
      productId: video.productId,
      isActive: video.isActive,
      views: video.views,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }
} 