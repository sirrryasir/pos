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
import { MoreHorizontal, Plus, Pen, Trash2 } from "lucide-react";
import { UserDialog } from "./user-dialog";
import { deleteUser } from "@/actions/users";

type PopulatedUser = any;

export function UsersTable({ initialUsers, currentUserId }: { initialUsers: PopulatedUser[], currentUserId: string }) {
    const [users, setUsers] = useState(initialUsers);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<PopulatedUser | null>(null);
    
    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const updated = await updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success("User role updated");
        } catch (error: any) {
            toast.error(error.message || "Failed to update role");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            toast.success("User deleted successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user");
        }
    };

    const openEditDialog = (user: PopulatedUser) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const openAddDialog = () => {
        setSelectedUser(null);
        setDialogOpen(true);
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
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEditDialog(u)}>
                        <Pen className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                        onClick={() => handleDelete(u.id)}
                        disabled={u.id === currentUserId}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <UserDialog 
                open={dialogOpen} 
                onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                        // In a real app we'd fetch users again or rely on router.refresh() 
                        // But since we use server actions with revalidatePath, the page might reload, 
                        // or we could force a refresh. For now we rely on revalidatePath doing its job 
                        // when the user navigates, or we can just window.location.reload() for quick sync.
                        // Ideally we'd use useTransition + router.refresh.
                        window.location.reload();
                    }
                }} 
                user={selectedUser} 
            />
            <DataTable 
                data={users} 
                columns={columns}
                searchKey={(u) => u.name ?? ""}
                searchPlaceholder="Search users by name..."
                showExport={true}
                emptyMessage="No users found."
                toolbarActions={
                    <Button onClick={openAddDialog} className="bg-green-600 hover:bg-green-700 text-white h-9 px-3 text-[13px] gap-2">
                        <Plus className="h-4 w-4" />
                        Add New
                    </Button>
                }
            />
        </>
    );
}
