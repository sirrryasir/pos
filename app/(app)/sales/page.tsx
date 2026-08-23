import { getAllSales } from "@/actions/sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSalesTable } from "../recent-sales-table";

export default async function SalesPage() {
    const sales = await getAllSales();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 border-b border-border/50 pb-5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Sales History
                </h1>
                <p className="text-muted-foreground text-xs">
                    View and manage all sales transactions.
                </p>
            </div>

            <div className="w-full">
                <Card className="bg-card shadow-sm border-border rounded-xl overflow-hidden w-full">
                    <CardHeader className="border-b border-border/30 pb-3 pt-4">
                        <CardTitle className="text-sm font-semibold">
                            All Sales
                        </CardTitle>
                    </CardHeader>
                    <RecentSalesTable initialSales={sales} />
                </Card>
            </div>
        </div>
    );
}
