"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Store, Box, Wallet, LogOut, Package2, X, Users, ReceiptText, ChevronsUpDown, UserCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutGrid },
    { href: "/pos", label: "Point of Sale", icon: Store },
    { href: "/sales", label: "Sales History", icon: ReceiptText },
    { href: "/inventory", label: "Inventory", icon: Box },
    { href: "/expenses", label: "Expenses", icon: Wallet },
];

function NavLink({ href, label, icon: Icon, pathname, onClose, isCollapsed }: any) {
    const isActive = pathname === href;
    const link = (
        <Link 
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                isCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
                isActive 
                    ? "bg-muted/80 text-foreground font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal"
            }`}
        >
            <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground/70"}`} strokeWidth={isActive ? 2 : 1.5} />
            {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
        </Link>
    );

    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger>
                    {link}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium text-xs">
                    {label}
                </TooltipContent>
            </Tooltip>
        );
    }

    return link;
}

export function Sidebar({ onClose, isCollapsed, onToggleCollapse }: { onClose?: () => void; isCollapsed?: boolean; onToggleCollapse?: () => void; }) {
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
        <aside className="w-full h-full border-r border-border/10 bg-background flex flex-col transition-all duration-300">
            <div className={`p-4 border-b border-border/10 flex items-center justify-between gap-3 h-16 ${isCollapsed ? 'flex-col justify-center gap-2 p-2' : ''}`}>
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                    <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30 flex-shrink-0">
                        <Package2 className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden transition-all duration-300 whitespace-nowrap">
                            <h1 className="text-sm font-bold text-foreground leading-tight tracking-tight">POS</h1>
                            <p className="text-[11px] text-muted-foreground font-medium">Business Engine</p>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center">
                    {!isCollapsed && onClose && (
                        <button 
                            onClick={onClose}
                            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground flex-shrink-0"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                    {onToggleCollapse && (
                        <button
                            onClick={onToggleCollapse}
                            className={`hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground flex-shrink-0 transition-all`}
                        >
                            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        </button>
                    )}
                </div>
            </div>
            
            <nav className={`flex-1 py-5 space-y-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-3'}`}>
                {!isCollapsed && (
                    <div className="text-[10px] font-semibold text-muted-foreground/70 mb-3 uppercase tracking-wider px-2 whitespace-nowrap">Main Menu</div>
                )}
                {isCollapsed && (
                    <div className="h-[20px] mb-3 border-b border-border/10 w-8 mx-auto" />
                )}
                
                {navItems.map((item) => (
                    <NavLink key={item.href} {...item} pathname={pathname} onClose={onClose} isCollapsed={isCollapsed} />
                ))}

                {isAdmin && (
                    <>
                        {!isCollapsed ? (
                            <div className="text-[10px] font-semibold text-muted-foreground/70 mb-3 mt-6 uppercase tracking-wider px-2 whitespace-nowrap">Management</div>
                        ) : (
                            <div className="h-[20px] mb-3 mt-6 border-b border-border/10 w-8 mx-auto" />
                        )}
                        <NavLink href="/reports" label="Reports" icon={LayoutGrid} pathname={pathname} onClose={onClose} isCollapsed={isCollapsed} />
                        <NavLink href="/users" label="Users" icon={Users} pathname={pathname} onClose={onClose} isCollapsed={isCollapsed} />
                    </>
                )}
            </nav>

            <div className={`p-3 border-t border-border/10 mt-auto flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
                {/* User Profile */}
                {session?.user && (
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger>
                                <DropdownMenuTrigger asChild>
                                    <button className={`flex w-full items-center gap-2 p-2 hover:bg-muted/80 rounded-lg transition-all border border-transparent hover:border-border/50 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary ${isCollapsed ? 'justify-center px-0' : ''}`}>
                                        <div className="h-8 w-8 flex-shrink-0 bg-primary/10 text-primary font-semibold flex items-center justify-center rounded-md border border-primary/20">
                                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        {!isCollapsed && (
                                            <>
                                                <div className="flex flex-col flex-1 overflow-hidden">
                                                    <span className="text-[13px] font-semibold text-foreground truncate">{session.user.name}</span>
                                                    <span className="text-[11px] text-muted-foreground truncate leading-none">{session.user.email}</span>
                                                </div>
                                                <ChevronsUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            </>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" className="font-medium text-xs">
                                    {session.user.name}
                                </TooltipContent>
                            )}
                        </Tooltip>
                        <DropdownMenuContent className={isCollapsed ? "w-56" : "w-[calc(100%-1rem)] min-w-56"} align={isCollapsed ? "start" : "center"} side={isCollapsed ? "right" : "top"} sideOffset={8}>
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
