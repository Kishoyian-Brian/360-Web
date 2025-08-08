const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    try {
        // Create admin user
        await createAdminUser();
        
        // Create categories
        await createCategories();
        
        console.log('✅ Database seeding completed!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
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
    } else {
        const admin = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true,
                firstName: 'Alfred',
                lastName: 'Kaizen',
            },
        });
        console.log('👤 Admin user created:', admin.username);
    }
}

async function createCategories() {
    const categories = [
        // MAIN categories
        { name: 'Bank Logs', slug: 'bank-logs', type: 'MAIN', order: 1 },
        { name: 'Bitcoin Log', slug: 'bitcoin-log', type: 'MAIN', order: 2 },
        { name: 'Carded', slug: 'carded', type: 'MAIN', order: 3 },
        { name: 'Carded Products', slug: 'carded-products', type: 'MAIN', order: 4 },
        { name: 'Cashapp Log', slug: 'cashapp-log', type: 'MAIN', order: 5 },
        { name: 'CC CVV', slug: 'cc-cvv', type: 'MAIN', order: 6 },
        { name: 'Clips', slug: 'clips', type: 'MAIN', order: 7 },
        { name: 'Clone', slug: 'clone', type: 'MAIN', order: 8 },
        { name: 'Deposit Check', slug: 'deposit-check', type: 'MAIN', order: 9 },
        { name: 'E-Gift Cards', slug: 'e-gift-cards', type: 'MAIN', order: 10 },
        { name: 'Fraud Cards', slug: 'fraud-cards', type: 'MAIN', order: 11 },
        { name: 'Fullz', slug: 'fullz', type: 'MAIN', order: 12 },
        { name: 'Linkable', slug: 'linkable', type: 'MAIN', order: 13 },
        { name: 'Paypal Log', slug: 'paypal-log', type: 'MAIN', order: 14 },
        { name: 'Shake', slug: 'shake', type: 'MAIN', order: 15 },
        { name: 'Stealth Accounts', slug: 'stealth-accounts', type: 'MAIN', order: 16 },
        { name: 'Tools', slug: 'tools', type: 'MAIN', order: 17 },
        { name: 'Transfers', slug: 'transfers', type: 'MAIN', order: 18 },
        
        // LINKABLE categories
        { name: 'Apple Pay', slug: 'applepay', type: 'LINKABLE', order: 19 },
        { name: 'Cashapp', slug: 'cashapp', type: 'LINKABLE', order: 20 },
        { name: 'Google Pay', slug: 'googlepay', type: 'LINKABLE', order: 21 },
        { name: 'Paypal', slug: 'paypal', type: 'LINKABLE', order: 22 },
        { name: 'Venmo', slug: 'venmo', type: 'LINKABLE', order: 23 },
        
        // MORELOGS categories
        { name: 'Africa Cards', slug: 'africa-cards', type: 'MORELOGS', order: 24 },
        { name: 'Australia Cards', slug: 'australia-cards', type: 'MORELOGS', order: 25 },
        { name: 'Canada Banks', slug: 'canada-banks', type: 'MORELOGS', order: 26 },
        { name: 'Canada Cards', slug: 'canada-cards', type: 'MORELOGS', order: 27 },
        { name: 'Credit Unions', slug: 'credit-unions', type: 'MORELOGS', order: 28 },
        { name: 'Crypto Logs', slug: 'crypto-logs', type: 'MORELOGS', order: 29 },
        { name: 'Europe Cards', slug: 'europe-cards', type: 'MORELOGS', order: 30 },
        { name: 'UK Banks', slug: 'uk-banks', type: 'MORELOGS', order: 31 },
        { name: 'UK Cards', slug: 'uk-cards', type: 'MORELOGS', order: 32 },
        { name: 'USA Banks', slug: 'usa-banks', type: 'MORELOGS', order: 33 },
        { name: 'USA Cards', slug: 'usa-cards', type: 'MORELOGS', order: 34 },
        
        // TRANSFERS categories
        { name: 'International Transfers', slug: 'international-transfers', type: 'TRANSFERS', order: 35 },
        { name: 'Local Transfers', slug: 'local-transfers', type: 'TRANSFERS', order: 36 },
        { name: 'Wire Transfers', slug: 'wire-transfers', type: 'TRANSFERS', order: 37 },
        { name: 'Zelle Transfers', slug: 'zelle-transfers', type: 'TRANSFERS', order: 38 },
        { name: 'ACH Transfers', slug: 'ach-transfers', type: 'TRANSFERS', order: 39 },
        { name: 'SEPA Transfers', slug: 'sepa-transfers', type: 'TRANSFERS', order: 40 }
    ];

    for (const categoryData of categories) {
        // Check if category already exists
        const existing = await prisma.category.findFirst({
            where: { slug: categoryData.slug }
        });
        
        if (existing) {
            console.log(`📂 Category '${categoryData.name}' already exists`);
        } else {
            const category = await prisma.category.create({
                data: {
                    name: categoryData.name,
                    slug: categoryData.slug,
                    type: categoryData.type,
                    order: categoryData.order,
                    isActive: true
                }
            });
            console.log(`📂 Category '${category.name}' created`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
