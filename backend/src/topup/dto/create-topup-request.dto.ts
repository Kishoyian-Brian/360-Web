import { IsNotEmpty, IsNumber, IsString, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTopupRequestDto {
  @ApiProperty({ description: 'Amount to topup', example: 100.00 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Crypto account ID', example: 'cuid123' })
  @IsNotEmpty()
  @IsString()
  cryptoAccountId: string;

  @ApiPropertyOptional({ description: 'Payment proof URL', example: 'https://example.com/proof.jpg' })
  @IsOptional()
  @IsString()
  paymentProofUrl?: string;
}
