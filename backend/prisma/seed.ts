import { PrismaClient, UserRole, CategoryType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    await createAdminUser();
    
    // Create categories
    await createCategories();
    
    console.log('✅ Database seeding completed!');
}

async function createAdminUser() {
    const username = 'alfredkaizen30';
    const email = 'alfredkaizen30@gmail.com';
    const password = '@gmail2020k';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existing = await prisma.user.findFirst({
        where: { email: email }
    });
    
    if (existing) {
        console.log('👤 Admin user already exists:', existing.username);
        return;
    }

    const admin = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role: UserRole.ADMIN,
            isActive: true,
            firstName: 'Alfred',
            lastName: 'Kaizen',
        },
    });
    console.log('👤 Admin user created:', admin.username);
}

async function createCategories() {
    const categories = [
        // MAIN categories
        { name: 'Bank Logs', slug: 'bank-logs', type: CategoryType.MAIN, order: 1 },
        { name: 'Bitcoin Log', slug: 'bitcoin-log', type: CategoryType.MAIN, order: 2 },
        { name: 'Carded', slug: 'carded', type: CategoryType.MAIN, order: 3 },
        { name: 'Carded Products', slug: 'carded-products', type: CategoryType.MAIN, order: 4 },
        { name: 'Cashapp Log', slug: 'cashapp-log', type: CategoryType.MAIN, order: 5 },
        { name: 'CC CVV', slug: 'cc-cvv', type: CategoryType.MAIN, order: 6 },
        { name: 'Clips', slug: 'clips', type: CategoryType.MAIN, order: 7 },
        { name: 'Clone', slug: 'clone', type: CategoryType.MAIN, order: 8 },
        { name: 'Deposit Check', slug: 'deposit-check', type: CategoryType.MAIN, order: 9 },
        { name: 'E-Gift Cards', slug: 'e-gift-cards', type: CategoryType.MAIN, order: 10 },
        { name: 'Fraud Cards', slug: 'fraud-cards', type: CategoryType.MAIN, order: 11 },
        { name: 'Fullz', slug: 'fullz', type: CategoryType.MAIN, order: 12 },
        { name: 'Linkable', slug: 'linkable', type: CategoryType.MAIN, order: 13 },
        { name: 'Paypal Log', slug: 'paypal-log', type: CategoryType.MAIN, order: 14 },
        { name: 'Shake', slug: 'shake', type: CategoryType.MAIN, order: 15 },
        { name: 'Stealth Accounts', slug: 'stealth-accounts', type: CategoryType.MAIN, order: 16 },
        { name: 'Tools', slug: 'tools', type: CategoryType.MAIN, order: 17 },
        { name: 'Transfers', slug: 'transfers', type: CategoryType.MAIN, order: 18 },

        // MORE LOGS categories
        { name: 'Africa Cards', slug: 'africa-cards', type: CategoryType.MORE_LOGS, order: 19 },
        { name: 'Australia Cards', slug: 'australia-cards', type: CategoryType.MORE_LOGS, order: 20 },
        { name: 'Canada Banks', slug: 'canada-banks', type: CategoryType.MORE_LOGS, order: 21 },
        { name: 'Canada Cards', slug: 'canada-cards', type: CategoryType.MORE_LOGS, order: 22 },
        { name: 'Credit Unions', slug: 'credit-unions', type: CategoryType.MORE_LOGS, order: 23 },
        { name: 'Crypto Logs', slug: 'crypto-logs', type: CategoryType.MORE_LOGS, order: 24 },
        { name: 'Europe Cards', slug: 'europe-cards', type: CategoryType.MORE_LOGS, order: 25 },
        { name: 'UK Banks', slug: 'uk-banks', type: CategoryType.MORE_LOGS, order: 26 },
        { name: 'UK Cards', slug: 'uk-cards', type: CategoryType.MORE_LOGS, order: 27 },
        { name: 'USA Banks', slug: 'usa-banks', type: CategoryType.MORE_LOGS, order: 28 },
        { name: 'USA Cards', slug: 'usa-cards', type: CategoryType.MORE_LOGS, order: 29 },

        // LINKABLE categories
        { name: 'Apple Pay', slug: 'applepay', type: CategoryType.LINKABLES, order: 30 },
        { name: 'Cashapp', slug: 'cashapp', type: CategoryType.LINKABLES, order: 31 },
        { name: 'Google Pay', slug: 'googlepay', type: CategoryType.LINKABLES, order: 32 },
        { name: 'Paypal', slug: 'paypal', type: CategoryType.LINKABLES, order: 33 },
        { name: 'Venmo', slug: 'venmo', type: CategoryType.LINKABLES, order: 34 },

        // TRANSFERS categories
        { name: 'Bank Transfers', slug: 'bank-transfers', type: CategoryType.TRANSFERS, order: 35 },
        { name: 'Cash Transfers', slug: 'cash-transfers', type: CategoryType.TRANSFERS, order: 36 },
        { name: 'Crypto Transfers', slug: 'crypto-transfers', type: CategoryType.TRANSFERS, order: 37 },
        { name: 'Digital Transfers', slug: 'digital-transfers', type: CategoryType.TRANSFERS, order: 38 },
        { name: 'International Transfers', slug: 'international-transfers', type: CategoryType.TRANSFERS, order: 39 },
        { name: 'Local Transfers', slug: 'local-transfers', type: CategoryType.TRANSFERS, order: 40 },
    ];

    let createdCount = 0;
    let existingCount = 0;

    for (const category of categories) {
        const existing = await prisma.category.findFirst({
            where: { slug: category.slug }
        });

        if (existing) {
            existingCount++;
            continue;
        }

        await prisma.category.create({
            data: {
                name: category.name,
                slug: category.slug,
                type: category.type,
                order: category.order,
                isActive: true,
            },
        });
        createdCount++;
    }

    console.log(`📂 Categories: ${createdCount} created, ${existingCount} already exist`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
