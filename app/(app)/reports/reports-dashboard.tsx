"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, DollarSign, ShoppingCart, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ReportsDashboard({ data }: { data: any }) {
    const handleExportExcel = () => {
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `RevenueReport_${dateStr}.csv`;
        import("papaparse").then((Papa) => {
            const csv1 = Papa.unparse(data.revenueData);
            const blob = new Blob([csv1], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const handleExportPDF = () => {
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `BusinessReport_${dateStr}.pdf`;
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then((autoTable) => {
                const doc = new jsPDF.default();
                doc.text("Business Report", 14, 15);
                autoTable.default(doc, {
                    startY: 25,
                    head: [["Date", "Revenue"]],
                    body: data.revenueData.map((d: any) => [d.date, `$${d.amount.toFixed(2)}`]),
                    headStyles: { fillColor: [249, 115, 22] },
                });
                doc.addPage();
                doc.text("Top Products", 14, 15);
                autoTable.default(doc, {
                    startY: 25,
                    head: [["Product Name", "Qty Sold", "Total Revenue"]],
                    body: data.topProducts.map((p: any) => [p.name, p.qty, `$${p.total.toFixed(2)}`]),
                    headStyles: { fillColor: [249, 115, 22] },
                });
                doc.save(filename);
            });
        });
    };

    // Calculate totals
    const totalRevenue = data.revenueData.reduce((sum: number, r: any) => sum + r.amount, 0);
    const topProductName = data.topProducts[0]?.name || "N/A";
    const totalTransactions = data.topProducts.reduce((sum: number, p: any) => sum + p.qty, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Analytics Overview</h2>
                    <p className="text-muted-foreground text-sm">
                        Simple, real-time metrics for your business
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportExcel}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button variant="default" size="sm" onClick={handleExportPDF}>
                        <Download className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <p className="text-3xl font-bold tracking-tight">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                            <p className="text-3xl font-bold tracking-tight">{totalTransactions}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Top Product</p>
                            <p className="text-xl font-bold tracking-tight truncate max-w-[150px]">{topProductName}</p>
                        </div>
                        <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Simple Tables instead of complex charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>Most popular items by quantity sold</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.topProducts.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.topProducts.map((p: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{p.name}</TableCell>
                                            <TableCell className="text-right">{p.qty}</TableCell>
                                            <TableCell className="text-right">${p.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-sm">
                                No sales data available yet.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daily Revenue</CardTitle>
                        <CardDescription>Income generated per day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.revenueData.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.revenueData.map((r: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{r.date}</TableCell>
                                            <TableCell className="text-right">${r.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-sm">
                                No revenue data available yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
