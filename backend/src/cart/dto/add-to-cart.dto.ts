import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'Product ID to add to cart' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Quantity to add', minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  quantity: number = 1;
} 