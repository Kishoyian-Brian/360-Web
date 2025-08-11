import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum TopupStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class TopupResponseDto {
  @ApiProperty({ description: 'Topup request ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Topup amount' })
  amount: number;

  @ApiProperty({ description: 'Crypto account ID' })
  cryptoAccountId: string;

  @ApiProperty({ description: 'Topup status', enum: TopupStatus })
  status: TopupStatus;

  @ApiPropertyOptional({ description: 'Payment proof URL' })
  paymentProofUrl?: string;

  @ApiPropertyOptional({ description: 'Admin notes' })
  adminNotes?: string;

  @ApiPropertyOptional({ description: 'When request was processed' })
  processedAt?: Date;

  @ApiPropertyOptional({ description: 'Admin who processed the request' })
  processedBy?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'User information' })
  user?: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    balance: number;
  };

  @ApiPropertyOptional({ description: 'Crypto account information' })
  cryptoAccount?: {
    id: string;
    name: string;
    symbol: string;
    address: string;
    network?: string;
  };
}
