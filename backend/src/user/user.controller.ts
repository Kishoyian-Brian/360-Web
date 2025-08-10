import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/password-reset.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BalanceHistoryDto } from './dto/balance-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async requestPasswordReset(
    @Body() requestResetDto: RequestPasswordResetDto,
  ): Promise<{ message: string }> {
    return this.userService.requestPasswordReset(requestResetDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid token or passwords do not match' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.resetPassword(resetPasswordDto);
  }

  // Protected endpoints below
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with filtering and pagination (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by username or email' })
  @ApiQuery({ name: 'role', required: false, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] })
  @ApiQuery({ name: 'isActive', required: false, type: 'boolean' })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getUsers(@Query() filterDto: UserFilterDto) {
    return this.userService.getUsers(filterDto);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete super admin' })
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }

  @Get('profile/me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: UserResponseDto,
  })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.userService.getUserById(req.user.id);
  }

  @Put('profile/me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(req.user.id, changePasswordDto);
  }

  // Balance Management Endpoints

  @Patch(':id/balance')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user balance (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Balance updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid transaction or insufficient balance' })
  async updateUserBalance(
    @Param('id') userId: string,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUserBalance(userId, updateBalanceDto);
  }

  @Get(':id/balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user current balance' })
  @ApiResponse({
    status: 200,
    description: 'Balance retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number', example: 500.00 },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserBalance(@Param('id') userId: string): Promise<{ balance: number }> {
    return this.userService.getUserBalance(userId);
  }

  @Get(':id/balance-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user balance history' })
  @ApiResponse({
    status: 200,
    description: 'Balance history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        history: {
          type: 'array',
          items: { $ref: '#/components/schemas/BalanceHistoryDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getBalanceHistory(
    @Param('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.getBalanceHistory(userId, page, limit);
  }

  @Get('profile/me/balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user balance' })
  @ApiResponse({
    status: 200,
    description: 'Balance retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number', example: 500.00 },
      },
    },
  })
  async getCurrentUserBalance(@Request() req): Promise<{ balance: number }> {
    return this.userService.getUserBalance(req.user.id);
  }

  @Get('profile/me/balance-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user balance history' })
  @ApiResponse({
    status: 200,
    description: 'Balance history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        history: {
          type: 'array',
          items: { $ref: '#/components/schemas/BalanceHistoryDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10 })
  async getCurrentUserBalanceHistory(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.getBalanceHistory(req.user.id, page, limit);
  }
} 