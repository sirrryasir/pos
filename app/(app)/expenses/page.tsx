import { getExpenses } from "@/actions/expenses";
import { ExpenseDialog } from "./expense-dialog";
import { ExpensesTable } from "./expenses-table";

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-6 pb-5 border-b border-border/50">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Expenses</h1>
      </div>
      <ExpensesTable initialExpenses={expenses} />
    </div>
  );
}
