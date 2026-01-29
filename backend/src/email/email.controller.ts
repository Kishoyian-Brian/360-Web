import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('email')
@Controller('email')
@ApiBearerAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('welcome')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Send welcome email to new user' })
  @ApiResponse({ status: 200, description: 'Welcome email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async sendWelcomeEmail(@Body() body: { to: string; username: string }): Promise<{ message: string }> {
    await this.emailService.sendWelcomeEmail(body.to, body.username);
    return { message: 'Welcome email sent successfully' };
  }

  @Post('password-reset')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiResponse({ status: 200, description: 'Password reset email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async sendPasswordResetEmail(@Body() body: { to: string; resetToken: string }): Promise<{ message: string }> {
    await this.emailService.sendPasswordResetEmail(body.to, body.resetToken);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('order-confirmation')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Send order confirmation email' })
  @ApiResponse({ status: 200, description: 'Order confirmation email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async sendOrderConfirmationEmail(@Body() body: { to: string; orderData: any }): Promise<{ message: string }> {
    await this.emailService.sendOrderConfirmationEmail(body.to, body.orderData);
    return { message: 'Order confirmation email sent successfully' };
  }

  @Post('admin-notification')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Send admin notification for new order' })
  @ApiResponse({ status: 200, description: 'Admin notification email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async sendAdminNotificationEmail(@Body() body: { orderData: any }): Promise<{ message: string }> {
    await this.emailService.sendAdminNotificationEmail(body.orderData);
    return { message: 'Admin notification email sent successfully' };
  }

  @Post('download-request')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send download request to admin' })
  @ApiResponse({ status: 200, description: 'Download request email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendDownloadRequest(@Body() body: { userEmail: string; productInfo: string }): Promise<{ message: string }> {
    await this.emailService.sendDownloadRequestEmail(body.userEmail, body.productInfo);
    return { message: 'Download request email sent successfully' };
  }
} 