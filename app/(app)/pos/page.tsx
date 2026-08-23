import { getProducts } from "@/actions/products";
import { PosCheckout } from "./pos-checkout";

export default async function PosPage() {
    const products = await getProducts();
    
    // Filter out products with 0 stock to prevent them from being sold
    const availableProducts = products.filter(p => p.stock > 0);

    return (
        <div className="md:h-[calc(100vh-10rem)] flex flex-col space-y-6">
            <div className="mb-6 pb-5 border-b border-border/50">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Point of Sale</h1>
            </div>
            <div className="flex-1 flex md:overflow-hidden">
                <PosCheckout products={availableProducts} />
            </div>
        </div>
    );
}
