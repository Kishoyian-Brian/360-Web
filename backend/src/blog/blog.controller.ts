import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { BlogPostResponseDto } from './dto/blog-post-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BlogPostStatus } from '@prisma/client';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Blog Posts - Admin endpoints
  @Post('posts')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully',
    type: BlogPostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Blog post slug already exists' })
  async createBlogPost(
    @Body() createBlogPostDto: CreateBlogPostDto,
    @Request() req,
  ): Promise<BlogPostResponseDto> {
    return this.blogService.createBlogPost(createBlogPostDto, req.user.id);
  }

  @Put('posts/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated successfully',
    type: BlogPostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async updateBlogPost(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPostResponseDto> {
    return this.blogService.updateBlogPost(id, updateBlogPostDto);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Blog post deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async deleteBlogPost(@Param('id') id: string): Promise<{ message: string }> {
    return this.blogService.deleteBlogPost(id);
  }

  // Blog Posts - Public endpoints
  @Get('posts')
  @ApiOperation({ summary: 'Get all blog posts with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Blog posts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        posts: {
          type: 'array',
          items: { $ref: '#/components/schemas/BlogPostResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title or content' })
  @ApiQuery({ name: 'status', required: false, enum: BlogPostStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'categorySlug', required: false, description: 'Filter by category slug' })
  @ApiQuery({ name: 'tagId', required: false, description: 'Filter by tag ID' })
  @ApiQuery({ name: 'tagSlug', required: false, description: 'Filter by tag slug' })
  @ApiQuery({ name: 'authorId', required: false, description: 'Filter by author ID' })
  @ApiQuery({ name: 'isFeatured', required: false, type: 'boolean', description: 'Filter by featured status' })
  @ApiQuery({ name: 'year', required: false, type: 'number', description: 'Filter by year' })
  @ApiQuery({ name: 'month', required: false, type: 'number', description: 'Filter by month' })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['title', 'createdAt', 'publishedAt', 'viewCount'], example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'desc' })
  async getBlogPosts(@Query() filterDto: BlogFilterDto) {
    return this.blogService.getBlogPosts(filterDto);
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get blog post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog post retrieved successfully',
    type: BlogPostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async getBlogPostById(@Param('id') id: string): Promise<BlogPostResponseDto> {
    return this.blogService.getBlogPostById(id);
  }

  @Get('posts/slug/:slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiResponse({
    status: 200,
    description: 'Blog post retrieved successfully',
    type: BlogPostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async getBlogPostBySlug(@Param('slug') slug: string): Promise<BlogPostResponseDto> {
    return this.blogService.getBlogPostBySlug(slug);
  }

  // Blog Categories
  @Post('categories')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog category (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Blog category created successfully',
  })
  async createBlogCategory(
    @Body() body: { name: string; slug: string; description?: string; parentId?: string },
  ) {
    return this.blogService.createBlogCategory(body.name, body.slug, body.description, body.parentId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({
    status: 200,
    description: 'Blog categories retrieved successfully',
  })
  async getBlogCategories() {
    return this.blogService.getBlogCategories();
  }

  // Blog Tags
  @Post('tags')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog tag (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Blog tag created successfully',
  })
  async createBlogTag(
    @Body() body: { name: string; slug: string; description?: string },
  ) {
    return this.blogService.createBlogTag(body.name, body.slug, body.description);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get all blog tags' })
  @ApiResponse({
    status: 200,
    description: 'Blog tags retrieved successfully',
  })
  async getBlogTags() {
    return this.blogService.getBlogTags();
  }

  // Blog Comments
  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a blog post (Authenticated users)' })
  @ApiResponse({
    status: 201,
    description: 'Comment added successfully',
  })
  async createBlogComment(
    @Param('id') postId: string,
    @Body() body: { content: string; parentId?: string },
    @Request() req,
  ) {
    return this.blogService.createBlogComment(postId, req.user.id, body.content, body.parentId);
  }

  @Get('posts/:id/comments')
  @ApiOperation({ summary: 'Get comments for a blog post' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
  })
  async getBlogComments(@Param('id') postId: string) {
    return this.blogService.getBlogComments(postId);
  }

  // Special queries
  @Get('posts/featured/featured')
  @ApiOperation({ summary: 'Get featured blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Featured blog posts retrieved successfully',
    type: [BlogPostResponseDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 5 })
  async getFeaturedPosts(@Query('limit') limit: number = 5): Promise<BlogPostResponseDto[]> {
    return this.blogService.getFeaturedPosts(limit);
  }

  @Get('posts/popular/popular')
  @ApiOperation({ summary: 'Get popular blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Popular blog posts retrieved successfully',
    type: [BlogPostResponseDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 5 })
  async getPopularPosts(@Query('limit') limit: number = 5): Promise<BlogPostResponseDto[]> {
    return this.blogService.getPopularPosts(limit);
  }

  // Search and filtering shortcuts
  @Get('search')
  @ApiOperation({ summary: 'Search blog posts' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async searchBlogPosts(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const filterDto: BlogFilterDto = {
      search: query,
      page,
      limit,
    };
    return this.blogService.getBlogPosts(filterDto);
  }

  @Get('category/:slug')
  @ApiOperation({ summary: 'Get blog posts by category slug' })
  @ApiResponse({
    status: 200,
    description: 'Blog posts by category retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getBlogPostsByCategory(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const filterDto: BlogFilterDto = {
      categorySlug: slug,
      page,
      limit,
    };
    return this.blogService.getBlogPosts(filterDto);
  }

  @Get('tag/:slug')
  @ApiOperation({ summary: 'Get blog posts by tag slug' })
  @ApiResponse({
    status: 200,
    description: 'Blog posts by tag retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getBlogPostsByTag(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const filterDto: BlogFilterDto = {
      tagSlug: slug,
      page,
      limit,
    };
    return this.blogService.getBlogPosts(filterDto);
  }
} 