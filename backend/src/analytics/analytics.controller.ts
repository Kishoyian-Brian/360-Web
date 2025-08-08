import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Response } from 'express';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comprehensive dashboard analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Analytics data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiQuery({ name: 'timeRange', required: false, type: String, description: 'Time range in days (7, 30, 90, 365)' })
  async getDashboardAnalytics(@Query('timeRange') timeRange: string = '30') {
    return this.analyticsService.getDashboardAnalytics(parseInt(timeRange));
  }

  @Get('export')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export analytics data as CSV (Admin only)' })
  @ApiResponse({ status: 200, description: 'Analytics data exported successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async exportAnalytics(@Res() res: Response) {
    const csvData = await this.analyticsService.exportAnalytics();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvData);
  }

  @Get('revenue')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get revenue analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Revenue data retrieved successfully' })
  async getRevenueAnalytics(@Query('timeRange') timeRange: string = '30') {
    return this.analyticsService.getRevenueAnalytics(parseInt(timeRange));
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order data retrieved successfully' })
  async getOrderAnalytics(@Query('timeRange') timeRange: string = '30') {
    return this.analyticsService.getOrderAnalytics(parseInt(timeRange));
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  async getUserAnalytics(@Query('timeRange') timeRange: string = '30') {
    return this.analyticsService.getUserAnalytics(parseInt(timeRange));
  }

  @Get('products')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product data retrieved successfully' })
  async getProductAnalytics(@Query('timeRange') timeRange: string = '30') {
    return this.analyticsService.getProductAnalytics(parseInt(timeRange));
  }

  @Get('performance')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system performance metrics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Performance data retrieved successfully' })
  async getPerformanceMetrics() {
    return this.analyticsService.getPerformanceMetrics();
  }
} 