import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VouchStatus } from '@prisma/client';

@Injectable()
export class VouchSeederService {
  constructor(private readonly prisma: PrismaService) {}

  async seedVouches() {
    const vouchData = [
      {
        username: 'notkenzo',
        avatarSeed: 'notkenzo',
        rating: 4,
        reviewText: 'i dont have to say much. this is my regular plug from now on',
        reviewImage: 'images/1746186892.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'cooliejay',
        avatarSeed: 'cooliejay',
        rating: 5,
        reviewText: 'WILL BUY AGAIN! YES! THANK YOU!!!',
        reviewImage: 'images/1746186657.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'shadowhunter',
        avatarSeed: 'shadowhunter',
        rating: 5,
        reviewText: 'Amazing service, fast delivery, highly recommended!',
        reviewImage: 'images/1746186500.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'cryptoking',
        avatarSeed: 'cryptoking',
        rating: 4,
        reviewText: 'Great quality products, will definitely order again',
        reviewImage: 'images/1746186400.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'darknetuser',
        avatarSeed: 'darknetuser',
        rating: 5,
        reviewText: 'Best vendor I have ever worked with. Trustworthy and reliable.',
        reviewImage: 'images/1746186300.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'bitcoinlord',
        avatarSeed: 'bitcoinlord',
        rating: 4,
        reviewText: 'Excellent service, products as described. Very satisfied!',
        reviewImage: 'images/1746186200.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'cardmaster',
        avatarSeed: 'cardmaster',
        rating: 5,
        reviewText: 'Perfect transaction, everything went smoothly. 10/10',
        reviewImage: 'images/1746186100.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'hackerman',
        avatarSeed: 'hackerman',
        rating: 4,
        reviewText: 'Good quality, fast shipping. Will use again.',
        reviewImage: 'images/1746186000.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'stealthuser',
        avatarSeed: 'stealthuser',
        rating: 5,
        reviewText: 'Amazing stealth packaging, very professional service.',
        reviewImage: 'images/1746185900.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
      {
        username: 'veteranbuyer',
        avatarSeed: 'veteranbuyer',
        rating: 5,
        reviewText: 'Been buying for months now, never had any issues. Top vendor!',
        reviewImage: 'images/1746185800.jpg',
        isVerified: true,
        status: VouchStatus.APPROVED,
      },
    ];

    const results: Array<{ action: string; vouch: string }> = [];
    for (const vouch of vouchData) {
      const existingVouch = await this.prisma.vouch.findFirst({
        where: { username: vouch.username },
      });

      if (existingVouch) {
        // Update existing vouch
        const updatedVouch = await this.prisma.vouch.update({
          where: { id: existingVouch.id },
          data: vouch,
        });
        results.push({ action: 'updated', vouch: updatedVouch.username });
      } else {
        // Create new vouch
        const newVouch = await this.prisma.vouch.create({
          data: vouch,
        });
        results.push({ action: 'created', vouch: newVouch.username });
      }
    }

    return {
      message: 'Vouches seeded successfully',
      results,
      total: results.length,
    };
  }

  async clearVouches() {
    const deletedCount = await this.prisma.vouch.deleteMany({});
    return {
      message: 'All vouches cleared successfully',
      deletedCount: deletedCount.count,
    };
  }

  async getVouchStats() {
    const totalVouches = await this.prisma.vouch.count();
    const approvedVouches = await this.prisma.vouch.count({
      where: { status: VouchStatus.APPROVED },
    });
    const verifiedVouches = await this.prisma.vouch.count({
      where: { isVerified: true },
    });
    const averageRating = await this.prisma.vouch.aggregate({
      _avg: { rating: true },
    });

    return {
      totalVouches,
      approvedVouches,
      verifiedVouches,
      averageRating: averageRating._avg.rating || 0,
    };
  }
} 