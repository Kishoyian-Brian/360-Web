import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Payment method for the order' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ description: 'Shipping address', required: false })
  @IsOptional()
  @IsObject()
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
} 