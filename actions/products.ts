"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function createProduct(data: { name: string; category?: string; price: number; stock: number }) {
    const product = await prisma.product.create({
        data,
    });
    revalidatePath("/inventory");
    revalidatePath("/pos");
    return product;
}

export async function updateProduct(id: string, data: { name?: string; category?: string; price?: number; stock?: number }) {
    const product = await prisma.product.update({
        where: { id },
        data,
    });
    revalidatePath("/inventory");
    revalidatePath("/pos");
    return product;
}

export async function deleteProduct(id: string) {
    const product = await prisma.product.delete({
        where: { id },
    });
    revalidatePath("/inventory");
    revalidatePath("/pos");
    return product;
}

export async function bulkCreateProducts(products: { name: string; category?: string; price: number; stock: number }[]) {
    // using createMany to insert in bulk, skipping duplicates by name is not directly supported in Prisma SQLite/PG without specific flags,
    // so we can either ignore duplicates or do individual upserts.
    let imported = 0;
    
    for (const p of products) {
        const existing = await prisma.product.findFirst({
            where: { name: { equals: p.name, mode: 'insensitive' } }
        });
        
        if (existing) {
            await prisma.product.update({
                where: { id: existing.id },
                data: {
                    category: p.category,
                    price: p.price,
                    stock: p.stock
                }
            });
        } else {
            await prisma.product.create({
                data: p
            });
        }
        imported++;
    }
    
    revalidatePath("/inventory");
    revalidatePath("/pos");
    return imported;
}
