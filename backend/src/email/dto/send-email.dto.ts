import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';

export enum EmailType {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  ORDER_CONFIRMATION = 'order_confirmation',
  ORDER_STATUS_UPDATE = 'order_status_update',
  ADMIN_NOTIFICATION = 'admin_notification',
}

export class SendEmailDto {
  @ApiProperty({ description: 'Recipient email address' })
  @IsEmail()
  to: string;

  @ApiProperty({ description: 'Email subject' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Email type for template selection' })
  @IsEnum(EmailType)
  type: EmailType;

  @ApiProperty({ description: 'Email template data' })
  @IsOptional()
  data?: Record<string, any>;
}

export class SendTemplateEmailDto {
  @ApiProperty({ description: 'Recipient email address' })
  @IsEmail()
  to: string;

  @ApiProperty({ description: 'Email subject' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Template name' })
  @IsString()
  template: string;

  @ApiProperty({ description: 'Template data' })
  @IsOptional()
  data?: Record<string, any>;
} 