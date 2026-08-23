import { getExpenses } from "@/actions/expenses";
import { ExpenseDialog } from "./expense-dialog";
import { ExpensesTable } from "./expenses-table";

export default async function ExpensesPage() {
    const expenses = await getExpenses();

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Expenses Log</h1>
                <ExpenseDialog />
            </div>

            <ExpensesTable initialExpenses={expenses} />
        </div>
    );
}
