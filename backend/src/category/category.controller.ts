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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategorySeederService } from './category-seeder.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CategoryType } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categorySeederService: CategorySeederService,
  ) {}

  // Seeding endpoints
  @Post('seed/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed all categories (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'All categories seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        created: { type: 'number' },
        updated: { type: 'number' },
      },
    },
  })
  async seedAllCategories() {
    return this.categorySeederService.seedAllCategories();
  }

  @Post('seed/:type')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed categories by type (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Categories seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        created: { type: 'number' },
        updated: { type: 'number' },
      },
    },
  })
  async seedCategoriesByType(@Param('type') type: CategoryType) {
    return this.categorySeederService.seedCategoriesByType(type);
  }

  @Get('structure')
  @ApiOperation({ summary: 'Get complete category structure' })
  @ApiResponse({
    status: 200,
    description: 'Category structure retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        MAIN: { type: 'array' },
        MORE_LOGS: { type: 'array' },
        LINKABLES: { type: 'array' },
        TRANSFERS: { type: 'array' },
      },
    },
  })
  async getCategoryStructure() {
    return this.categorySeederService.getCategoryStructure();
  }

  // Existing CRUD endpoints
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Category with slug already exists' })
  @ApiResponse({ status: 404, description: 'Parent category not found' })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: { $ref: '#/components/schemas/CategoryResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or description' })
  @ApiQuery({ name: 'type', required: false, enum: CategoryType, description: 'Filter by category type' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Filter by parent category ID' })
  @ApiQuery({ name: 'isActive', required: false, type: 'boolean', description: 'Filter by active status' })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'createdAt', 'order'], example: 'order' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc' })
  async getCategories(@Query() filterDto: CategoryFilterDto) {
    return this.categoryService.getCategories(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  @ApiResponse({ status: 400, description: 'Invalid parent category' })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Category has associated products or subcategories' })
  async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.deleteCategory(id);
  }
} 