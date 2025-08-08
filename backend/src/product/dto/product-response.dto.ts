import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '@prisma/client';

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID', example: 'clx1234567890abcdef' })
  id: string;

  @ApiProperty({ description: 'Product name', example: 'Premium Bank Log' })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality bank log with full access',
  })
  description: string;

  @ApiProperty({ description: 'Product price', example: 299.99 })
  price: number;

  @ApiProperty({ description: 'Category ID', example: 'clx1234567890abcdef' })
  categoryId: string;

  @ApiProperty({
    description: 'Product type',
    enum: ProductType,
    example: ProductType.BANK_LOG,
  })
  productType: ProductType;

  @ApiProperty({ description: 'Stock quantity', example: 10 })
  stockQuantity: number;

  @ApiProperty({
    description: 'Whether the product is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether the product is featured',
    example: false,
  })
  isFeatured: boolean;

  @ApiProperty({
    description: 'Product images',
    type: [String],
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  images: string[];

  @ApiProperty({
    description: 'Product thumbnail image',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({
    description: 'Product SKU',
    example: 'PROD-001',
    required: false,
  })
  sku?: string;

  @ApiProperty({
    description: 'Product barcode',
    example: '1234567890123',
    required: false,
  })
  barcode?: string;

  // Bank Log specific fields
  @ApiProperty({
    description: 'Bank name',
    example: 'Chase Bank',
    required: false,
  })
  bankName?: string;

  @ApiProperty({
    description: 'Account balance',
    example: 5000.0,
    required: false,
  })
  balance?: number;

  @ApiProperty({ description: 'Country', example: 'USA', required: false })
  country?: string;

  @ApiProperty({
    description: 'Verification status',
    example: 'Verified',
    required: false,
  })
  verification?: string;

  // Card specific fields
  @ApiProperty({ description: 'Card type', example: 'Visa', required: false })
  cardType?: string;

  @ApiProperty({
    description: 'Bank name for card',
    example: 'Bank of America',
    required: false,
  })
  bank?: string;

  @ApiProperty({ description: 'CVV included', example: true, required: false })
  cvv?: boolean;

  // Linkable specific fields
  @ApiProperty({
    description: 'Platform name',
    example: 'PayPal',
    required: false,
  })
  platform?: string;

  @ApiProperty({
    description: 'Linkable balance',
    example: 1000.0,
    required: false,
  })
  linkableBalance?: number;

  // Transfer specific fields
  @ApiProperty({
    description: 'Transfer amount',
    example: 500.0,
    required: false,
  })
  amount?: number;

  @ApiProperty({
    description: 'Transfer speed',
    example: 'Instant',
    required: false,
  })
  speed?: string;

  @ApiProperty({
    description: 'Transfer platform',
    example: 'CashApp',
    required: false,
  })
  transferPlatform?: string;

  // Additional fields for other product types
  @ApiProperty({
    description: 'Account type',
    example: 'Savings',
    required: false,
  })
  accountType?: string;

  @ApiProperty({
    description: 'Last activity date',
    example: '2024-01-01',
    required: false,
  })
  lastActivity?: string;

  @ApiProperty({
    description: 'Transfer type',
    example: 'P2P',
    required: false,
  })
  transferType?: string;

  @ApiProperty({ description: 'Transfer fees', example: 5.0, required: false })
  fees?: number;

  @ApiProperty({
    description: 'Tool type',
    example: 'Carding Tool',
    required: false,
  })
  toolType?: string;

  @ApiProperty({
    description: 'Tool features',
    example: 'Auto-fill, BIN Check',
    required: false,
  })
  features?: string;

  @ApiProperty({
    description: 'Compatibility',
    example: 'Windows, Mac',
    required: false,
  })
  compatibility?: string;

  @ApiProperty({
    description: 'Video duration in seconds',
    example: 300,
    required: false,
  })
  duration?: number;

  @ApiProperty({ description: 'Video format', example: 'MP4', required: false })
  format?: string;

  @ApiProperty({ description: 'Video quality', example: 'HD', required: false })
  quality?: string;

  @ApiProperty({
    description: 'Wallet address',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    required: false,
  })
  walletAddress?: string;

  @ApiProperty({
    description: 'Transaction count',
    example: 50,
    required: false,
  })
  transactionCount?: number;

  @ApiProperty({ description: 'Risk level', example: 'High', required: false })
  riskLevel?: string;

  @ApiProperty({
    description: 'Check amount',
    example: 2500.0,
    required: false,
  })
  checkAmount?: number;

  @ApiProperty({
    description: 'Gift card value',
    example: 100.0,
    required: false,
  })
  giftCardValue?: number;

  @ApiProperty({
    description: 'Gift card code',
    example: 'GC123456789',
    required: false,
  })
  giftCardCode?: string;

  @ApiProperty({
    description: 'Personal info included',
    example: true,
    required: false,
  })
  personalInfo?: boolean;

  @ApiProperty({
    description: 'Financial info included',
    example: true,
    required: false,
  })
  financialInfo?: boolean;

  @ApiProperty({
    description: 'Contact info included',
    example: true,
    required: false,
  })
  contactInfo?: boolean;

  @ApiProperty({
    description: 'Security features',
    example: '2FA, VPN',
    required: false,
  })
  securityFeatures?: string;

  @ApiProperty({
    description: 'Shake type',
    example: 'Money Transfer',
    required: false,
  })
  shakeType?: string;

  @ApiProperty({
    description: 'Shake amount',
    example: 1000.0,
    required: false,
  })
  shakeAmount?: number;

  // Timestamps
  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  // Category information
  @ApiProperty({ description: 'Category information', required: false })
  category?: {
    id: string;
    name: string;
    slug: string;
    type: string;
  };
}
