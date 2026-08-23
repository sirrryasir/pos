import { prisma } from '../lib/prisma';
import { auth } from '../lib/auth';

async function main() {
    console.log('Starting seed...');

    // 1. Create Admin User
    console.log('Creating Admin account...');
    try {
        const adminEmail = 'admin@pos.com';
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (!existingAdmin) {
            // Use BetterAuth API to correctly handle password hashing and account creation
            const res = await auth.api.signUpEmail({
                body: {
                    email: adminEmail,
                    password: "password123",
                    name: "Admin User",
                }
            } as any);
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }

        // Ensure the role is set to 'admin'
        await prisma.user.update({
            where: { email: adminEmail },
            data: { role: 'admin' }
        });
        console.log('Admin role ensured');
    } catch (error) {
        console.error('Error creating admin user:', error);
    }

    // 2. Create Products using upsert
    console.log('Seeding products...');
    const products = [
        { name: "Shaamboo Cad", category: "Cosmetics", price: 5.50, stock: 100 },
        { name: "Saabuun Dettol", category: "Cosmetics", price: 1.20, stock: 250 },
        { name: "Kareem Waji", category: "Cosmetics", price: 8.00, stock: 50 },
        { name: "Cadar Nida", category: "Perfumes", price: 15.00, stock: 30 },
        { name: "Buraashka Ilkaha", category: "Health", price: 2.00, stock: 120 }
    ];

    for (const p of products) {
        const existing = await prisma.product.findFirst({
            where: { name: p.name }
        });

        if (!existing) {
            await prisma.product.create({
                data: p
            });
        }
    }

    // 3. Create Expenses
    console.log('Seeding expenses...');
    const expenses = [
        { description: "Kiro Dukaan - August", amount: 200, category: "Rent" },
        { description: "Koronto", amount: 45, category: "Utilities" },
        { description: "Nadiifin", amount: 10, category: "Maintenance" }
    ];

    for (const e of expenses) {
        const existing = await prisma.expense.findFirst({
            where: { description: e.description }
        });

        if (!existing) {
            await prisma.expense.create({
                data: e
            });
        }
    }

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
