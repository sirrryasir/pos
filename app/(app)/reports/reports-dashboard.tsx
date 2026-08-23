"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1', '#ec4899'];

export function ReportsDashboard({ data }: { data: any }) {
    
    const handleExportExcel = () => {
        import("papaparse").then((Papa) => {
            const csv1 = Papa.unparse(data.revenueData);
            const csv2 = Papa.unparse(data.topProducts);
            const csv3 = Papa.unparse(data.cashierData);
            
            // Just export revenue data for now as simple example
            const blob = new Blob([csv1], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "revenue_report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const handleExportPDF = () => {
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then((autoTable) => {
                const doc = new jsPDF.default();
                doc.text("Business Report", 14, 15);
                
                autoTable.default(doc, {
                    startY: 25,
                    head: [["Date", "Revenue"]],
                    body: data.revenueData.map((d: any) => [d.date, `$${d.amount.toFixed(2)}`]),
                });

                doc.addPage();
                doc.text("Top Products", 14, 15);
                autoTable.default(doc, {
                    startY: 25,
                    head: [["Product Name", "Qty Sold", "Total Revenue"]],
                    body: data.topProducts.map((p: any) => [p.name, p.qty, `$${p.total.toFixed(2)}`]),
                });
                
                doc.save("business_report.pdf");
            });
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={handleExportExcel}>
                    <Download className="mr-2 h-4 w-4" /> Export Excel
                </Button>
                <Button variant="default" size="sm" onClick={handleExportPDF}>
                    <Download className="mr-2 h-4 w-4" /> Export PDF
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Revenue</CardTitle>
                        <CardDescription>Revenue over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                                <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>By quantity sold</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topProducts} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                                <Bar dataKey="qty" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Cashier Performance</CardTitle>
                        <CardDescription>Total sales processed per user</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.cashierData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="total"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.cashierData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
