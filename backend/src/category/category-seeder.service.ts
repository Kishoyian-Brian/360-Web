import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryType } from '@prisma/client';

@Injectable()
export class CategorySeederService {
  constructor(private prisma: PrismaService) {}

  // Category data based on frontend structure
  private readonly categoryData = {
    MAIN: [
      {
        name: 'Bank Logs',
        slug: 'bank-logs',
        description: 'High-quality bank logs from various banks',
        order: 1,
      },
      {
        name: 'Bitcoin Log',
        slug: 'bitcoin-log',
        description: 'Bitcoin wallet logs and transactions',
        order: 2,
      },
      {
        name: 'Carded',
        slug: 'carded',
        description: 'Carded products and services',
        order: 3,
      },
      {
        name: 'Carded Products',
        slug: 'carded-products',
        description: 'Premium carded products',
        order: 4,
      },
      {
        name: 'CashApp Log',
        slug: 'cashapp-log',
        description: 'CashApp account logs',
        order: 5,
      },
      {
        name: 'CC CVV',
        slug: 'cc-cvv',
        description: 'Credit card CVV data',
        order: 6,
      },
      {
        name: 'Clips',
        slug: 'clips',
        description: 'Video clips and tutorials',
        order: 7,
      },
      {
        name: 'Clone',
        slug: 'clone',
        description: 'Clone card services',
        order: 8,
      },
      {
        name: 'Deposit Check',
        slug: 'deposit-check',
        description: 'Deposit check services',
        order: 9,
      },
      {
        name: 'E-Gift Cards',
        slug: 'e-gift-cards',
        description: 'Electronic gift cards',
        order: 10,
      },
      {
        name: 'Fraud Cards',
        slug: 'fraud-cards',
        description: 'Fraud card services',
        order: 11,
      },
      {
        name: 'Fullz',
        slug: 'fullz',
        description: 'Complete personal information packages',
        order: 12,
      },
      {
        name: 'Linkable',
        slug: 'linkable',
        description: 'Linkable account services',
        order: 13,
      },
      {
        name: 'PayPal Log',
        slug: 'paypal-log',
        description: 'PayPal account logs',
        order: 14,
      },
      {
        name: 'Shake',
        slug: 'shake',
        description: 'Shake services and tools',
        order: 15,
      },
      {
        name: 'Stealth Accounts',
        slug: 'stealth-accounts',
        description: 'Stealth account services',
        order: 16,
      },
      {
        name: 'Tools',
        slug: 'tools',
        description: 'Various tools and utilities',
        order: 17,
      },
      {
        name: 'Transfers',
        slug: 'transfers',
        description: 'Money transfer services',
        order: 18,
      },
    ],
    MORE_LOGS: [
      {
        name: 'USA Banks',
        slug: 'usa-banks',
        description: 'US bank logs and accounts',
        order: 1,
      },
      {
        name: 'USA Cards',
        slug: 'usa-cards',
        description: 'US credit and debit cards',
        order: 2,
      },
      {
        name: 'UK Banks',
        slug: 'uk-banks',
        description: 'UK bank logs and accounts',
        order: 3,
      },
      {
        name: 'UK Cards',
        slug: 'uk-cards',
        description: 'UK credit and debit cards',
        order: 4,
      },
      {
        name: 'Europe Cards',
        slug: 'europe-cards',
        description: 'European credit and debit cards',
        order: 5,
      },
      {
        name: 'Canada Banks',
        slug: 'canada-banks',
        description: 'Canadian bank logs and accounts',
        order: 6,
      },
      {
        name: 'Canada Cards',
        slug: 'canada-cards',
        description: 'Canadian credit and debit cards',
        order: 7,
      },
      {
        name: 'Africa Cards',
        slug: 'africa-cards',
        description: 'African credit and debit cards',
        order: 8,
      },
      {
        name: 'Australia Cards',
        slug: 'australia-cards',
        description: 'Australian credit and debit cards',
        order: 9,
      },
      {
        name: 'Credit Unions',
        slug: 'credit-unions',
        description: 'Credit union accounts and logs',
        order: 10,
      },
      {
        name: 'Crypto Logs',
        slug: 'crypto-logs',
        description: 'Cryptocurrency wallet logs',
        order: 11,
      },
    ],
    LINKABLES: [
      {
        name: 'Apple Pay',
        slug: 'linkable-applepay',
        description: 'Apple Pay linkable accounts',
        order: 1,
      },
      {
        name: 'CashApp',
        slug: 'linkable-cashapp',
        description: 'CashApp linkable accounts',
        order: 2,
      },
      {
        name: 'Google Pay',
        slug: 'linkable-googlepay',
        description: 'Google Pay linkable accounts',
        order: 3,
      },
      {
        name: 'PayPal',
        slug: 'linkable-paypal',
        description: 'PayPal linkable accounts',
        order: 4,
      },
      {
        name: 'Venmo',
        slug: 'linkable-venmo',
        description: 'Venmo linkable accounts',
        order: 5,
      },
    ],
    TRANSFERS: [
      {
        name: 'Apple Pay',
        slug: 'transfer-applepay',
        description: 'Apple Pay transfer services',
        order: 1,
      },
      {
        name: 'CashApp',
        slug: 'transfer-cashapp',
        description: 'CashApp transfer services',
        order: 2,
      },
      {
        name: 'Google Pay',
        slug: 'transfer-googlepay',
        description: 'Google Pay transfer services',
        order: 3,
      },
      {
        name: 'PayPal',
        slug: 'transfer-paypal',
        description: 'PayPal transfer services',
        order: 4,
      },
      {
        name: 'Venmo',
        slug: 'transfer-venmo',
        description: 'Venmo transfer services',
        order: 5,
      },
      {
        name: 'Zelle',
        slug: 'transfer-zelle',
        description: 'Zelle transfer services',
        order: 6,
      },
    ],
  };

  async seedAllCategories(): Promise<{
    message: string;
    created: number;
    updated: number;
  }> {
    let created = 0;
    let updated = 0;

    for (const [type, categories] of Object.entries(this.categoryData)) {
      for (const categoryData of categories) {
        const existing = await this.prisma.category.findUnique({
          where: { slug: categoryData.slug },
        });

        if (existing) {
          // Update existing category
          await this.prisma.category.update({
            where: { id: existing.id },
            data: {
              name: categoryData.name,
              description: categoryData.description,
              type: type as CategoryType,
              order: categoryData.order,
              isActive: true,
            },
          });
          updated++;
        } else {
          // Create new category
          await this.prisma.category.create({
            data: {
              name: categoryData.name,
              slug: categoryData.slug,
              description: categoryData.description,
              type: type as CategoryType,
              order: categoryData.order,
              isActive: true,
            },
          });
          created++;
        }
      }
    }

    return {
      message: `Categories seeded successfully. Created: ${created}, Updated: ${updated}`,
      created,
      updated,
    };
  }

  async seedCategoriesByType(
    type: CategoryType,
  ): Promise<{ message: string; created: number; updated: number }> {
    const categories = this.categoryData[type] || [];
    let created = 0;
    let updated = 0;

    for (const categoryData of categories) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: categoryData.slug },
      });

      if (existing) {
        await this.prisma.category.update({
          where: { id: existing.id },
          data: {
            name: categoryData.name,
            description: categoryData.description,
            type,
            order: categoryData.order,
            isActive: true,
          },
        });
        updated++;
      } else {
        await this.prisma.category.create({
          data: {
            name: categoryData.name,
            slug: categoryData.slug,
            description: categoryData.description,
            type,
            order: categoryData.order,
            isActive: true,
          },
        });
        created++;
      }
    }

    return {
      message: `${type} categories seeded successfully. Created: ${created}, Updated: ${updated}`,
      created,
      updated,
    };
  }

  async getCategoryStructure(): Promise<{ [key: string]: any[] }> {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ type: 'asc' }, { order: 'asc' }],
    });

    const structure: { [key: string]: any[] } = {
      MAIN: [],
      MORE_LOGS: [],
      LINKABLES: [],
      TRANSFERS: [],
    };

    categories.forEach((category) => {
      structure[category.type].push({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        order: category.order,
        isActive: category.isActive,
      });
    });

    return structure;
  }
}
