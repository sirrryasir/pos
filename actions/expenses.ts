"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
    return await prisma.expense.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createExpense(data: { description: string; amount: number; category?: string }) {
    const expense = await prisma.expense.create({
        data,
    });
    revalidatePath("/expenses");
    revalidatePath("/");
    return expense;
}
