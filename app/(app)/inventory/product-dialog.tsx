"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import type { Product } from "@prisma/client";

export function ProductDialog({ product }: { product?: Product }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(product?.name || "");
    const [category, setCategory] = useState(product?.category || "");
    const [price, setPrice] = useState(product?.price?.toString() || "");
    const [stock, setStock] = useState(product?.stock?.toString() || "");
    const isEdit = !!product;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                name,
                category: category || undefined,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
            };
            if (isEdit) {
                await updateProduct(product.id, data);
            } else {
                await createProduct(data);
            }
            setOpen(false);
            if (!isEdit) {
                setName("");
                setCategory("");
                setPrice("");
                setStock("");
            }
        } catch (error) {
            console.error("Failed to save product", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!product) return;
        setLoading(true);
        try {
            await deleteProduct(product.id);
            setOpen(false);
        } catch (error) {
            console.error("Failed to delete product", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"}>
                    {isEdit ? "Edit" : "Add Product"}
                </Button>
            } />
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? "Make changes to your product here." : "Add a new product to your inventory."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-between">
                        {isEdit ? (
                            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                                Delete
                            </Button>
                        ) : <div></div>}
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
