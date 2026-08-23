"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique categories for filter
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean)),
  ) as string[];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId);
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
        customerName: customerName || undefined,
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
        <div className="flex flex-col md:flex-row gap-6 w-full h-full">
            {/* Left side: Product List */}
            <div className="flex flex-col flex-1 h-[500px] md:h-[calc(100vh-140px)] min-w-0">
                <div className="pb-4">
                    <h2 className="text-sm font-semibold mb-3">Products</h2>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-8 bg-card border-border/50 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {categories.length > 0 && (
                            <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val ?? "all")}>
                                <SelectTrigger className="w-[130px] bg-card border-border/50 shadow-sm">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-hidden pt-2">
                    <ScrollArea className="h-full pr-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-6">
                            {filteredProducts.map((product) => (
                                <div 
                                    key={product.id}
                                    onClick={() => {
                                        setSelectedProductId(product.id);
                                        setQuantity(1); // Reset quantity when changing product
                                    }}
                                    className={`p-4 bg-card rounded-xl cursor-pointer hover:bg-card/80 transition-all border ${selectedProductId === product.id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border/50'}`}
                                >
                                    <h3 className="font-medium text-[13px] line-clamp-1 text-foreground">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="font-semibold text-foreground text-[14px]">${product.price.toFixed(2)}</span>
                                        <span className="text-[11px] text-muted-foreground font-medium">Stock: {product.stock}</span>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full text-center py-10 text-muted-foreground">
                                    No products found
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Right side: Checkout Cart */}
            <div className="flex flex-col w-full md:w-[400px] lg:w-[450px] shrink-0 h-[500px] md:h-[calc(100vh-140px)]">
                <div className="pb-4">
                    <h2 className="text-sm font-semibold">Checkout</h2>
                </div>
                <div className="flex flex-col flex-1 bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        {selectedProduct ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-background/50 border border-border/50 rounded-xl flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-base text-foreground">{selectedProduct.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            ${selectedProduct.price.toFixed(2)} each
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-foreground">${totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid gap-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <span className="text-xs text-muted-foreground font-medium">
                                                Max: {selectedProduct.stock}
                                            </span>
                                        </div>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            max={selectedProduct.stock}
                                            value={quantity}
                                            className="bg-background/50 h-10"
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="payment">Payment Method</Label>
                                        <Select
                                            value={paymentMethod}
                                            onValueChange={(val) => setPaymentMethod(val || "Zaad")}
                                        >
                                            <SelectTrigger id="payment" className="bg-background/50 h-10">
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
                                        <Label htmlFor="customer">Customer Name <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                        <Input
                                            id="customer"
                                            placeholder="Enter customer name"
                                            value={customerName}
                                            className="bg-background/50 h-10"
                                            onChange={(e) => setCustomerName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
                                <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center">
                                    <Search className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                                <p className="text-sm font-medium">Select a product to start checkout</p>
                            </div>
                        )}
                    </div>
                    <div className="p-5 border-t border-border/50 bg-background/30 mt-auto">
                        <Button 
                            className="w-full text-[15px] font-semibold h-12 rounded-xl shadow-sm" 
                            size="lg"
                            onClick={handleCheckout}
                            disabled={!selectedProduct || loading}
                        >
                            {loading ? "Processing..." : `Process Sale ($${totalAmount.toFixed(2)})`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
