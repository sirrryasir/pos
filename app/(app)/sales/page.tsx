import { getAllSales } from "@/actions/sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSalesTable } from "../recent-sales-table";

export default async function SalesPage() {
  const sales = await getAllSales();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6 pb-5 border-b border-border/50">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Sales History</h1>
      </div>

      <RecentSalesTable initialSales={sales} />
    </div>
  );
}
