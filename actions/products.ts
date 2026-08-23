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
