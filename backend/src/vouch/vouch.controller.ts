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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { VouchService } from './vouch.service';
import { VouchSeederService } from './vouch-seeder.service';
import { CreateVouchDto } from './dto/create-vouch.dto';
import { UpdateVouchDto } from './dto/update-vouch.dto';
import { VouchFilterDto } from './dto/vouch-filter.dto';
import { VouchResponseDto } from './dto/vouch-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('vouches')
@Controller('vouches')
export class VouchController {
  constructor(
    private readonly vouchService: VouchService,
    private readonly vouchSeederService: VouchSeederService,
  ) {}

  @Post('seed')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed vouches with sample data (Admin only)' })
  @ApiResponse({ status: 201, description: 'Vouches seeded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async seedVouches() {
    return this.vouchSeederService.seedVouches();
  }

  @Delete('seed/clear')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear all vouches (Admin only)' })
  @ApiResponse({ status: 204, description: 'All vouches cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async clearVouches() {
    return this.vouchSeederService.clearVouches();
  }

  @Get('seed/stats')
  @ApiOperation({ summary: 'Get vouch seeding statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getSeedStats() {
    return this.vouchSeederService.getVouchStats();
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vouch (Admin only)' })
  @ApiResponse({ status: 201, description: 'Vouch created successfully', type: VouchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async create(@Body() createVouchDto: CreateVouchDto): Promise<VouchResponseDto> {
    return this.vouchService.create(createVouchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vouches with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Vouches retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'username', required: false, type: String, description: 'Filter by username' })
  @ApiQuery({ name: 'rating', required: false, type: Number, description: 'Filter by rating' })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean, description: 'Filter by verification status' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'], description: 'Filter by status' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in username and review text' })
  async findAll(@Query() filterDto: VouchFilterDto) {
    return this.vouchService.findAll(filterDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get vouch statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.vouchService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific vouch by ID' })
  @ApiResponse({ status: 200, description: 'Vouch retrieved successfully', type: VouchResponseDto })
  @ApiResponse({ status: 404, description: 'Vouch not found' })
  async findOne(@Param('id') id: string): Promise<VouchResponseDto> {
    return this.vouchService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vouch (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vouch updated successfully', type: VouchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Vouch not found' })
  async update(
    @Param('id') id: string,
    @Body() updateVouchDto: UpdateVouchDto,
  ): Promise<VouchResponseDto> {
    return this.vouchService.update(id, updateVouchDto);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a vouch (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vouch approved successfully', type: VouchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Vouch not found' })
  async approveVouch(@Param('id') id: string): Promise<VouchResponseDto> {
    return this.vouchService.approveVouch(id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a vouch (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vouch rejected successfully', type: VouchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Vouch not found' })
  async rejectVouch(@Param('id') id: string): Promise<VouchResponseDto> {
    return this.vouchService.rejectVouch(id);
  }

  @Patch(':id/toggle-verification')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle verification status of a vouch (Admin only)' })
  @ApiResponse({ status: 200, description: 'Verification status toggled successfully', type: VouchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Vouch not found' })
  async toggleVerification(@Param('id') id: string): Promise<VouchResponseDto> {
    return this.vouchService.toggleVerification(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a vouch (Admin only)' })
  @ApiResponse({ status: 204, description: 'Vouch deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Vouch not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.vouchService.remove(id);
  }
}
