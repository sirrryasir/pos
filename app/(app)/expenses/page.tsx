import { getExpenses } from "@/actions/expenses";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseDialog } from "./expense-dialog";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { DataTablePagination } from "@/components/data-table-pagination";

export default async function ExpensesPage() {
    const expenses = await getExpenses();

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Expenses Log</h1>
                <ExpenseDialog />
            </div>

            <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
                <DataTableToolbar searchPlaceholder="Filter expenses..." showExport={true} />
                <Table>
                    <TableCaption>A list of operational expenses.</TableCaption>
                    <TableHeader className="bg-muted/10">
                        <TableRow className="hover:bg-transparent border-border/30">
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Date</TableHead>
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Description</TableHead>
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Category</TableHead>
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id} className="border-border/30 hover:bg-muted/10 transition-colors">
                                <TableCell className="whitespace-nowrap text-[13px] text-muted-foreground">
                                    {expense.createdAt.toLocaleDateString()} {expense.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </TableCell>
                                <TableCell className="text-[13px] font-medium text-foreground">{expense.description}</TableCell>
                                <TableCell className="text-[13px] text-muted-foreground">
                                    {expense.category ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/50 text-secondary-foreground border border-secondary/20">
                                            {expense.category}
                                        </span>
                                    ) : "-"}
                                </TableCell>
                                <TableCell className="text-right font-medium text-destructive text-[13px]">
                                    ${expense.amount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {expenses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                                    No expenses logged yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <DataTablePagination totalItems={expenses.length} />
            </div>
        </div>
    );
}
