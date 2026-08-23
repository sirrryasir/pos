import { getProducts } from "@/actions/products";
import { ProductDialog } from "./product-dialog";
import { ImportDialog } from "./import-dialog";
import { InventoryTable } from "./inventory-table";

export default async function InventoryPage() {
    const products = await getProducts();

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Inventory Management</h1>
                <div className="flex items-center gap-2">
                    <ImportDialog />
                    <ProductDialog />
                </div>
            </div>

            <InventoryTable initialProducts={products} />
        </div>
    );
}
