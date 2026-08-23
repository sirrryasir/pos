import { getDashboardAnalytics } from "@/actions/analytics";
import { getRecentSales } from "@/actions/sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { DataTablePagination } from "@/components/data-table-pagination";

export default async function DashboardPage() {
    const analytics = await getDashboardAnalytics();
    const recentSales = await getRecentSales();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 border-b border-border/50 pb-5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground text-xs">Overview of your business performance today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card shadow-sm border-border rounded-xl overflow-hidden transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Sales (Today)</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">${analytics.today.sales.toFixed(2)}</div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            {analytics.today.salesCount} transactions today
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="bg-card shadow-sm border-border rounded-xl overflow-hidden transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Expenses (Today)</CardTitle>
                        <Receipt className="h-4 w-4 text-destructive" strokeWidth={1.5} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">${analytics.today.expenses.toFixed(2)}</div>
                    </CardContent>
                </Card>
                
                <Card className={`bg-card shadow-sm border-border rounded-xl overflow-hidden transition-all`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Net Profit (Today)</CardTitle>
                        {analytics.today.netProfit >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" strokeWidth={1.5} />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" strokeWidth={1.5} />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${analytics.today.netProfit >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                            ${analytics.today.netProfit.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                
                <Card className={`bg-card shadow-sm border-border rounded-xl overflow-hidden transition-all`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Profit (This Month)</CardTitle>
                        {analytics.thisMonth.netProfit >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" strokeWidth={1.5} />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" strokeWidth={1.5} />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ${analytics.thisMonth.netProfit.toFixed(2)}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Sales: ${analytics.thisMonth.sales.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card shadow-sm border-border rounded-xl">
                    <CardHeader className="border-b border-border/30 pb-3 pt-4">
                        <CardTitle className="text-sm font-semibold">Recent Sales</CardTitle>
                    </CardHeader>
                    <DataTableToolbar searchPlaceholder="Search sales..." showExport={false} showFilter={false} />
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent border-border/30">
                                    <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Time</TableHead>
                                    <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Product</TableHead>
                                    <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Qty</TableHead>
                                    <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Method</TableHead>
                                    <TableHead className="py-3 text-[12px] font-medium text-muted-foreground text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentSales.map((sale) => (
                                    <TableRow key={sale.id} className="border-border/30 hover:bg-muted/10 transition-colors">
                                        <TableCell className="text-[13px] text-muted-foreground">{sale.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</TableCell>
                                        <TableCell className="text-[13px] font-medium text-foreground">{sale.product.name}</TableCell>
                                        <TableCell className="text-[13px] text-muted-foreground">{sale.quantity}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/50 text-secondary-foreground border border-secondary/20">
                                                {sale.paymentMethod}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[13px] text-right font-medium text-foreground">${sale.totalAmount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                {recentSales.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                            No sales yet today.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <DataTablePagination totalItems={recentSales.length} />
                </Card>
            </div>
        </div>
    );
}
