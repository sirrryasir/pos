import { getDashboardAnalytics } from "@/actions/analytics";
import { getRecentSales } from "@/actions/sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react";

export default async function DashboardPage() {
    const analytics = await getDashboardAnalytics();
    const recentSales = await getRecentSales();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 border-b border-border/50 pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground text-sm">Overview of your business performance today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/30 backdrop-blur-xl border-border/50 shadow-lg relative overflow-hidden transition-all hover:bg-card/50">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Sales (Today)</CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-foreground mt-2">${analytics.today.sales.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {analytics.today.salesCount} transactions today
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="bg-card/30 backdrop-blur-xl border-border/50 shadow-lg relative overflow-hidden transition-all hover:bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Expenses (Today)</CardTitle>
                        <div className="p-2 bg-destructive/10 rounded-lg">
                            <Receipt className="h-4 w-4 text-destructive" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-destructive mt-2">${analytics.today.expenses.toFixed(2)}</div>
                    </CardContent>
                </Card>
                
                <Card className="bg-card/30 backdrop-blur-xl border-border/50 shadow-lg relative overflow-hidden transition-all hover:bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Net Profit (Today)</CardTitle>
                        <div className={`p-2 rounded-lg ${analytics.today.netProfit >= 0 ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                            {analytics.today.netProfit >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-destructive" />
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className={`text-3xl font-bold mt-2 ${analytics.today.netProfit >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                            ${analytics.today.netProfit.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-card/30 backdrop-blur-xl border-border/50 shadow-lg relative overflow-hidden transition-all hover:bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profit (This Month)</CardTitle>
                        <div className={`p-2 rounded-lg ${analytics.thisMonth.netProfit >= 0 ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                             {analytics.thisMonth.netProfit >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-destructive" />
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-foreground mt-2">
                            ${analytics.thisMonth.netProfit.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sales: ${analytics.thisMonth.sales.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card/30 backdrop-blur-xl border-border/50 shadow-lg">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <CardTitle className="text-lg">Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="py-4">Time</TableHead>
                                    <TableHead className="py-4">Product</TableHead>
                                    <TableHead className="py-4">Qty</TableHead>
                                    <TableHead className="py-4">Method</TableHead>
                                    <TableHead className="py-4 text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentSales.map((sale) => (
                                    <TableRow key={sale.id} className="border-border/20 hover:bg-muted/20 transition-colors">
                                        <TableCell className="text-muted-foreground">{sale.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</TableCell>
                                        <TableCell className="font-medium text-foreground">{sale.product.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{sale.quantity}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                                                {sale.paymentMethod}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-foreground">${sale.totalAmount.toFixed(2)}</TableCell>
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
                </Card>
            </div>
        </div>
    );
}
