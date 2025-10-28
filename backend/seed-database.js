const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding for Neon...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to Neon database successfully');

    // Seed categories
    const categories = [
      { name: 'Bank Logs', description: 'Bank account login credentials', slug: 'bank-logs', type: 'MAIN' },
      { name: 'Bitcoin Logs', description: 'Bitcoin wallet login credentials', slug: 'bitcoin-log', type: 'MAIN' },
      { name: 'Carded', description: 'Carded products and services', slug: 'carded', type: 'MAIN' },
      { name: 'CC CVV', description: 'Credit card information', slug: 'cc-cvv', type: 'MAIN' },
      { name: 'Clips', description: 'Video clips and tutorials', slug: 'clips', type: 'MAIN' },
      { name: 'Clone', description: 'Cloned accounts and services', slug: 'clone', type: 'MAIN' },
      { name: 'Deposit Check', description: 'Deposit verification services', slug: 'deposit-check', type: 'MAIN' },
      { name: 'E-Gift Cards', description: 'Electronic gift cards', slug: 'e-gift-cards', type: 'MAIN' },
      { name: 'Fraud Cards', description: 'Fraudulent card services', slug: 'fraud-cards', type: 'MAIN' },
      { name: 'Fullz', description: 'Complete personal information packages', slug: 'fullz', type: 'MAIN' },
      { name: 'Linkable', description: 'Linkable payment methods', slug: 'linkable', type: 'LINKABLES' },
      { name: 'PayPal Logs', description: 'PayPal account credentials', slug: 'paypal-log', type: 'MAIN' },
      { name: 'Shake', description: 'Shake services and tools', slug: 'shake', type: 'MAIN' },
      { name: 'Stealth Accounts', description: 'Stealth account services', slug: 'stealth-accounts', type: 'MAIN' },
      { name: 'Tools', description: 'Various tools and utilities', slug: 'tools', type: 'MAIN' },
      { name: 'Transfers', description: 'Money transfer services', slug: 'transfers', type: 'TRANSFERS' }
    ];

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          ...category,
          isActive: true,
          order: i + 1
        },
        create: {
          ...category,
          isActive: true,
          order: i + 1
        }
      });
    }

    // Seed crypto accounts
    const cryptoAccounts = [
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        address: '1AGbgzEPd14hzLoDyYoDzwEH1MP5ZekmBi',
        order: 1
      },
      {
        name: 'USDT',
        symbol: 'USDT',
        address: 'TKieHKDKegGjW2HojHxKgsNkZAota5CuDz',
        network: 'TRC20',
        order: 2
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        address: '0x3C774Adef37D1D6ee2180D7845AE7020e5d79B29',
        order: 3
      },
      {
        name: 'Litecoin',
        symbol: 'LTC',
        address: 'LdLygre8cKg7ak1tk3LTFTkTtBbhiUiCQn',
        order: 4
      }
    ];

    for (const account of cryptoAccounts) {
      await prisma.cryptoAccount.upsert({
        where: { symbol: account.symbol },
        update: account,
        create: account
      });
    }

    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('@gmail2020k', 12);

    await prisma.user.upsert({
      where: { email: 'alfredkaizen30@gmail.com' },
      update: {},
      create: {
        email: 'alfredkaizen30@gmail.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        balance: 0
      }
    });

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🌱 Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };