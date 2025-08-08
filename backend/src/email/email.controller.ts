import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('email')
@Controller('email')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('welcome')
  @ApiOperation({ summary: 'Send welcome email to new user' })
  @ApiResponse({ status: 200, description: 'Welcome email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async sendWelcomeEmail(@Body() body: { to: string; username: string }): Promise<{ message: string }> {
    await this.emailService.sendWelcomeEmail(body.to, body.username);
    return { message: 'Welcome email sent successfully' };
  }

  @Post('password-reset')
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiResponse({ status: 200, description: 'Password reset email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async sendPasswordResetEmail(@Body() body: { to: string; resetToken: string }): Promise<{ message: string }> {
    await this.emailService.sendPasswordResetEmail(body.to, body.resetToken);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('order-confirmation')
  @ApiOperation({ summary: 'Send order confirmation email' })
  @ApiResponse({ status: 200, description: 'Order confirmation email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async sendOrderConfirmationEmail(@Body() body: { to: string; orderData: any }): Promise<{ message: string }> {
    await this.emailService.sendOrderConfirmationEmail(body.to, body.orderData);
    return { message: 'Order confirmation email sent successfully' };
  }

  @Post('admin-notification')
  @ApiOperation({ summary: 'Send admin notification for new order' })
  @ApiResponse({ status: 200, description: 'Admin notification email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async sendAdminNotificationEmail(@Body() body: { orderData: any }): Promise<{ message: string }> {
    await this.emailService.sendAdminNotificationEmail(body.orderData);
    return { message: 'Admin notification email sent successfully' };
  }
} 