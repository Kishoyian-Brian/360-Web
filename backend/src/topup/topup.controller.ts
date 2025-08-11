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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TopupService } from './topup.service';
import { CreateTopupRequestDto } from './dto/create-topup-request.dto';
import { TopupFilterDto } from './dto/topup-filter.dto';
import { TopupResponseDto } from './dto/topup-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('topups')
@Controller('topups')
export class TopupController {
  constructor(private readonly topupService: TopupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new topup request' })
  @ApiResponse({ status: 201, description: 'Topup request created successfully', type: TopupResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Crypto account not found' })
  async createTopupRequest(
    @Request() req: any,
    @Body() createTopupDto: CreateTopupRequestDto,
  ): Promise<TopupResponseDto> {
    return this.topupService.createTopupRequest(req.user.id, createTopupDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all topup requests (Admin only)' })
  @ApiResponse({ status: 200, description: 'Topup requests retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getTopupRequests(@Query() filters: TopupFilterDto): Promise<{
    topups: TopupResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.topupService.getTopupRequests(filters);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get topup statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Topup statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getTopupStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
  }> {
    return this.topupService.getTopupStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get topup request by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Topup request retrieved successfully', type: TopupResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Topup request not found' })
  async getTopupRequestById(@Param('id') id: string): Promise<TopupResponseDto> {
    return this.topupService.getTopupRequestById(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve topup request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Topup request approved successfully', type: TopupResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Topup request not found' })
  @ApiResponse({ status: 400, description: 'Topup request is not pending' })
  async approveTopupRequest(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { notes?: string },
  ): Promise<TopupResponseDto> {
    return this.topupService.approveTopupRequest(id, req.user.id, body.notes);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject topup request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Topup request rejected successfully', type: TopupResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Topup request not found' })
  @ApiResponse({ status: 400, description: 'Topup request is not pending' })
  async rejectTopupRequest(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { notes?: string },
  ): Promise<TopupResponseDto> {
    return this.topupService.rejectTopupRequest(id, req.user.id, body.notes);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete topup request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Topup request deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Topup request not found' })
  async deleteTopupRequest(@Param('id') id: string): Promise<{ message: string }> {
    return this.topupService.deleteTopupRequest(id);
  }
}
