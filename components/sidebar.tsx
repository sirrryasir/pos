"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Store, Box, Wallet, LogOut, Package2, X, Users, ReceiptText } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutGrid },
    { href: "/pos", label: "Point of Sale", icon: Store },
    { href: "/sales", label: "Sales History", icon: ReceiptText },
    { href: "/inventory", label: "Inventory", icon: Box },
    { href: "/expenses", label: "Expenses", icon: Wallet },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();

    if (pathname === "/login") return null;

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    };

    const isAdmin = (session?.user as any)?.role === "admin";

    return (
        <aside className="w-full h-full border-r border-border/50 bg-sidebar flex flex-col shadow-2xl">
            <div className="p-5 border-b border-border/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                        <Package2 className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-foreground leading-tight tracking-tight">POS</h1>
                        <p className="text-[11px] text-muted-foreground font-medium">Business Engine</p>
                    </div>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                <div className="text-[11px] font-semibold text-muted-foreground mb-3 uppercase tracking-wider px-2">Main Menu</div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                                isActive 
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                            }`}
                        >
                            <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                            {item.label}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <>
                        <div className="text-[11px] font-semibold text-muted-foreground mb-3 mt-6 uppercase tracking-wider px-2">Management</div>
                        <Link 
                            href="/reports"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                                pathname === "/reports" 
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                            }`}
                        >
                            <LayoutGrid className="h-4 w-4" strokeWidth={pathname === "/reports" ? 2 : 1.5} />
                            Reports
                        </Link>
                        <Link 
                            href="/users"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                                pathname === "/users" 
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                            }`}
                        >
                            <Users className="h-4 w-4" strokeWidth={pathname === "/users" ? 2 : 1.5} />
                            Users
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-border/50 bg-background/30">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-destructive/90 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all border border-transparent hover:border-destructive/20 font-medium"
                >
                    <LogOut strokeWidth={1.5} className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
