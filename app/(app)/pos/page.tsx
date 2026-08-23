import { getProducts } from "@/actions/products";
import { PosCheckout } from "./pos-checkout";

export default async function PosPage() {
    const products = await getProducts();
    
    // Filter out products with 0 stock to prevent them from being sold
    const availableProducts = products.filter(p => p.stock > 0);

    return (
        <div className="container mx-auto py-6 md:h-[calc(100vh-4rem)] flex flex-col">
            <h1 className="text-xl font-bold mb-4">Point of Sale</h1>
            <div className="flex-1 flex md:overflow-hidden">
                <PosCheckout products={availableProducts} />
            </div>
        </div>
    );
}
