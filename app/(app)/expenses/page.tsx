import { getExpenses } from "@/actions/expenses";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseDialog } from "./expense-dialog";

export default async function ExpensesPage() {
    const expenses = await getExpenses();

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Expenses Log</h1>
                <ExpenseDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableCaption>A list of operational expenses.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="whitespace-nowrap">
                                    {expense.createdAt.toLocaleDateString()} {expense.createdAt.toLocaleTimeString()}
                                </TableCell>
                                <TableCell className="font-medium">{expense.description}</TableCell>
                                <TableCell>{expense.category || "-"}</TableCell>
                                <TableCell className="text-right font-semibold text-red-500">
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
            </div>
        </div>
    );
}
