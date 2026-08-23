"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  pageSize?: number;
  totalItems?: number;
  pageIndex?: number;
}

export function DataTablePagination({
  pageSize = 10,
  totalItems = 685,
  pageIndex = 0,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 bg-card">
      <div className="flex items-center space-x-2">
        <Select
          value={`${pageSize}`}
          onValueChange={() => {}}
        >
          <SelectTrigger className="h-8 w-[70px] text-[12px] bg-background border-border/50">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`} className="text-[12px]">
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[12px] text-muted-foreground font-medium">Rows per page</p>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-[12px] font-medium text-foreground">
          Page {pageIndex + 1} of {Math.ceil(totalItems / pageSize)} ({totalItems})
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex border-border/50 hover:bg-muted/50 text-muted-foreground"
            disabled
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-border/50 hover:bg-muted/50 text-muted-foreground"
            disabled
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <div className="flex items-center gap-1 mx-2">
            <Button variant="default" className="h-8 w-8 p-0 text-[12px] font-medium bg-primary text-primary-foreground hover:bg-primary/90">
              1
            </Button>
            <Button variant="ghost" className="h-8 w-8 p-0 text-[12px] font-medium text-muted-foreground hover:text-foreground">
              2
            </Button>
            <Button variant="ghost" className="h-8 w-8 p-0 text-[12px] font-medium text-muted-foreground hover:text-foreground">
              3
            </Button>
            <span className="text-muted-foreground mx-1 text-xs">...</span>
            <Button variant="ghost" className="h-8 w-8 p-0 text-[12px] font-medium text-muted-foreground hover:text-foreground">
              {Math.ceil(totalItems / pageSize)}
            </Button>
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-border/50 hover:bg-muted/50 text-muted-foreground"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex border-border/50 hover:bg-muted/50 text-muted-foreground"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}
