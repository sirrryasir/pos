"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "w-[70px]" : "w-64"}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out ${isCollapsed ? "md:pl-[70px]" : "md:pl-64"}`}>
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          
          <div className="w-full flex items-center justify-between md:justify-end">
            <div className="flex items-center gap-2 md:hidden">
              <Package2 className="h-5 w-5 text-primary" />
              <span className="font-bold tracking-tight">POS</span>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="h-full p-4 md:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
