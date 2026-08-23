"use client";

import { DataTable, ColumnDef } from "@/components/data-table";

// Create a type for the populated sale
type PopulatedSale = any;

export function RecentSalesTable({ initialSales }: { initialSales: PopulatedSale[] }) {
    const columns: ColumnDef<PopulatedSale>[] = [
        {
            header: "Time",
            accessorKey: "createdAt",
            cell: (s) => <span className="text-muted-foreground">{new Date(s.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>,
            exportValue: (s) => new Date(s.createdAt).toLocaleString(),
        },
        {
            header: "Product",
            accessorKey: "product",
            cell: (s) => <span className="font-medium text-foreground">{s.product.name}</span>,
            exportValue: (s) => s.product?.name || "Unknown Product",
        },
        {
            header: "Qty",
            accessorKey: "quantity",
            cell: (s) => <span className="text-muted-foreground">{s.quantity}</span>,
        },
        {
            header: "Method",
            accessorKey: "paymentMethod",
            cell: (s) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/50 text-secondary-foreground border border-secondary/20">
                    {s.paymentMethod}
                </span>
            ),
        },
        {
            header: "Total",
            accessorKey: "totalAmount",
            align: "right",
            cell: (s) => <span className="font-medium text-foreground">${s.totalAmount.toFixed(2)}</span>,
            exportValue: (s) => `$${s.totalAmount.toFixed(2)}`,
        },
        {
            header: "Cashier",
            accessorKey: "user",
            align: "right",
            cell: (s) => <span className="text-muted-foreground">{s.user?.name || "System"}</span>,
            exportValue: (s) => s.user?.name || "System",
        },
    ];

    return (
        <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
            <DataTable 
                data={initialSales} 
                columns={columns}
                searchKey={(s) => s.product?.name ?? ""}
                searchPlaceholder="Search sales by product..."
                showExport={true}
                exportFilenamePrefix="SalesHistory"
                emptyMessage="No sales yet today."
            />
        </div>
    );
}
