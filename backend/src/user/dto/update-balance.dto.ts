import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, Min } from 'class-validator';

export enum BalanceTransactionType {
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  PAYMENT_APPROVAL = 'PAYMENT_APPROVAL',
  TOPUP_APPROVAL = 'TOPUP_APPROVAL',
  PURCHASE = 'PURCHASE',
  REFUND = 'REFUND',
}

export class UpdateBalanceDto {
  @ApiProperty({ description: 'Amount to add or subtract', example: 100.50 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ 
    description: 'Type of balance transaction', 
    enum: BalanceTransactionType,
    example: BalanceTransactionType.PAYMENT_APPROVAL 
  })
  @IsEnum(BalanceTransactionType)
  type: BalanceTransactionType;

  @ApiProperty({ description: 'Reason for the balance change', example: 'Payment approved for order #123' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Reference ID (payment ID, order ID, etc.)', required: false })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiProperty({ description: 'Reference type (payment, order, topup, etc.)', required: false })
  @IsOptional()
  @IsString()
  referenceType?: string;
}
