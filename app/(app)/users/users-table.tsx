"use client";

import { DataTable, ColumnDef } from "@/components/data-table";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Pen, Trash2 } from "lucide-react";
import { UserDialog } from "./user-dialog";
import { deleteUser } from "@/actions/users";

type PopulatedUser = any;

export function UsersTable({ initialUsers, currentUserId }: { initialUsers: PopulatedUser[], currentUserId: string }) {
    const [users, setUsers] = useState(initialUsers);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<PopulatedUser | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = (userId: string) => {
        setUserToDelete(userId);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await deleteUser(userToDelete);
            setUsers(users.filter(u => u.id !== userToDelete));
            toast.success("User deleted successfully");
            setDeleteConfirmOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user");
        } finally {
            setIsDeleting(false);
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
                        onClick={() => confirmDelete(u.id)}
                        disabled={u.id === currentUserId}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
            <UserDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                user={selectedUser} 
                onSuccess={() => window.location.reload()}
            />
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DataTable 
                data={users} 
                columns={columns}
                searchKey={(u) => u.name ?? ""}
                searchPlaceholder="Search users by name..."
                showExport={true}
                emptyMessage="No users found."
                toolbarActions={
                    <Button onClick={openAddDialog} className="h-9 px-3 text-[13px] gap-2">
                        <Plus className="h-4 w-4" />
                        Add New
                    </Button>
                }
            />
        </div>
    );
}
