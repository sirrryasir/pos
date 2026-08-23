import { getProducts } from "@/actions/products";
import { PosCheckout } from "./pos-checkout";

export default async function PosPage() {
    const products = await getProducts();
    
    // Filter out products with 0 stock to prevent them from being sold
    const availableProducts = products.filter(p => p.stock > 0);

    return (
        <div className="container mx-auto py-10 h-screen flex flex-col">
            <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>
            <div className="flex-1 flex overflow-hidden">
                <PosCheckout products={availableProducts} />
            </div>
        </div>
    );
}
