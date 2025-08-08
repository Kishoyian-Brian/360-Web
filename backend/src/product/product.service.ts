import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Product, ProductType } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Helper to map Prisma Product to ProductResponseDto
  private mapToProductResponse(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      productType: product.productType,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      images: product.images,
      thumbnail: product.thumbnail,
      sku: product.sku,
      barcode: product.barcode,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        type: product.category.type,
      } : undefined,
      // Product-specific fields
      bankName: product.bankName,
      balance: product.balance,
      country: product.country,
      verification: product.verification,
      cardType: product.cardType,
      bank: product.bank,
      cvv: product.cvv,
      platform: product.platform,
      linkableBalance: product.linkableBalance,
      amount: product.amount,
      speed: product.speed,
      transferPlatform: product.transferPlatform,
      accountType: product.accountType,
      lastActivity: product.lastActivity,
      transferType: product.transferType,
      fees: product.fees,
      toolType: product.toolType,
      features: product.features,
      compatibility: product.compatibility,
      duration: product.duration,
      format: product.format,
      quality: product.quality,
      walletAddress: product.walletAddress,
      transactionCount: product.transactionCount,
      riskLevel: product.riskLevel,
      checkAmount: product.checkAmount,
      giftCardValue: product.giftCardValue,
      giftCardCode: product.giftCardCode,
      personalInfo: product.personalInfo,
      financialInfo: product.financialInfo,
      contactInfo: product.contactInfo,
      securityFeatures: product.securityFeatures,
      shakeType: product.shakeType,
      shakeAmount: product.shakeAmount,
    };
  }

  async createProduct(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    // Check if category exists by slug or ID
    let category;
    if (createProductDto.categoryId.includes('-')) {
      // If it contains hyphens, treat as slug
      category = await this.prisma.category.findUnique({
        where: { slug: createProductDto.categoryId },
      });
    } else {
      // Otherwise treat as ID
      category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });
    }

    if (!category) {
      throw new NotFoundException(`Category with ID/slug '${createProductDto.categoryId}' not found.`);
    }

    // Validate product type matches category type
    this.validateProductTypeForCategory(createProductDto.productType, category.type);

    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        categoryId: category.id, // Use the actual database ID
        productType: createProductDto.productType,
        stockQuantity: createProductDto.stockQuantity,
        isActive: createProductDto.isActive,
        images: createProductDto.images,
        bankName: createProductDto.bankName,
        balance: createProductDto.balance,
        country: createProductDto.country,
        verification: createProductDto.verification,
        cardType: createProductDto.cardType,
        bank: createProductDto.bank,
        cvv: createProductDto.cvv,
        platform: createProductDto.platform,
        linkableBalance: createProductDto.linkableBalance,
        amount: createProductDto.amount,
        speed: createProductDto.speed,
        transferPlatform: createProductDto.transferPlatform,
        accountType: createProductDto.accountType,
        lastActivity: createProductDto.lastActivity,
        transferType: createProductDto.transferType,
        fees: createProductDto.fees,
        toolType: createProductDto.toolType,
        features: createProductDto.features,
        compatibility: createProductDto.compatibility,
        duration: createProductDto.duration,
        format: createProductDto.format,
        quality: createProductDto.quality,
        walletAddress: createProductDto.walletAddress,
        transactionCount: createProductDto.transactionCount,
        riskLevel: createProductDto.riskLevel,
        checkAmount: createProductDto.checkAmount,
        giftCardValue: createProductDto.giftCardValue,
        giftCardCode: createProductDto.giftCardCode,
        personalInfo: createProductDto.personalInfo,
        financialInfo: createProductDto.financialInfo,
        contactInfo: createProductDto.contactInfo,
        securityFeatures: createProductDto.securityFeatures,
        shakeType: createProductDto.shakeType,
        shakeAmount: createProductDto.shakeAmount,
      },
      include: {
        category: true,
      },
    });

    return this.mapToProductResponse(product);
  }

  async getProducts(filterDto: ProductFilterDto): Promise<{ products: ProductResponseDto[]; total: number; page: number; limit: number }> {
    const {
      search,
      productType,
      categoryId,
      categorySlug,
      categoryType,
      isActive,
      inStock,
      minPrice,
      maxPrice,
      bankName,
      country,
      platform,
      cardType,
      speed,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Product type filter
    if (productType) {
      where.productType = productType;
    }

    // Category filters
    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (categorySlug || categoryType) {
      where.category = {};
      if (categorySlug) {
        where.category.slug = categorySlug;
      }
      if (categoryType) {
        where.category.type = categoryType;
      }
    }

    // Status filters
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (inStock !== undefined) {
      if (inStock) {
        where.stockQuantity = { gt: 0 };
      } else {
        where.stockQuantity = { lte: 0 };
      }
    }

    // Price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Type-specific filters
    if (bankName) {
      where.bankName = { contains: bankName, mode: 'insensitive' };
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (platform) {
      where.platform = { contains: platform, mode: 'insensitive' };
    }

    if (cardType) {
      where.cardType = { contains: cardType, mode: 'insensitive' };
    }

    if (speed) {
      where.speed = { contains: speed, mode: 'insensitive' };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(product => this.mapToProductResponse(product)),
      total,
      page,
      limit,
    };
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found.`);
    }

    return this.mapToProductResponse(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID '${id}' not found.`);
    }

    // If category is being updated, validate it exists
    if (updateProductDto.categoryId) {
      let category;
      if (updateProductDto.categoryId.includes('-')) {
        // If it contains hyphens, treat as slug
        category = await this.prisma.category.findUnique({
          where: { slug: updateProductDto.categoryId },
        });
      } else {
        // Otherwise treat as ID
        category = await this.prisma.category.findUnique({
          where: { id: updateProductDto.categoryId },
        });
      }

      if (!category) {
        throw new NotFoundException(`Category with ID/slug '${updateProductDto.categoryId}' not found.`);
      }

      // Validate product type matches category type
      this.validateProductTypeForCategory(updateProductDto.productType || existingProduct.productType, category.type);
      
      // Update the categoryId to use the actual database ID
      updateProductDto.categoryId = category.id;
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });

    return this.mapToProductResponse(updatedProduct);
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID '${id}' not found.`);
    }

    // Check if product has associated orders
    if (existingProduct.orderItems && existingProduct.orderItems.length > 0) {
      throw new BadRequestException(`Product '${existingProduct.name}' has associated orders and cannot be deleted.`);
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: `Product '${existingProduct.name}' deleted successfully.` };
  }

  async getProductsByCategory(categorySlug: string, limit: number = 10): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return products.map(product => this.mapToProductResponse(product));
  }

  async getProductsByType(productType: ProductType, limit: number = 10): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        productType,
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return products.map(product => this.mapToProductResponse(product));
  }

  async searchProducts(query: string, limit: number = 10): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return products.map(product => this.mapToProductResponse(product));
  }

  // Special queries
  async getFeaturedProducts(limit: number = 10): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return products.map(product => this.mapToProductResponse(product));
  }

  async getPopularProducts(limit: number = 10): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return products.map(product => this.mapToProductResponse(product));
  }

  async updateStockQuantity(id: string, quantity: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { stockQuantity: quantity },
      include: {
        category: true,
      },
    });

    return this.mapToProductResponse(product);
  }

  private validateProductTypeForCategory(productType: ProductType, categoryType: string): void {
    const validProductTypes = {
      MAIN: [
        ProductType.BANK_LOG, ProductType.BITCOIN_LOG, ProductType.CARDED, ProductType.CARDED_PRODUCT,
        ProductType.CASHAPP_LOG, ProductType.CC_CVV, ProductType.CLIP, ProductType.CLONE,
        ProductType.DEPOSIT_CHECK, ProductType.E_GIFT_CARD, ProductType.FRAUD_CARD, ProductType.FULLZ,
        ProductType.LINKABLE, ProductType.PAYPAL_LOG, ProductType.SHAKE, ProductType.STEALTH_ACCOUNT,
        ProductType.TOOL, ProductType.TRANSFER,
      ],
      MORE_LOGS: [
        ProductType.USA_BANK, ProductType.USA_CARD, ProductType.UK_BANK, ProductType.UK_CARD,
        ProductType.EUROPE_CARD, ProductType.CANADA_BANK, ProductType.CANADA_CARD, ProductType.AFRICA_CARD,
        ProductType.AUSTRALIA_CARD, ProductType.CREDIT_UNION, ProductType.CRYPTO_LOG,
      ],
      LINKABLES: [ProductType.LINKABLE],
      TRANSFERS: [ProductType.TRANSFER],
    };

    const allowedTypes = validProductTypes[categoryType] || [];
    if (!allowedTypes.includes(productType)) {
      throw new BadRequestException(`Product type '${productType}' is not valid for category type '${categoryType}'.`);
    }
  }
} 