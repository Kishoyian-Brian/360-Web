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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ProductType } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Admin endpoints
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Product has associated orders' })
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return this.productService.deleteProduct(id);
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product stock quantity (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Stock quantity updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateStockQuantity(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<ProductResponseDto> {
    return this.productService.updateStockQuantity(id, body.quantity);
  }

  // Public endpoints
  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or description' })
  @ApiQuery({ name: 'productType', required: false, enum: ProductType, description: 'Filter by product type' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'categorySlug', required: false, description: 'Filter by category slug' })
  @ApiQuery({ name: 'categoryType', required: false, description: 'Filter by category type' })
  @ApiQuery({ name: 'isActive', required: false, type: 'boolean', description: 'Filter by active status' })
  @ApiQuery({ name: 'inStock', required: false, type: 'boolean', description: 'Filter by stock availability' })
  @ApiQuery({ name: 'minPrice', required: false, type: 'number', description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, type: 'number', description: 'Maximum price filter' })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'price', 'createdAt', 'stockQuantity'], example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'desc' })
  async getProducts(@Query() filterDto: ProductFilterDto) {
    return this.productService.getProducts(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.getProductById(id);
  }

  @Get('category/:slug')
  @ApiOperation({ summary: 'Get products by category slug' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getProductsByCategory(
    @Param('slug') slug: string,
    @Query('limit') limit: number = 10,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getProductsByCategory(slug, limit);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get products by product type' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getProductsByType(
    @Param('type') type: ProductType,
    @Query('limit') limit: number = 10,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getProductsByType(type, limit);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search products by name or description' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async searchProducts(
    @Param('query') query: string,
    @Query('limit') limit: number = 10,
  ): Promise<ProductResponseDto[]> {
    return this.productService.searchProducts(query, limit);
  }

  // Special queries
  @Get('featured/featured')
  @ApiOperation({ summary: 'Get featured products for home page' })
  @ApiResponse({
    status: 200,
    description: 'Featured products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getFeaturedProducts(@Query('limit') limit: number = 10): Promise<ProductResponseDto[]> {
    return this.productService.getFeaturedProducts(limit);
  }

  @Get('popular/popular')
  @ApiOperation({ summary: 'Get popular products' })
  @ApiResponse({
    status: 200,
    description: 'Popular products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getPopularProducts(@Query('limit') limit: number = 10): Promise<ProductResponseDto[]> {
    return this.productService.getPopularProducts(limit);
  }

  // Shop-specific endpoints
  @Get('shop/all')
  @ApiOperation({ summary: 'Get all products for shop (public catalog)' })
  @ApiResponse({
    status: 200,
    description: 'Shop products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 20 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'price', 'createdAt'], example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'desc' })
  async getShopProducts(@Query() filterDto: ProductFilterDto) {
    // For shop, we only show active products
    filterDto.isActive = true;
    return this.productService.getProducts(filterDto);
  }
} 