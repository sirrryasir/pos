"use client";

import { Expense } from "@prisma/client";
import { ExpenseDialog } from "./expense-dialog";
import { DataTable, ColumnDef } from "@/components/data-table";

export function ExpensesTable({ initialExpenses }: { initialExpenses: Expense[] }) {
    const columns: ColumnDef<Expense>[] = [
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: (e) => <span className="whitespace-nowrap text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()} {new Date(e.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>,
        },
        {
            header: "Description",
            accessorKey: "description",
            cell: (e) => <span className="font-medium text-foreground">{e.description}</span>,
        },
        {
            header: "Category",
            accessorKey: "category",
            cell: (e) => e.category ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/50 text-secondary-foreground border border-secondary/20">
                    {e.category}
                </span>
            ) : "-",
        },
        {
            header: "Amount",
            accessorKey: "amount",
            align: "right",
            cell: (e) => <span className="font-medium text-destructive">${e.amount.toFixed(2)}</span>,
        },
    ];

    // Extract unique categories
    const categories = Array.from(new Set(initialExpenses.map(e => e.category).filter(Boolean))) as string[];

    return (
        <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
            <DataTable 
                data={initialExpenses} 
                columns={columns}
                searchKey="description"
                searchPlaceholder="Filter expenses by description..."
                filterKey="category"
                filterOptions={categories}
                showExport={true}
                emptyMessage="No expenses found."
            />
        </div>
    );
}
