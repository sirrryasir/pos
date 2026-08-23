"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, DollarSign, ShoppingCart, Tag } from "lucide-react";
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
    const topCategoryName = data.topCategories?.[0]?.name || "N/A";
    const totalTransactions = data.topProducts.reduce((sum: number, p: any) => sum + p.qty, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4">
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
                        <div className="h-10 w-10 border rounded-lg flex items-center justify-center text-muted-foreground">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                            <p className="text-3xl font-bold tracking-tight">{totalTransactions}</p>
                        </div>
                        <div className="h-10 w-10 border rounded-lg flex items-center justify-center text-muted-foreground">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                            <p className="text-xl font-bold tracking-tight truncate max-w-[150px]">{topCategoryName}</p>
                        </div>
                        <div className="h-10 w-10 border rounded-lg flex items-center justify-center text-muted-foreground">
                            <Tag className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Simple Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                        <CardDescription>Most popular items by quantity sold</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.topProducts && data.topProducts.length > 0 ? (
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

                {/* Top Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Categories</CardTitle>
                        <CardDescription>Best performing product categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.topCategories && data.topCategories.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.topCategories.map((c: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell className="text-right">{c.qty}</TableCell>
                                            <TableCell className="text-right">${c.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-sm">
                                No category data available yet.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Daily Revenue Table */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Revenue</CardTitle>
                        <CardDescription>Income generated per day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.revenueData && data.revenueData.length > 0 ? (
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
