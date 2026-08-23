"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Receipt, LogOut, Package2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pos", label: "Point of Sale", icon: ShoppingCart },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/expenses", label: "Expenses", icon: Receipt },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === "/login") return null;

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <aside className="w-64 border-r border-border/50 bg-sidebar flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50">
            <div className="p-6 border-b border-border/50 flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                    <Package2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-foreground leading-tight tracking-tight">POS</h1>
                    <p className="text-xs text-muted-foreground font-medium">Business Engine</p>
                </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider px-2">Main Menu</div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
                                isActive 
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
                            }`}
                        >
                            <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50 bg-background/30">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-destructive/90 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all border border-transparent hover:border-destructive/20 font-medium"
                >
                    <LogOut className="h-5 w-5" />
                    Logout Account
                </button>
            </div>
        </aside>
    );
}
