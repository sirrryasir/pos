"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createSale } from "@/actions/sales";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

export function PosCheckout({ products }: { products: Product[] }) {
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<string>("Zaad");
    const [customerName, setCustomerName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const selectedProduct = products.find(p => p.id === selectedProductId);
    const totalAmount = selectedProduct ? selectedProduct.price * quantity : 0;

    const handleCheckout = async () => {
        if (!selectedProduct) {
            toast.error("Please select a product first");
            return;
        }

        if (quantity < 1 || quantity > selectedProduct.stock) {
            toast.error("Invalid quantity. Max available: " + selectedProduct.stock);
            return;
        }

        setLoading(true);
        try {
            await createSale({
                productId: selectedProduct.id,
                quantity,
                paymentMethod,
                customerName: customerName || undefined
            });
            toast.success("Sale completed successfully!");
            // Reset form
            setSelectedProductId("");
            setQuantity(1);
            setCustomerName("");
        } catch (error: any) {
            toast.error(error.message || "Failed to process sale");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 w-full h-full">
            {/* Left side: Product List */}
            <Card className="flex flex-col h-[500px] md:h-[calc(100vh-140px)]">
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0 px-6">
                    <ScrollArea className="h-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
                            {filteredProducts.map((product) => (
                                <div 
                                    key={product.id}
                                    onClick={() => {
                                        setSelectedProductId(product.id);
                                        setQuantity(1); // Reset quantity when changing product
                                    }}
                                    className={`p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors ${selectedProductId === product.id ? 'border-primary bg-primary/5' : ''}`}
                                >
                                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-medium">${product.price.toFixed(2)}</span>
                                        <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-1 sm:col-span-2 text-center py-10 text-muted-foreground">
                                    No products found
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Right side: Checkout Cart */}
            <Card className="flex flex-col h-[500px] md:h-[calc(100vh-140px)]">
                <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 overflow-y-auto">
                    {selectedProduct ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-muted rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                                    <p className="text-sm text-muted-foreground">${selectedProduct.price.toFixed(2)} each</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl">${totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        max={selectedProduct.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        Max available: {selectedProduct.stock}
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="payment">Payment Method</Label>
                                    <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val || "Zaad")}>
                                        <SelectTrigger id="payment">
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Zaad">Zaad</SelectItem>
                                            <SelectItem value="eDahab">eDahab</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="customer">Customer Name (Optional)</Label>
                                    <Input
                                        id="customer"
                                        placeholder="Enter customer name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Select a product to start checkout
                        </div>
                    )}
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button 
                        className="w-full text-lg h-12" 
                        size="lg"
                        onClick={handleCheckout}
                        disabled={!selectedProduct || loading}
                    >
                        {loading ? "Processing..." : `Process Sale ($${totalAmount.toFixed(2)})`}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
