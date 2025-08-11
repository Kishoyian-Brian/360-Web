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
    // TODO: Uncomment when migration is run
    // // Verify crypto account exists and is active
    // const cryptoAccount = await this.prisma.cryptoAccount.findUnique({
    //   where: { id: createTopupDto.cryptoAccountId }
    // });

    // if (!cryptoAccount) {
    //   throw new NotFoundException('Crypto account not found');
    // }

    // if (!cryptoAccount.isActive) {
    //   throw new BadRequestException('Crypto account is not active');
    // }

    // // Create topup request
    // const topupRequest = await this.prisma.topupRequest.create({
    //   data: {
    //     userId,
    //     amount: createTopupDto.amount,
    //     cryptoAccountId: createTopupDto.cryptoAccountId,
    //     paymentProofUrl: createTopupDto.paymentProofUrl,
    //     status: TopupStatus.PENDING,
    //   },
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

    // return this.mapToResponseDto(topupRequest);

    // Temporary mock implementation until migration is run
    const mockTopupRequest = {
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      amount: createTopupDto.amount,
      cryptoAccountId: createTopupDto.cryptoAccountId,
      status: TopupStatus.PENDING,
      paymentProofUrl: createTopupDto.paymentProofUrl,
      adminNotes: null,
      processedAt: null,
      processedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: userId,
        username: 'mock-user',
        email: 'mock@example.com',
        firstName: 'Mock',
        lastName: 'User',
        phone: '+1234567890',
        country: 'US',
        balance: 0,
      },
      cryptoAccount: {
        id: createTopupDto.cryptoAccountId,
        name: 'Mock Crypto',
        symbol: 'BTC',
        address: 'mock-address',
        network: 'Bitcoin',
      },
    };

    return this.mapToResponseDto(mockTopupRequest);
  }

  async getTopupRequests(filters: TopupFilterDto): Promise<{
    topups: TopupResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    // TODO: Uncomment when migration is deployed and Prisma client is regenerated
    // try {
    //   // Try to get real data first
    //   const { page = 1, limit = 10, search, status, cryptoAccountId, userId } = filters;
    //   const skip = (page - 1) * limit;

    //   // Build where clause
    //   const where: any = {};
      
    //   if (status) {
    //     where.status = status;
    //   }
      
    //   if (cryptoAccountId) {
    //     where.cryptoAccountId = cryptoAccountId;
    //   }
      
    //   if (userId) {
    //     where.userId = userId;
    //   }
      
    //   if (search) {
    //     where.OR = [
    //       {
    //         user: {
    //           username: {
    //             contains: search,
    //             mode: 'insensitive'
    //           }
    //         }
    //       },
    //       {
    //         user: {
    //           email: {
    //             contains: search,
    //             mode: 'insensitive'
    //           }
    //         }
    //       }
    //     ];
    //   }

    //   // Get total count
    //   const total = await this.prisma.topupRequest.count({ where });

    //   // Get topup requests with pagination
    //   const topupRequests = await this.prisma.topupRequest.findMany({
    //     where,
    //     skip,
    //     take: limit,
    //     orderBy: { createdAt: 'desc' },
    //     include: {
    //       user: {
    //         select: {
    //           id: true,
    //           username: true,
    //           email: true,
    //           firstName: true,
    //           lastName: true,
    //           phone: true,
    //           country: true,
    //           balance: true,
    //         }
    //       },
    //       cryptoAccount: {
    //         select: {
    //           id: true,
    //           name: true,
    //           symbol: true,
    //           address: true,
    //           network: true,
    //         }
    //       }
    //     }
    //   });

    //   return {
    //     topups: topupRequests.map(topup => this.mapToResponseDto(topup)),
    //     total,
    //     page,
    //     limit
    //   };
    // } catch (error) {
    //   // If database table doesn't exist or other error, return mock data
    //   console.log('Database not ready for topups, returning mock data:', error.message);
    // }

    // Temporary mock implementation until migration is deployed
    const mockTopups = [
      {
        id: 'mock-topup-1',
        userId: 'user-1',
        amount: 50,
        cryptoAccountId: 'crypto-1',
        status: TopupStatus.PENDING,
        paymentProofUrl: 'https://example.com/proof1.jpg',
        adminNotes: null,
        processedAt: null,
        processedBy: null,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000),
        user: {
          id: 'user-1',
          username: 'john_doe',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          country: 'US',
          balance: 100,
        },
        cryptoAccount: {
          id: 'crypto-1',
          name: 'Bitcoin',
          symbol: 'BTC',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          network: 'Bitcoin',
        },
      },
      {
        id: 'mock-topup-2',
        userId: 'user-2',
        amount: 25,
        cryptoAccountId: 'crypto-2',
        status: TopupStatus.APPROVED,
        paymentProofUrl: 'https://example.com/proof2.jpg',
        adminNotes: 'Payment verified successfully',
        processedAt: new Date(Date.now() - 3600000), // 1 hour ago
        processedBy: 'admin-1',
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        updatedAt: new Date(Date.now() - 3600000),
        user: {
          id: 'user-2',
          username: 'jane_smith',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+1987654321',
          country: 'CA',
          balance: 75,
        },
        cryptoAccount: {
          id: 'crypto-2',
          name: 'Ethereum',
          symbol: 'ETH',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          network: 'Ethereum',
        },
      },
    ];

    return {
      topups: mockTopups.map(topup => this.mapToResponseDto(topup)),
      total: mockTopups.length,
      page: 1,
      limit: 10
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
    // TODO: Uncomment when migration is run
    // const topupRequest = await this.prisma.topupRequest.findUnique({
    //   where: { id },
    //   include: { user: true }
    // });

    // if (!topupRequest) {
    //   throw new NotFoundException('Topup request not found');
    // }

    // if (topupRequest.status !== TopupStatus.PENDING) {
    //   throw new BadRequestException('Topup request is not pending');
    // }

    // // Update topup request status
    // const updatedTopup = await this.prisma.topupRequest.update({
    //   where: { id },
    //   data: {
    //     status: TopupStatus.APPROVED,
    //     adminNotes: notes,
    //     processedAt: new Date(),
    //     processedBy: adminId,
    //   },
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

    // // Update user balance
    // await this.prisma.user.update({
    //   where: { id: topupRequest.userId },
    //   data: {
    //     balance: {
    //       increment: topupRequest.amount
    //     }
    //   }
    // });

    // // Add balance history record
    // await this.prisma.balanceHistory.create({
    //   data: {
    //     userId: topupRequest.userId,
    //     amount: topupRequest.amount,
    //     type: 'TOPUP_APPROVAL',
    //     reason: `Topup request approved - ${topupRequest.amount}`,
    //     previousBalance: topupRequest.user.balance,
    //     newBalance: topupRequest.user.balance + topupRequest.amount,
    //     referenceId: id,
    //     referenceType: 'topup',
    //   }
    // });

    // return this.mapToResponseDto(updatedTopup);

    // Temporary mock implementation until migration is run
    throw new BadRequestException('Topup functionality is not yet available. Please run the database migration first.');
  }

  async rejectTopupRequest(id: string, adminId: string, notes?: string): Promise<TopupResponseDto> {
    // TODO: Uncomment when migration is run
    // const topupRequest = await this.prisma.topupRequest.findUnique({
    //   where: { id }
    // });

    // if (!topupRequest) {
    //   throw new NotFoundException('Topup request not found');
    // }

    // if (topupRequest.status !== TopupStatus.PENDING) {
    //   throw new BadRequestException('Topup request is not pending');
    // }

    // const updatedTopup = await this.prisma.topupRequest.update({
    //   where: { id },
    //   data: {
    //     status: TopupStatus.REJECTED,
    //     adminNotes: notes,
    //     processedAt: new Date(),
    //     processedBy: adminId,
    //   },
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

    // return this.mapToResponseDto(updatedTopup);

    // Temporary mock implementation until migration is run
    throw new BadRequestException('Topup functionality is not yet available. Please run the database migration first.');
  }

  async deleteTopupRequest(id: string): Promise<{ message: string }> {
    // TODO: Uncomment when migration is run
    // const topupRequest = await this.prisma.topupRequest.findUnique({
    //   where: { id }
    // });

    // if (!topupRequest) {
    //   throw new NotFoundException('Topup request not found');
    // }

    // await this.prisma.topupRequest.delete({
    //   where: { id }
    // });

    // return { message: 'Topup request deleted successfully' };

    // Temporary mock implementation until migration is run
    throw new BadRequestException('Topup functionality is not yet available. Please run the database migration first.');
  }

  async getTopupStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
  }> {
    // TODO: Uncomment when migration is deployed and Prisma client is regenerated
    // try {
    //   const [totalRequests, pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
    //     this.prisma.topupRequest.count(),
    //     this.prisma.topupRequest.count({ where: { status: TopupStatus.PENDING } }),
    //     this.prisma.topupRequest.count({ where: { status: TopupStatus.APPROVED } }),
    //     this.prisma.topupRequest.count({ where: { status: TopupStatus.REJECTED } }),
    //   ]);

    //   return {
    //     totalRequests,
    //     pendingRequests,
    //     approvedRequests,
    //     rejectedRequests,
    //   };
    // } catch (error) {
    //   // If database table doesn't exist or other error, return mock data
    //   console.log('Database not ready for topup stats, returning mock data:', error.message);
    // }

    // Temporary mock implementation until migration is deployed
    return {
      totalRequests: 2,
      pendingRequests: 1,
      approvedRequests: 1,
      rejectedRequests: 0,
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
