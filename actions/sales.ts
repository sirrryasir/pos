"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createSale(data: { productId: string; quantity: number; paymentMethod: string; customerName?: string }) {
    // Get current user session
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    // We use a transaction to ensure stock is only decremented if the sale is recorded
    const result = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: data.productId },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.stock < data.quantity) {
            throw new Error("Insufficient stock");
        }

        const totalAmount = product.price * data.quantity;

        // Decrement stock
        await tx.product.update({
            where: { id: data.productId },
            data: {
                stock: {
                    decrement: data.quantity,
                },
            },
        });

        // Record the sale
        const sale = await tx.sale.create({
            data: {
                productId: data.productId,
                quantity: data.quantity,
                totalAmount,
                paymentMethod: data.paymentMethod,
                customerName: data.customerName || null,
                userId: session?.user?.id || null, // Track who made the sale
            },
        });

        return sale;
    });

    revalidatePath("/pos");
    revalidatePath("/inventory");
    revalidatePath("/");
    revalidatePath("/sales");
    
    return result;
}

export async function getRecentSales() {
    return await prisma.sale.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
            product: true,
            user: true, // Include cashier info
        }
    });
}

export async function getAllSales() {
    return await prisma.sale.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            product: true,
            user: true, // Include cashier info
        }
    });
}
