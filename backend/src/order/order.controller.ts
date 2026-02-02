import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order from cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.createOrder(req.user.id, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders (or all orders for admin)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filter by order status' })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: PaymentStatus, description: 'Filter by payment status' })
  @ApiQuery({ name: 'orderNumber', required: false, type: String, description: 'Search by order number' })
  @ApiQuery({ name: 'paymentMethod', required: false, type: String, description: 'Filter by payment method' })
  async findAll(@Request() req, @Query() filterDto: OrderFilterDto) {
    const isAdminUser = req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN';
    const userId = isAdminUser ? undefined : req.user.id;
    return this.orderService.findAll(filterDto, userId, isAdminUser);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getOrderStats() {
    return this.orderService.getOrderStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific order' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Request() req, @Param('id') id: string): Promise<OrderResponseDto> {
    const isAdminUser = req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN';
    const userId = isAdminUser ? undefined : req.user.id;
    return this.orderService.findOne(id, userId, isAdminUser);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ): Promise<OrderResponseDto> {
    return this.orderService.updateOrderStatus(id, body.status, true);
  }

  @Patch(':id/payment-status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { paymentStatus: PaymentStatus },
  ): Promise<OrderResponseDto> {
    return this.orderService.updatePaymentStatus(id, body.paymentStatus, true);
  }

  @Post(':id/payment-proof')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('paymentProof', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload payment proof for an order' })
  @ApiResponse({ status: 200, description: 'Payment proof uploaded successfully', type: OrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async uploadPaymentProof(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<OrderResponseDto> {
    console.log('Upload payment proof endpoint called');
    console.log('Order ID:', id);
    console.log('File received:', file ? file.filename : 'No file');
    console.log('User:', req.user.id, req.user.role);
    
    if (!file) {
      console.error('No file uploaded');
      throw new BadRequestException('Payment proof file is required');
    }

    // Create the URL for the uploaded file
    const paymentProofUrl = `/uploads/${file.filename}`;
    console.log('Payment proof URL:', paymentProofUrl);
    
    // Update the order with payment proof (only allow user to update their own orders unless admin)
    const isAdminUser = req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN';
    const userId = isAdminUser ? undefined : req.user.id;
    
    return this.orderService.uploadPaymentProof(id, paymentProofUrl, userId, isAdminUser);
  }

  @Get('payment-proof/:filename')
  @ApiOperation({ summary: 'Get payment proof image by filename (public access for admins)' })
  @ApiResponse({ status: 200, description: 'Payment proof image retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async getPaymentProofImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    console.log('🖼️ Payment proof image requested:', filename);
    
    try {
      const imagePath = `./uploads/${filename}`;
      console.log('📂 Looking for image at:', imagePath);
      
      // Check if file exists
      const fs = require('fs');
      const fullPath = require('path').resolve(process.cwd(), imagePath);
      console.log('🔍 Full path:', fullPath);
      
      if (!fs.existsSync(fullPath)) {
        console.log('❌ File not found at:', fullPath);
        return res.status(404).json({ message: 'Payment proof image not found' });
      }
      
      console.log('✅ File exists, serving image');
      
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      
      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase();
      const contentType = ext === 'png' ? 'image/png' : 
                         ext === 'gif' ? 'image/gif' : 
                         ext === 'webp' ? 'image/webp' : 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      
      console.log('📤 Serving payment proof image with content-type:', contentType);
      return res.sendFile(imagePath, { root: process.cwd() });
    } catch (error) {
      console.error('💥 Error serving payment proof image:', error);
      return res.status(500).json({ message: 'Error serving payment proof image' });
    }
  }

  @Get('test-uploads')
  @ApiOperation({ summary: 'Test uploads directory access' })
  async testUploads(@Res() res: Response) {
    try {
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.resolve(process.cwd(), './uploads');
      
      console.log('🔍 Testing uploads directory:', uploadsDir);
      
      if (!fs.existsSync(uploadsDir)) {
        console.log('❌ Uploads directory does not exist');
        return res.json({ error: 'Uploads directory does not exist', path: uploadsDir });
      }
      
      const files = fs.readdirSync(uploadsDir);
      console.log('📁 Files in uploads directory:', files);
      
      return res.json({ 
        message: 'Uploads directory accessible',
        path: uploadsDir,
        files: files,
        fileCount: files.length
      });
    } catch (error) {
      console.error('💥 Error testing uploads:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an order (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async deleteOrder(@Param('id') id: string): Promise<{ message: string }> {
    return this.orderService.deleteOrder(id);
  }
} 