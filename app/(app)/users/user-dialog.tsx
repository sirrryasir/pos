"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser, updateUser } from "@/actions/users";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: any | null; // if null, it's Add New
}

export function UserDialog({ open, onOpenChange, user }: UserDialogProps) {
    const [loading, setLoading] = useState(false);
    
    // Form state matching Aduunyo's look (but using existing fields)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Update state when user prop changes (e.g., when editing)
    useEffect(() => {
        if (open) {
            setName(user?.name || "");
            setEmail(user?.email || "");
            setRole(user?.role || "user");
            setPassword("");
            setConfirmPassword("");
        }
    }, [user, open]);

    const reset = () => {
        setName(user?.name || "");
        setEmail(user?.email || "");
        setRole(user?.role || "user");
        setPassword("");
        setConfirmPassword("");
    };

    const handleSave = async () => {
        if (!name || !email) {
            toast.error("Name and Email are required");
            return;
        }

        if (!user) {
            if (!password) {
                toast.error("Password is required for new users");
                return;
            }
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
        } else if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            if (user) {
                // Update
                await updateUser(user.id, { name, email, role, ...(password && { password }) });
                toast.success("User updated successfully");
            } else {
                // Create
                await createUser({ name, email, password, role });
                toast.success("User created successfully");
            }
            onOpenChange(false);
            reset();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) reset();
            onOpenChange(val);
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit" : "Add New"}</DialogTitle>
                    <DialogDescription>
                        Fill out the form below
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={(val) => val && setRole(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="password">{user ? "New Password (optional)" : "Password"}</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {!user || password ? (
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    ) : null}

                    {/* Fake Active toggle to match Aduunyo UI */}
                    <div className="flex items-center space-x-2 mt-2">
                        <Switch id="active" defaultChecked />
                        <Label htmlFor="active">Active</Label>
                    </div>
                </div>
                <DialogFooter className="flex justify-between w-full sm:justify-between">
                    <Button variant="outline" onClick={() => { reset(); }}>
                        Reset
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
