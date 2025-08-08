import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID to process payment for' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ description: 'Payment gateway', required: false })
  @IsOptional()
  @IsString()
  gateway?: string;

  @ApiProperty({ description: 'Additional payment metadata', required: false })
  @IsOptional()
  metadata?: any;
} 