import { getProducts } from "@/actions/products";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductDialog } from "./product-dialog";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { DataTablePagination } from "@/components/data-table-pagination";

export default async function InventoryPage() {
    const products = await getProducts();

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Inventory Management</h1>
                <ProductDialog />
            </div>

            <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
                <DataTableToolbar searchPlaceholder="Filter products..." showExport={true} />
                <Table>
                    <TableCaption>A list of your current inventory.</TableCaption>
                    <TableHeader className="bg-muted/10">
                        <TableRow className="hover:bg-transparent border-border/30">
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Name</TableHead>
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground">Category</TableHead>
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground text-right">Price</TableHead>
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground text-right">Stock</TableHead>
                            <TableHead className="py-3 text-[12px] font-medium text-muted-foreground text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} className="border-border/30 hover:bg-muted/10 transition-colors">
                                <TableCell className="text-[13px] font-medium">{product.name}</TableCell>
                                <TableCell className="text-[13px] text-muted-foreground">
                                    {product.category ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/50 text-secondary-foreground border border-secondary/20">
                                            {product.category}
                                        </span>
                                    ) : "-"}
                                </TableCell>
                                <TableCell className="text-[13px] text-right font-medium">${product.price.toFixed(2)}</TableCell>
                                <TableCell className="text-[13px] text-right text-muted-foreground">{product.stock}</TableCell>
                                <TableCell className="text-right">
                                    <ProductDialog product={product} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <DataTablePagination totalItems={products.length} />
            </div>
        </div>
    );
}
