import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StaticPagesService } from './static-pages.service';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { StaticPageResponseDto } from './dto/static-page-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Static Pages')
@Controller('pages')
export class StaticPagesController {
  constructor(private readonly staticPagesService: StaticPagesService) {}

  // Create static page (Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new static page (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Static page created successfully',
    type: StaticPageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Page slug already exists' })
  async createStaticPage(
    @Body() createStaticPageDto: CreateStaticPageDto,
  ): Promise<StaticPageResponseDto> {
    return this.staticPagesService.createStaticPage(createStaticPageDto);
  }

  // Get all static pages (Public)
  @Get()
  @ApiOperation({ summary: 'Get all published static pages' })
  @ApiResponse({
    status: 200,
    description: 'Static pages retrieved successfully',
    type: [StaticPageResponseDto],
  })
  async getAllStaticPages(): Promise<StaticPageResponseDto[]> {
    return this.staticPagesService.getAllStaticPages();
  }

  // Get static page by ID (Public)
  @Get(':id')
  @ApiOperation({ summary: 'Get static page by ID' })
  @ApiResponse({
    status: 200,
    description: 'Static page retrieved successfully',
    type: StaticPageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Static page not found' })
  async getStaticPageById(@Param('id') id: string): Promise<StaticPageResponseDto> {
    return this.staticPagesService.getStaticPageById(id);
  }

  // Get static page by slug (Public)
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get static page by slug' })
  @ApiResponse({
    status: 200,
    description: 'Static page retrieved successfully',
    type: StaticPageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Static page not found' })
  async getStaticPageBySlug(@Param('slug') slug: string): Promise<StaticPageResponseDto> {
    return this.staticPagesService.getStaticPageBySlug(slug);
  }

  // Update static page (Admin only)
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update static page (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Static page updated successfully',
    type: StaticPageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Static page not found' })
  async updateStaticPage(
    @Param('id') id: string,
    @Body() updateStaticPageDto: UpdateStaticPageDto,
  ): Promise<StaticPageResponseDto> {
    return this.staticPagesService.updateStaticPage(id, updateStaticPageDto);
  }

  // Delete static page (Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete static page (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Static page deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Static page not found' })
  async deleteStaticPage(@Param('id') id: string): Promise<{ message: string }> {
    return this.staticPagesService.deleteStaticPage(id);
  }
} 