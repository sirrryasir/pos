"use server";

import { prisma } from "@/lib/prisma";

export async function getReportData() {
    // Top Products
    const sales = await prisma.sale.findMany({
        include: { product: true, user: true }
    });

    const productSales: Record<string, { name: string, qty: number, total: number }> = {};
    const cashierSales: Record<string, { name: string, total: number }> = {};
    const dailyRevenue: Record<string, number> = {};

    sales.forEach(s => {
        // Top Products
        if (!productSales[s.productId]) {
            productSales[s.productId] = { name: s.product.name, qty: 0, total: 0 };
        }
        productSales[s.productId].qty += s.quantity;
        productSales[s.productId].total += s.totalAmount;

        // Cashier Performance
        const cashierName = s.user?.name || "System";
        if (!cashierSales[cashierName]) {
            cashierSales[cashierName] = { name: cashierName, total: 0 };
        }
        cashierSales[cashierName].total += s.totalAmount;

        // Daily Revenue (last 7-30 days ideally, here just aggregating by date string)
        const dateStr = s.createdAt.toISOString().split('T')[0];
        if (!dailyRevenue[dateStr]) {
            dailyRevenue[dateStr] = 0;
        }
        dailyRevenue[dateStr] += s.totalAmount;
    });

    const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const cashierData = Object.values(cashierSales).sort((a, b) => b.total - a.total);
    const revenueData = Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date));

    return { topProducts, cashierData, revenueData };
}
