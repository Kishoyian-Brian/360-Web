import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVouchDto } from './dto/create-vouch.dto';
import { UpdateVouchDto } from './dto/update-vouch.dto';
import { VouchFilterDto } from './dto/vouch-filter.dto';
import { VouchResponseDto } from './dto/vouch-response.dto';
import { VouchStatus } from '@prisma/client';

@Injectable()
export class VouchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVouchDto: CreateVouchDto): Promise<VouchResponseDto> {
    const vouch = await this.prisma.vouch.create({
      data: createVouchDto,
    });

    return this.mapToVouchResponse(vouch);
  }

  async findAll(filterDto: VouchFilterDto) {
    const {
      page = 1,
      limit = 10,
      username,
      rating,
      isVerified,
      status,
      search,
    } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (username) {
      where.username = { contains: username, mode: 'insensitive' };
    }

    if (rating) {
      where.rating = rating;
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { reviewText: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get vouches with pagination
    const [vouches, total] = await Promise.all([
      this.prisma.vouch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vouch.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      vouches: vouches.map((vouch) => this.mapToVouchResponse(vouch)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<VouchResponseDto> {
    const vouch = await this.prisma.vouch.findUnique({
      where: { id },
    });

    if (!vouch) {
      throw new NotFoundException(`Vouch with ID ${id} not found`);
    }

    return this.mapToVouchResponse(vouch);
  }

  async update(
    id: string,
    updateVouchDto: UpdateVouchDto,
  ): Promise<VouchResponseDto> {
    const existingVouch = await this.prisma.vouch.findUnique({
      where: { id },
    });

    if (!existingVouch) {
      throw new NotFoundException(`Vouch with ID ${id} not found`);
    }

    const vouch = await this.prisma.vouch.update({
      where: { id },
      data: updateVouchDto,
    });

    return this.mapToVouchResponse(vouch);
  }

  async remove(id: string): Promise<void> {
    const existingVouch = await this.prisma.vouch.findUnique({
      where: { id },
    });

    if (!existingVouch) {
      throw new NotFoundException(`Vouch with ID ${id} not found`);
    }

    await this.prisma.vouch.delete({
      where: { id },
    });
  }

  async getStats() {
    const [
      totalVouches,
      approvedVouches,
      verifiedVouches,
      averageRating,
      ratingDistribution,
    ] = await Promise.all([
      this.prisma.vouch.count(),
      this.prisma.vouch.count({ where: { status: VouchStatus.APPROVED } }),
      this.prisma.vouch.count({ where: { isVerified: true } }),
      this.prisma.vouch.aggregate({
        _avg: { rating: true },
      }),
      this.prisma.vouch.groupBy({
        by: ['rating'],
        _count: { rating: true },
      }),
    ]);

    return {
      totalVouches,
      approvedVouches,
      verifiedVouches,
      averageRating: averageRating._avg.rating || 0,
      ratingDistribution: ratingDistribution.reduce(
        (acc, item) => {
          acc[item.rating] = item._count.rating;
          return acc;
        },
        {} as Record<number, number>,
      ),
    };
  }

  async approveVouch(id: string): Promise<VouchResponseDto> {
    return this.update(id, { status: VouchStatus.APPROVED });
  }

  async rejectVouch(id: string): Promise<VouchResponseDto> {
    return this.update(id, { status: VouchStatus.REJECTED });
  }

  async toggleVerification(id: string): Promise<VouchResponseDto> {
    const vouch = await this.prisma.vouch.findUnique({
      where: { id },
    });

    if (!vouch) {
      throw new NotFoundException(`Vouch with ID ${id} not found`);
    }

    return this.update(id, { isVerified: !vouch.isVerified });
  }

  private mapToVouchResponse(vouch: any): VouchResponseDto {
    return {
      id: vouch.id,
      username: vouch.username,
      avatarSeed: vouch.avatarSeed,
      avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${vouch.avatarSeed}.svg`,
      rating: vouch.rating,
      reviewText: vouch.reviewText,
      reviewImage: vouch.reviewImage || undefined,
      isVerified: vouch.isVerified,
      status: vouch.status,
      createdAt: vouch.createdAt,
      updatedAt: vouch.updatedAt,
      timeAgo: this.calculateTimeAgo(vouch.createdAt),
    };
  }

  private calculateTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
}
