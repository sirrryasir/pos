import { getProducts } from "@/actions/products";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductDialog } from "./product-dialog";

export default async function InventoryPage() {
    const products = await getProducts();

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                <ProductDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableCaption>A list of your current inventory.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category || "-"}</TableCell>
                                <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{product.stock}</TableCell>
                                <TableCell className="text-right">
                                    <ProductDialog product={product} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
