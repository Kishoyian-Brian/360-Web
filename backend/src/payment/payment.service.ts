import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async processPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const { orderId, amount, method, gateway, metadata } = createPaymentDto;

    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Check if payment already exists for this order
    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment) {
      throw new BadRequestException(`Payment already exists for order ${orderId}`);
    }

    // Validate amount matches order total
    if (amount !== order.totalAmount) {
      throw new BadRequestException(`Payment amount ${amount} does not match order total ${order.totalAmount}`);
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Process payment (simulate payment processing)
    const paymentStatus = await this.simulatePaymentProcessing(method, amount);

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount,
        method,
        status: paymentStatus,
        transactionId: paymentStatus === PaymentStatus.COMPLETED ? transactionId : null,
        gateway: gateway || 'internal',
        metadata: metadata || {},
      },
    });

    // Update order payment status
    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: paymentStatus },
    });

    return this.mapToPaymentResponse(payment);
  }

  async getPaymentByOrderId(orderId: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment for order ${orderId} not found`);
    }

    return this.mapToPaymentResponse(payment);
  }

  async getPaymentById(id: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.mapToPaymentResponse(payment);
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: { status },
    });

    // Update order payment status
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: status },
    });

    return this.mapToPaymentResponse(updatedPayment);
  }

  async getPaymentStats() {
    const [
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      totalAmount,
      averageAmount,
    ] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: PaymentStatus.COMPLETED } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        _avg: { amount: true },
      }),
    ]);

    return {
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      totalAmount: totalAmount._sum.amount || 0,
      averageAmount: averageAmount._avg.amount || 0,
    };
  }

  private async simulatePaymentProcessing(method: string, amount: number): Promise<PaymentStatus> {
    // Simulate payment processing with different success rates based on method
    const successRates = {
      CREDIT_CARD: 0.95,
      DEBIT_CARD: 0.98,
      BANK_TRANSFER: 0.99,
      CRYPTO: 0.90,
      CASH: 1.0,
    };

    const successRate = successRates[method] || 0.95;
    const random = Math.random();

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (random <= successRate) {
      return PaymentStatus.COMPLETED;
    } else if (random <= 0.98) {
      return PaymentStatus.FAILED;
    } else {
      return PaymentStatus.PENDING;
    }
  }

  private mapToPaymentResponse(payment: any): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId || undefined,
      gateway: payment.gateway || undefined,
      metadata: payment.metadata || undefined,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
} 