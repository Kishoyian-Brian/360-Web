import { ApiProperty } from '@nestjs/swagger';

export class BalanceHistoryDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Transaction amount', example: 100.50 })
  amount: number;

  @ApiProperty({ description: 'Transaction type', example: 'PAYMENT_APPROVAL' })
  type: string;

  @ApiProperty({ description: 'Transaction reason', example: 'Payment approved for order #123' })
  reason: string;

  @ApiProperty({ description: 'Previous balance', example: 500.00 })
  previousBalance: number;

  @ApiProperty({ description: 'New balance after transaction', example: 600.50 })
  newBalance: number;

  @ApiProperty({ description: 'Reference ID', required: false })
  referenceId?: string;

  @ApiProperty({ description: 'Reference type', required: false })
  referenceType?: string;

  @ApiProperty({ description: 'Transaction date' })
  createdAt: string;
}
