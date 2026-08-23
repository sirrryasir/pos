import { prisma } from '../lib/prisma';
import { auth } from '../lib/auth';

async function main() {
    console.log('Starting seed...');

    // 1. Create Admin User using Better Auth to ensure password hashing works
    try {
        console.log('Cleaning up existing users...');
        await prisma.user.deleteMany({
            where: { email: { in: ['testuser@pos.com', 'test2user@pos.com', 'admin@pos.com'] } }
        });

        // Use BetterAuth API to correctly handle password hashing and account creation
        const res = await auth.api.signUpEmail({
            body: {
                email: "test2user@pos.com",
                password: "password123",
                name: "Test User",
            }
        } as any);
        console.log('Test user created successfully');
    } catch (error) {
        console.error('Error creating test user:', error);
    }

    // 2. Create Products
    console.log('Seeding products...');
    const products = [
        { name: "Shaamboo Cad", category: "Cosmetics", price: 5.50, stock: 100 },
        { name: "Saabuun Dettol", category: "Cosmetics", price: 1.20, stock: 250 },
        { name: "Kareem Waji", category: "Cosmetics", price: 8.00, stock: 50 },
        { name: "Cadar Nida", category: "Perfumes", price: 15.00, stock: 30 },
        { name: "Buraashka Ilkaha", category: "Health", price: 2.00, stock: 120 }
    ];

    for (const p of products) {
        await prisma.product.create({
            data: p
        });
    }

    // 3. Create Expenses
    console.log('Seeding expenses...');
    await prisma.expense.createMany({
        data: [
            { description: "Kiro Dukaan - August", amount: 200, category: "Rent" },
            { description: "Koronto", amount: 45, category: "Utilities" },
            { description: "Nadiifin", amount: 10, category: "Maintenance" }
        ]
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
