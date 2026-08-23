import { getProducts } from "@/actions/products";
import { ProductDialog } from "./product-dialog";
import { ImportDialog } from "./import-dialog";
import { InventoryTable } from "./inventory-table";

export default async function InventoryPage() {
    const products = await getProducts();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="mb-6 pb-5 border-b border-border/50 flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Inventory</h1>
            </div>
            <InventoryTable initialProducts={products} />
        </div>
    );
}
