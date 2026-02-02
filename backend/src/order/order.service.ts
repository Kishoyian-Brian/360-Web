import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { OrderResponseDto, OrderItemResponseDto } from './dto/order-response.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Get user's cart
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentMethod: createOrderDto.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        shippingAddress: createOrderDto.shippingAddress || undefined,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear user's cart
    await this.prisma.cart.deleteMany({
      where: { userId },
    });

    return this.mapToOrderResponse(order);
  }

  async findAll(filterDto: OrderFilterDto, userId?: string, includeDownloadPassword: boolean = false) {
    const { page = 1, limit = 10, status, paymentStatus, orderNumber, paymentMethod } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    
    if (orderNumber) {
      where.orderNumber = { contains: orderNumber, mode: 'insensitive' };
    }
    
    if (paymentMethod) {
      where.paymentMethod = { contains: paymentMethod, mode: 'insensitive' };
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      orders: orders.map(order => this.mapToOrderResponse(order, includeDownloadPassword)),
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

  async findOne(id: string, userId?: string, includeDownloadPassword: boolean = false): Promise<OrderResponseDto> {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.mapToOrderResponse(order, includeDownloadPassword);
  }

  async updateOrderStatus(id: string, status: OrderStatus, includeDownloadPassword: boolean = false): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const shouldGeneratePassword =
      (status === OrderStatus.PAID || status === OrderStatus.COMPLETED) &&
      !order.downloadPassword;
    const downloadPassword = shouldGeneratePassword
      ? this.generateDownloadPassword()
      : undefined;

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status,
        ...(downloadPassword ? { downloadPassword } : {}),
      },
      include: {
        items: true,
      },
    });

    return this.mapToOrderResponse(updatedOrder, includeDownloadPassword);
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, includeDownloadPassword: boolean = false): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const shouldGeneratePassword =
      paymentStatus === PaymentStatus.COMPLETED && !order.downloadPassword;
    const downloadPassword = shouldGeneratePassword
      ? this.generateDownloadPassword()
      : undefined;

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
        ...(downloadPassword ? { downloadPassword } : {}),
      },
      include: {
        items: true,
      },
    });

    return this.mapToOrderResponse(updatedOrder, includeDownloadPassword);
  }

  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      averageOrderValue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.COMPLETED } }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        _avg: { totalAmount: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      averageOrderValue: averageOrderValue._avg.totalAmount || 0,
    };
  }

  async deleteOrder(id: string): Promise<{ message: string }> {
    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Delete order items first (due to foreign key constraints)
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Delete the order
    await this.prisma.order.delete({
      where: { id },
    });

    return { message: 'Order deleted successfully' };
  }

  async uploadPaymentProof(
    orderId: string,
    paymentProofUrl: string,
    userId?: string,
    includeDownloadPassword: boolean = false
  ): Promise<OrderResponseDto> {
    // Build where clause to include user filtering if provided
    const where: any = { id: orderId };
    if (userId) {
      where.userId = userId;
    }

    console.log('Looking for order with conditions:', where);

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    console.log('Order found:', order ? `ID: ${order.id}, UserID: ${order.userId}` : 'No order found');

    if (!order) {
      // Let's also try to find the order without user filtering to debug
      const orderWithoutUserFilter = await this.prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, userId: true }
      });
      
      if (orderWithoutUserFilter) {
        console.log('Order exists but belongs to different user. Order UserID:', orderWithoutUserFilter.userId, 'Request UserID:', userId);
        throw new NotFoundException('Order not found or access denied');
      } else {
        console.log('Order with ID does not exist:', orderId);
        throw new NotFoundException('Order not found');
      }
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentProof: paymentProofUrl },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return this.mapToOrderResponse(updatedOrder, includeDownloadPassword);
  }

  private mapToOrderResponse(order: any, includeDownloadPassword: boolean = false): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      user: order.user ? {
        id: order.user.id,
        username: order.user.username,
        email: order.user.email,
      } : undefined,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      paymentProof: order.paymentProof,
      downloadPassword: includeDownloadPassword ? order.downloadPassword : undefined,
      items: order.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private generateDownloadPassword(): string {
    const raw = randomBytes(12).toString('base64').replace(/[^A-Za-z0-9]/g, '');
    return raw.slice(0, 12) || Math.random().toString(36).slice(2, 10).toUpperCase();
  }
} 