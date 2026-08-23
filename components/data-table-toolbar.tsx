"use client";

import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableToolbarProps {
    searchPlaceholder?: string;
    searchQuery?: string;
    onSearch?: (value: string) => void;
    showFilter?: boolean;
    showExport?: boolean;
    filterOptions?: string[];
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    onExport?: (type: 'excel' | 'pdf') => void;
    children?: React.ReactNode;
}

export function DataTableToolbar({
    searchPlaceholder = "Filter...",
    searchQuery,
    onSearch,
    showFilter = true,
    showExport = false,
    filterOptions = [],
    filterValue = "all",
    onFilterChange,
    onExport,
    children,
}: DataTableToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-border/30 bg-card overflow-hidden">
            <div className="flex flex-1 items-center">
                <div className="relative w-full sm:w-[250px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        className="pl-8 h-9 text-[13px] bg-background border-border/50 w-full"
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {showFilter && filterOptions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 px-3 border-border/50 text-[13px] hover:bg-muted/50 text-foreground font-medium">
                                <Filter className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                                {filterValue === "all" ? "Filter" : filterValue}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={filterValue === "all"}
                                onCheckedChange={() => onFilterChange?.("all")}
                                className="text-[12px]"
                            >
                                All
                            </DropdownMenuCheckboxItem>
                            {filterOptions.map((option) => (
                                <DropdownMenuCheckboxItem
                                    key={option}
                                    checked={filterValue === option}
                                    onCheckedChange={() => onFilterChange?.(option)}
                                    className="text-[12px]"
                                >
                                    {option}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                {showExport && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 px-3 border-border/50 text-[13px] hover:bg-muted/50 text-foreground font-medium">
                                <Download className="mr-2 h-3.5 w-3.5" strokeWidth={1.5} />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Export As</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem 
                                className="text-[12px] cursor-pointer"
                                onClick={() => onExport?.('excel')}
                            >
                                Excel (CSV)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem 
                                className="text-[12px] cursor-pointer"
                                onClick={() => onExport?.('pdf')}
                            >
                                PDF Document
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                {children}
            </div>
        </div>
    );
}
