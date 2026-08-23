"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardAnalytics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Sales
    const salesToday = await prisma.sale.aggregate({
        where: { createdAt: { gte: today } },
        _sum: { totalAmount: true },
        _count: true,
    });

    const salesThisMonth = await prisma.sale.aggregate({
        where: { createdAt: { gte: firstDayOfMonth } },
        _sum: { totalAmount: true },
        _count: true,
    });

    // Expenses
    const expensesToday = await prisma.expense.aggregate({
        where: { createdAt: { gte: today } },
        _sum: { amount: true },
    });

    const expensesThisMonth = await prisma.expense.aggregate({
        where: { createdAt: { gte: firstDayOfMonth } },
        _sum: { amount: true },
    });

    return {
        today: {
            sales: salesToday._sum.totalAmount || 0,
            salesCount: salesToday._count || 0,
            expenses: expensesToday._sum.amount || 0,
            netProfit: (salesToday._sum.totalAmount || 0) - (expensesToday._sum.amount || 0),
        },
        thisMonth: {
            sales: salesThisMonth._sum.totalAmount || 0,
            salesCount: salesThisMonth._count || 0,
            expenses: expensesThisMonth._sum.amount || 0,
            netProfit: (salesThisMonth._sum.totalAmount || 0) - (expensesThisMonth._sum.amount || 0),
        }
    };
}
