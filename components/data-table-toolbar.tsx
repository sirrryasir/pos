"use client";

import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableToolbarProps {
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    showFilter?: boolean;
    showExport?: boolean;
}

export function DataTableToolbar({
    searchPlaceholder = "Filter...",
    onSearch,
    showFilter = true,
    showExport = false
}: DataTableToolbarProps) {
    return (
        <div className="flex items-center justify-between p-4 border-b border-border/30 bg-card">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative w-[150px] sm:w-[250px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <Input
                        placeholder={searchPlaceholder}
                        className="pl-8 h-9 text-[13px] bg-background border-border/50"
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {showFilter && (
                    <Button variant="outline" size="sm" className="h-9 px-3 border-border/50 text-[13px] hover:bg-muted/50 text-foreground font-medium">
                        <Filter className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                        Filter
                    </Button>
                )}
                {showExport && (
                    <Button variant="outline" size="sm" className="h-9 px-3 border-border/50 text-[13px] hover:bg-muted/50 text-foreground font-medium">
                        <Download className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                        Export
                    </Button>
                )}
            </div>
        </div>
    );
}
