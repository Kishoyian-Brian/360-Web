import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { VouchStatus } from '@prisma/client';

export class CreateVouchDto {
  @ApiProperty({ description: 'Username of the person giving the vouch' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Seed for avatar generation (usually same as username)',
  })
  @IsString()
  avatarSeed: string;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review text content' })
  @IsString()
  reviewText: string;

  @ApiProperty({ description: 'Review image path (optional)' })
  @IsOptional()
  @IsString()
  reviewImage?: string;

  @ApiProperty({ description: 'Whether this is a verified purchase' })
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({ description: 'Status of the vouch', enum: VouchStatus })
  @IsOptional()
  @IsEnum(VouchStatus)
  status?: VouchStatus;
}
