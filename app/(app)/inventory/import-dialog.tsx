"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { bulkCreateProducts } from "@/actions/products";

export function ImportDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!file) {
            toast.error("Please select a file to import");
            return;
        }

        setLoading(true);

        try {
            const Papa = (await import("papaparse")).default;
            
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    try {
                        const productsToImport = results.data.map((row: any) => {
                            if (!row.name || !row.price) {
                                throw new Error("Invalid CSV format. Ensure 'name' and 'price' columns exist.");
                            }
                            return {
                                name: row.name,
                                category: row.category || undefined,
                                price: parseFloat(row.price),
                                stock: parseInt(row.stock) || 0,
                            };
                        });

                        const count = await bulkCreateProducts(productsToImport);
                        toast.success(`Successfully imported ${count} products.`);
                        setOpen(false);
                        setFile(null);
                    } catch (error: any) {
                        toast.error(error.message || "Failed to process imported data");
                    } finally {
                        setLoading(false);
                    }
                },
                error: (error) => {
                    toast.error(`CSV Parsing error: ${error.message}`);
                    setLoading(false);
                }
            });
        } catch (error) {
            toast.error("Failed to load parser");
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <UploadCloud className="h-4 w-4" />
                    Import CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Products</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to bulk import or update inventory. 
                        The CSV must have headers: <strong>name, category, price, stock</strong>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Input 
                            id="csv" 
                            type="file" 
                            accept=".csv"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={!file || loading}>
                        {loading ? "Importing..." : "Import"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
