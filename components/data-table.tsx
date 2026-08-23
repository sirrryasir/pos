"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { DataTablePagination } from "@/components/data-table-pagination";

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    searchKey?: keyof T | ((item: T) => string);
    searchPlaceholder?: string;
    filterKey?: keyof T | ((item: T) => string);
    filterOptions?: string[];
    emptyMessage?: string;
    showExport?: boolean;
}

export function DataTable<T>({
    data,
    columns,
    searchKey,
    searchPlaceholder = "Search...",
    filterKey,
    filterOptions = [],
    emptyMessage = "No results found.",
    showExport = false,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterValue, setFilterValue] = useState("all");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Apply filtering
    let processedData = data;

    if (searchQuery && searchKey) {
        processedData = processedData.filter((item) => {
            const val = typeof searchKey === "function" ? searchKey(item) : item[searchKey];
            return String(val ?? "").toLowerCase().includes(searchQuery.toLowerCase());
        });
    }

    if (filterValue !== "all" && filterKey) {
        processedData = processedData.filter((item) => {
            const val = typeof filterKey === "function" ? filterKey(item) : item[filterKey];
            return String(val ?? "") === filterValue;
        });
    }

    const totalItems = processedData.length;
    const paginatedData = processedData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

    return (
        <div className="flex flex-col h-full">
            <DataTableToolbar 
                searchPlaceholder={searchPlaceholder}
                searchQuery={searchQuery}
                onSearch={(val) => {
                    setSearchQuery(val);
                    setPageIndex(0);
                }}
                showFilter={filterOptions.length > 0}
                filterOptions={filterOptions}
                filterValue={filterValue}
                onFilterChange={(val) => {
                    setFilterValue(val);
                    setPageIndex(0);
                }}
                showExport={showExport}
            />
            
            <div className="flex-1 overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/10">
                        <TableRow className="hover:bg-transparent border-border/30">
                            {columns.map((col, i) => (
                                <TableHead 
                                    key={i} 
                                    className={`py-3 text-[12px] font-medium text-muted-foreground ${
                                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                                    }`}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item, rowIndex) => (
                            <TableRow key={rowIndex} className="border-border/30 hover:bg-muted/10 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <TableCell 
                                        key={colIndex} 
                                        className={`text-[13px] ${
                                            col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                                        }`}
                                    >
                                        {col.cell 
                                            ? col.cell(item) 
                                            : col.accessorKey ? String(item[col.accessorKey] ?? "-") : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {paginatedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-10">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <DataTablePagination 
                totalItems={totalItems}
                pageSize={pageSize}
                pageIndex={pageIndex}
                onPageChange={setPageIndex}
                onPageSizeChange={setPageSize}
            />
        </div>
    );
}
