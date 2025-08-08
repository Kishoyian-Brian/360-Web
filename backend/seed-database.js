const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    try {
        // Create admin user
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

        console.log('✅ Database seeding completed!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
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
