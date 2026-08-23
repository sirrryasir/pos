"use client";

import { Product } from "@prisma/client";
import { ProductDialog } from "./product-dialog";
import { DataTable, ColumnDef } from "@/components/data-table";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Pen, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/products";
import { ImportDialog } from "./import-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function InventoryTable({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openAddDialog = () => {
        setSelectedProduct(null);
        setDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const confirmDelete = (productId: string) => {
        setProductToDelete(productId);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            await deleteProduct(productToDelete);
            setProducts(products.filter(p => p.id !== productToDelete));
            toast.success("Product deleted successfully");
            setDeleteConfirmOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };
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
            exportValue: (p) => p.price.toString(),
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
            cell: (p) => (
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEditDialog(p)}>
                        <Pen className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                        onClick={() => confirmDelete(p.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // Extract unique categories for the filter
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

    return (
        <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
            <ProductDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                product={selectedProduct} 
                onSuccess={() => window.location.reload()}
            />
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Product"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DataTable 
                data={products} 
                columns={columns}
                searchKey="name"
                searchPlaceholder="Filter products by name..."
                filterKey="category"
                filterOptions={categories}
                showExport={true}
                exportFilenamePrefix="Inventory"
                emptyMessage="No products found."
                toolbarActions={
                    <>
                        <ImportDialog />
                        <Button onClick={openAddDialog} className="h-9 px-3 text-[13px] gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </>
                }
            />
        </div>
    );
}
