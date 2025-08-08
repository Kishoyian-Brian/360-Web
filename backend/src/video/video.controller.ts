import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoResponseDto } from './dto/video-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('videos')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new video (Admin only)' })
  @ApiResponse({ status: 201, description: 'Video created successfully', type: VideoResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async createVideo(@Body() createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    return this.videoService.createVideo(createVideoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'Videos retrieved successfully' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'platform', required: false, type: String, description: 'Filter by platform' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  async findAll(@Query() query: any) {
    return this.videoService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific video' })
  @ApiResponse({ status: 200, description: 'Video retrieved successfully', type: VideoResponseDto })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async findOne(@Param('id') id: string): Promise<VideoResponseDto> {
    return this.videoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a video (Admin only)' })
  @ApiResponse({ status: 200, description: 'Video updated successfully', type: VideoResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async updateVideo(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    return this.videoService.updateVideo(id, updateVideoDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle video status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Video status updated successfully', type: VideoResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async toggleStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ): Promise<VideoResponseDto> {
    return this.videoService.updateVideo(id, { isActive: body.isActive });
  }

  @Patch(':id/views')
  @ApiOperation({ summary: 'Increment video views' })
  @ApiResponse({ status: 200, description: 'Views incremented successfully' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async incrementViews(@Param('id') id: string): Promise<{ message: string }> {
    return this.videoService.incrementViews(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a video (Admin only)' })
  @ApiResponse({ status: 200, description: 'Video deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async deleteVideo(@Param('id') id: string): Promise<{ message: string }> {
    return this.videoService.deleteVideo(id);
  }
} 