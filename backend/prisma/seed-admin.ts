import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const username = 'alfredkaizen30';
    const email = 'alfredkaizen30@gmail.com';
    const password = '@gmail2020k';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const existing = await prisma.user.findFirst({
        where: { email: email }
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
            firstName: 'Alfred',
            lastName: 'Kaizen',
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