"use client";

import { DataTable, ColumnDef } from "@/components/data-table";
import { updateUserRole } from "@/actions/users";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type PopulatedUser = any;

export function UsersTable({ initialUsers, currentUserId }: { initialUsers: PopulatedUser[], currentUserId: string }) {
    const [users, setUsers] = useState(initialUsers);
    
    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const updated = await updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success("User role updated");
        } catch (error: any) {
            toast.error(error.message || "Failed to update role");
        }
    };

    const columns: ColumnDef<PopulatedUser>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: (u) => <span className="font-medium text-foreground">{u.name}</span>,
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Role",
            accessorKey: "role",
            cell: (u) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${u.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/50 text-secondary-foreground border-secondary/20'}`}>
                    {u.role}
                </span>
            ),
        },
        {
            header: "Joined",
            accessorKey: "createdAt",
            cell: (u) => <span className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>,
        },
        {
            header: "Sales Made",
            accessorKey: "_count",
            cell: (u) => <span className="text-muted-foreground">{u._count?.sales || 0}</span>,
        },
        {
            header: "Actions",
            accessorKey: "id",
            align: "right",
            cell: (u) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={u.id === currentUserId}>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(u.id, "admin")} disabled={u.role === "admin"}>
                            Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(u.id, "user")} disabled={u.role === "user"}>
                            Make User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <DataTable 
            data={users} 
            columns={columns}
            searchKey={(u) => u.name ?? ""}
            searchPlaceholder="Search users by name..."
            showExport={false}
            emptyMessage="No users found."
        />
    );
}
