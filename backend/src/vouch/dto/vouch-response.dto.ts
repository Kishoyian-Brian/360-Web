import { ApiProperty } from '@nestjs/swagger';
import { VouchStatus } from '@prisma/client';

export class VouchResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarSeed: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  reviewText: string;

  @ApiProperty({ required: false })
  reviewImage?: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ enum: VouchStatus })
  status: VouchStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  timeAgo: string;
} 