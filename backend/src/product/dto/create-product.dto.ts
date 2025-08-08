import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min, IsArray, IsBoolean, IsUrl } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  // Basic product fields
  @ApiProperty({ description: 'Product name', example: 'Premium Bank Log' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'High-quality bank log with full access' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Product price', example: 299.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Category ID', example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Product type', enum: ProductType, example: ProductType.BANK_LOG })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiProperty({ description: 'Stock quantity', example: 10 })
  @IsNumber()
  @Min(0)
  stockQuantity: number = 0;

  @ApiProperty({ description: 'Product images URLs', type: [String], example: ['https://example.com/image1.jpg'] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[] = [];

  @ApiProperty({
    description: 'Whether the product is active',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Whether the product is featured',
    required: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @ApiProperty({
    description: 'Product SKU',
    required: false,
    example: 'PROD-001',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  // Bank Log specific fields
  @ApiProperty({ description: 'Bank name', example: 'Chase Bank', required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ description: 'Account balance', example: 5000.00, required: false })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({ description: 'Country', example: 'USA', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Verification status', example: 'Verified', required: false })
  @IsOptional()
  @IsString()
  verification?: string;

  // Card specific fields
  @ApiProperty({ description: 'Card type', example: 'Visa', required: false })
  @IsOptional()
  @IsString()
  cardType?: string;

  @ApiProperty({ description: 'Bank name for card', example: 'Bank of America', required: false })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiProperty({ description: 'CVV included', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  cvv?: boolean;

  // Linkable specific fields
  @ApiProperty({ description: 'Platform name', example: 'PayPal', required: false })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ description: 'Linkable balance', example: 1000.00, required: false })
  @IsOptional()
  @IsNumber()
  linkableBalance?: number;

  // Transfer specific fields
  @ApiProperty({ description: 'Transfer amount', example: 500.00, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: 'Transfer speed', example: 'Instant', required: false })
  @IsOptional()
  @IsString()
  speed?: string;

  @ApiProperty({ description: 'Transfer platform', example: 'CashApp', required: false })
  @IsOptional()
  @IsString()
  transferPlatform?: string;

  // Additional fields for other product types
  @ApiProperty({ description: 'Account type', example: 'Savings', required: false })
  @IsOptional()
  @IsString()
  accountType?: string;

  @ApiProperty({ description: 'Last activity date', example: '2024-01-01', required: false })
  @IsOptional()
  @IsString()
  lastActivity?: string;

  @ApiProperty({ description: 'Transfer type', example: 'P2P', required: false })
  @IsOptional()
  @IsString()
  transferType?: string;

  @ApiProperty({ description: 'Transfer fees', example: 5.00, required: false })
  @IsOptional()
  @IsNumber()
  fees?: number;

  @ApiProperty({ description: 'Tool type', example: 'Carding Tool', required: false })
  @IsOptional()
  @IsString()
  toolType?: string;

  @ApiProperty({ description: 'Tool features', example: 'Auto-fill, BIN Check', required: false })
  @IsOptional()
  @IsString()
  features?: string;

  @ApiProperty({ description: 'Compatibility', example: 'Windows, Mac', required: false })
  @IsOptional()
  @IsString()
  compatibility?: string;

  @ApiProperty({ description: 'Video duration in seconds', example: 300, required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: 'Video format', example: 'MP4', required: false })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiProperty({ description: 'Video quality', example: 'HD', required: false })
  @IsOptional()
  @IsString()
  quality?: string;

  @ApiProperty({ description: 'Wallet address', example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', required: false })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @ApiProperty({ description: 'Transaction count', example: 50, required: false })
  @IsOptional()
  @IsNumber()
  transactionCount?: number;

  @ApiProperty({ description: 'Risk level', example: 'High', required: false })
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @ApiProperty({ description: 'Check amount', example: 2500.00, required: false })
  @IsOptional()
  @IsNumber()
  checkAmount?: number;

  @ApiProperty({ description: 'Gift card value', example: 100.00, required: false })
  @IsOptional()
  @IsNumber()
  giftCardValue?: number;

  @ApiProperty({ description: 'Gift card code', example: 'GC123456789', required: false })
  @IsOptional()
  @IsString()
  giftCardCode?: string;

  @ApiProperty({ description: 'Personal info included', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  personalInfo?: boolean;

  @ApiProperty({ description: 'Financial info included', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  financialInfo?: boolean;

  @ApiProperty({ description: 'Contact info included', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  contactInfo?: boolean;

  @ApiProperty({ description: 'Security features', example: '2FA, VPN', required: false })
  @IsOptional()
  @IsString()
  securityFeatures?: string;

  @ApiProperty({ description: 'Shake type', example: 'Money Transfer', required: false })
  @IsOptional()
  @IsString()
  shakeType?: string;

  @ApiProperty({ description: 'Shake amount', example: 1000.00, required: false })
  @IsOptional()
  @IsNumber()
  shakeAmount?: number;
} 