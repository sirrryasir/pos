"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Store, Box, Wallet, LogOut, Package2, X, Users, ReceiptText, ChevronsUpDown, UserCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutGrid },
    { href: "/pos", label: "Point of Sale", icon: Store },
    { href: "/sales", label: "Sales History", icon: ReceiptText },
    { href: "/inventory", label: "Inventory", icon: Box },
    { href: "/expenses", label: "Expenses", icon: Wallet },
];

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <aside className="w-full h-full border-r border-border/10 bg-background flex flex-col">
            <div className="p-5 border-b border-border/10 flex items-center justify-between gap-3">
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
            
            <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
                <div className="text-[10px] font-semibold text-muted-foreground/70 mb-3 uppercase tracking-wider px-2">Main Menu</div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                                isActive 
                                    ? "bg-muted/80 text-foreground font-medium" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal"
                            }`}
                        >
                            <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground/70"}`} strokeWidth={isActive ? 2 : 1.5} />
                            {item.label}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <>
                        <div className="text-[10px] font-semibold text-muted-foreground/70 mb-3 mt-6 uppercase tracking-wider px-2">Management</div>
                        <Link 
                            href="/reports"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                                pathname === "/reports" 
                                    ? "bg-muted/80 text-foreground font-medium" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal"
                            }`}
                        >
                            <LayoutGrid className={`h-4 w-4 ${pathname === "/reports" ? "text-primary" : "text-muted-foreground/70"}`} strokeWidth={pathname === "/reports" ? 2 : 1.5} />
                            Reports
                        </Link>
                        <Link 
                            href="/users"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                                pathname === "/users" 
                                    ? "bg-muted/80 text-foreground font-medium" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal"
                            }`}
                        >
                            <Users className={`h-4 w-4 ${pathname === "/users" ? "text-primary" : "text-muted-foreground/70"}`} strokeWidth={pathname === "/users" ? 2 : 1.5} />
                            Users
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-3 border-t border-border/10 mt-auto">
                {session?.user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex w-full items-center gap-2 p-2 hover:bg-muted/80 rounded-lg transition-all border border-transparent hover:border-border/50 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                <div className="h-8 w-8 flex-shrink-0 bg-primary/10 text-primary font-semibold flex items-center justify-center rounded-md border border-primary/20">
                                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <span className="text-[13px] font-semibold text-foreground truncate">{session.user.name}</span>
                                    <span className="text-[11px] text-muted-foreground truncate leading-none">{session.user.email}</span>
                                </div>
                                <ChevronsUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[calc(100%-1rem)] min-w-56" align="center" side="top" sideOffset={8}>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none text-foreground">{session.user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground mt-1">{session.user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => {}}>
                                <UserCircle className="h-4 w-4" />
                                <span>Account</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </aside>
    );
}
