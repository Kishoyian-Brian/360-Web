import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopupRequestDto } from './dto/create-topup-request.dto';
import { TopupFilterDto } from './dto/topup-filter.dto';
import { TopupResponseDto } from './dto/topup-response.dto';

enum TopupStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Injectable()
export class TopupService {
  constructor(private readonly prisma: PrismaService) {}

  async createTopupRequest(userId: string, createTopupDto: CreateTopupRequestDto): Promise<TopupResponseDto> {
    // Verify crypto account exists and is active
    const cryptoAccount = await this.prisma.cryptoAccount.findUnique({
      where: { id: createTopupDto.cryptoAccountId }
    });

    if (!cryptoAccount) {
      throw new NotFoundException('Crypto account not found');
    }

    if (!cryptoAccount.isActive) {
      throw new BadRequestException('Crypto account is not active');
    }

    // Create topup request
    const topupRequest = await this.prisma.topupRequest.create({
      data: {
        userId,
        amount: createTopupDto.amount,
        cryptoAccountId: createTopupDto.cryptoAccountId,
        paymentProofUrl: createTopupDto.paymentProofUrl,
        status: TopupStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            country: true,
            balance: true,
          }
        },
        cryptoAccount: {
          select: {
            id: true,
            name: true,
            symbol: true,
            address: true,
            network: true,
          }
        }
      }
    });

    return this.mapToResponseDto(topupRequest);
  }

  async getTopupRequests(filters: TopupFilterDto): Promise<{
    topups: TopupResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, status, cryptoAccountId, userId } = filters;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (cryptoAccountId) {
      where.cryptoAccountId = cryptoAccountId;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (search) {
      where.OR = [
        {
          user: {
            username: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Get total count
    const total = await this.prisma.topupRequest.count({ where });

    // Get topup requests with pagination
    const topupRequests = await this.prisma.topupRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            country: true,
            balance: true,
          }
        },
        cryptoAccount: {
          select: {
            id: true,
            name: true,
            symbol: true,
            address: true,
            network: true,
          }
        }
      }
    });

    return {
      topups: topupRequests.map(topup => this.mapToResponseDto(topup)),
      total,
      page,
      limit
    };
  }

  async getTopupRequestById(id: string): Promise<TopupResponseDto> {
    // TODO: Uncomment when migration is run
    // const topupRequest = await this.prisma.topupRequest.findUnique({
    //   where: { id },
    //   include: {
    //     user: {
    //       select: {
    //         id: true,
    //         username: true,
    //         email: true,
    //         firstName: true,
    //         lastName: true,
    //         phone: true,
    //         country: true,
    //         balance: true,
    //       }
    //     },
    //     cryptoAccount: {
    //       select: {
    //         id: true,
    //         name: true,
    //         symbol: true,
    //         address: true,
    //         network: true,
    //       }
    //     }
    //   }
    // });

    // if (!topupRequest) {
    //   throw new NotFoundException('Topup request not found');
    // }

    // return this.mapToResponseDto(topupRequest);

    // Temporary mock implementation until migration is run
    throw new NotFoundException('Topup request not found');
  }

  async approveTopupRequest(id: string, adminId: string, notes?: string): Promise<TopupResponseDto> {
    const topupRequest = await this.prisma.topupRequest.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!topupRequest) {
      throw new NotFoundException('Topup request not found');
    }

    if (topupRequest.status !== TopupStatus.PENDING) {
      throw new BadRequestException('Topup request is not pending');
    }

    // Use transaction to ensure data consistency
    const result = await this.prisma.$transaction(async (prisma) => {
      // Update topup request status
      const updatedTopup = await prisma.topupRequest.update({
        where: { id },
        data: {
          status: TopupStatus.APPROVED,
          adminNotes: notes,
          processedAt: new Date(),
          processedBy: adminId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              country: true,
              balance: true,
            }
          },
          cryptoAccount: {
            select: {
              id: true,
              name: true,
              symbol: true,
              address: true,
              network: true,
            }
          }
        }
      });

      // Get current user balance before update
      const currentUser = await prisma.user.findUnique({
        where: { id: topupRequest.userId },
        select: { balance: true }
      });

      if (!currentUser) {
        throw new NotFoundException('User not found');
      }

      const previousBalance = currentUser.balance;
      const newBalance = previousBalance + topupRequest.amount;

      // Update user balance
      await prisma.user.update({
        where: { id: topupRequest.userId },
        data: {
          balance: newBalance
        }
      });

      // Add balance history record
      await prisma.balanceHistory.create({
        data: {
          userId: topupRequest.userId,
          amount: topupRequest.amount,
          type: 'TOPUP_APPROVAL',
          reason: `Topup request approved - ${topupRequest.amount}`,
          previousBalance: previousBalance,
          newBalance: newBalance,
          referenceId: id,
          referenceType: 'topup',
        }
      });

      return updatedTopup;
    });

    return this.mapToResponseDto(result);
  }

  async rejectTopupRequest(id: string, adminId: string, notes?: string): Promise<TopupResponseDto> {
    const topupRequest = await this.prisma.topupRequest.findUnique({
      where: { id }
    });

    if (!topupRequest) {
      throw new NotFoundException('Topup request not found');
    }

    if (topupRequest.status !== TopupStatus.PENDING) {
      throw new BadRequestException('Topup request is not pending');
    }

    const updatedTopup = await this.prisma.topupRequest.update({
      where: { id },
      data: {
        status: TopupStatus.REJECTED,
        adminNotes: notes,
        processedAt: new Date(),
        processedBy: adminId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            country: true,
            balance: true,
          }
        },
        cryptoAccount: {
          select: {
            id: true,
            name: true,
            symbol: true,
            address: true,
            network: true,
          }
        }
      }
    });

    return this.mapToResponseDto(updatedTopup);
  }

  async deleteTopupRequest(id: string): Promise<{ message: string }> {
    const topupRequest = await this.prisma.topupRequest.findUnique({
      where: { id }
    });

    if (!topupRequest) {
      throw new NotFoundException('Topup request not found');
    }

    await this.prisma.topupRequest.delete({
      where: { id }
    });

    return { message: 'Topup request deleted successfully' };
  }

  async getTopupStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
  }> {
    const [totalRequests, pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
      this.prisma.topupRequest.count(),
      this.prisma.topupRequest.count({ where: { status: TopupStatus.PENDING } }),
      this.prisma.topupRequest.count({ where: { status: TopupStatus.APPROVED } }),
      this.prisma.topupRequest.count({ where: { status: TopupStatus.REJECTED } }),
    ]);

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    };
  }

  private mapToResponseDto(topupRequest: any): TopupResponseDto {
    return {
      id: topupRequest.id,
      userId: topupRequest.userId,
      amount: topupRequest.amount,
      cryptoAccountId: topupRequest.cryptoAccountId,
      status: topupRequest.status,
      paymentProofUrl: topupRequest.paymentProofUrl,
      adminNotes: topupRequest.adminNotes,
      processedAt: topupRequest.processedAt,
      processedBy: topupRequest.processedBy,
      createdAt: topupRequest.createdAt,
      updatedAt: topupRequest.updatedAt,
      user: topupRequest.user,
      cryptoAccount: topupRequest.cryptoAccount,
    };
  }
}
