import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const email = 'admin@example.com';
    const password = 'Admin123!'; // Change this after first login
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existing = await prisma.user.findFirst({
        where: { role: UserRole.ADMIN }
    });
    if (existing) {
        console.log('Admin user already exists:', existing.username);
        process.exit(0);
    }

    const admin = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role: UserRole.ADMIN,
            isActive: true,
            firstName: 'Admin',
            lastName: 'User',
        },
    });
    console.log('Admin user created:', admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 