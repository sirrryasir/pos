"use client";

import { Product } from "@prisma/client";
import { ProductDialog } from "./product-dialog";
import { DataTable, ColumnDef } from "@/components/data-table";

export function InventoryTable({ initialProducts }: { initialProducts: Product[] }) {
    const columns: ColumnDef<Product>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: (p) => <span className="font-medium text-foreground">{p.name}</span>,
        },
        {
            header: "Category",
            accessorKey: "category",
            cell: (p) => p.category ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/50 text-secondary-foreground border border-secondary/20">
                    {p.category}
                </span>
            ) : "-",
        },
        {
            header: "Price",
            accessorKey: "price",
            align: "right",
            cell: (p) => <span className="font-medium">${p.price.toFixed(2)}</span>,
        },
        {
            header: "Stock",
            accessorKey: "stock",
            align: "right",
            cell: (p) => <span className="text-muted-foreground">{p.stock}</span>,
        },
        {
            header: "Actions",
            align: "right",
            cell: (p) => <ProductDialog product={p} />,
        },
    ];

    // Extract unique categories for the filter
    const categories = Array.from(new Set(initialProducts.map(p => p.category).filter(Boolean))) as string[];

    return (
        <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
            <DataTable 
                data={initialProducts} 
                columns={columns}
                searchKey="name"
                searchPlaceholder="Filter products by name..."
                filterKey="category"
                filterOptions={categories}
                showExport={true}
                emptyMessage="No products found."
            />
        </div>
    );
}
