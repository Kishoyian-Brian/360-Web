import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartItemResponseDto } from './dto/cart-item-response.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    const { productId, quantity } = addToCartDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if item already exists in cart
    const existingCartItem = await this.prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });

    if (existingCartItem) {
      // Update quantity
      await this.prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          product: true,
        },
      });
    } else {
      // Create new cart item
      await this.prisma.cart.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: true,
        },
      });
    }

    // Return the full cart
    return this.getCart(userId);
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const items = cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : undefined,
      stockQuantity: item.product.stockQuantity || 0
    }));

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      id: userId, // Use userId as cart id for now
      userId: userId,
      items: items,
      total: total,
      itemCount: items.length,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateCartItem(userId: string, cartItemId: string, updateCartDto: UpdateCartDto): Promise<CartResponseDto> {
    const { quantity } = updateCartDto;

    const cartItem = await this.prisma.cart.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    const updatedCartItem = await this.prisma.cart.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: true,
      },
    });

    // Return the full cart after update
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, cartItemId: string): Promise<CartResponseDto> {
    const cartItem = await this.prisma.cart.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    await this.prisma.cart.delete({
      where: { id: cartItemId },
    });

    // Return the full cart after removal
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<CartResponseDto> {
    await this.prisma.cart.deleteMany({
      where: { userId },
    });

    // Return empty cart
    return {
      id: userId,
      userId: userId,
      items: [],
      total: 0,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getCartItemCount(userId: string): Promise<number> {
    const result = await this.prisma.cart.aggregate({
      where: { userId },
      _sum: {
        quantity: true,
      },
    });

    return result._sum.quantity || 0;
  }
} 