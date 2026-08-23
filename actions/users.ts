"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper to check if current user is admin
async function checkIsAdmin() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    // In our schema, role is stored in user.role
    // Note: better-auth types might not have 'role' unless configured perfectly, 
    // but at runtime it should be there because we added it to additionalFields.
    // Alternatively, we query Prisma directly to be safe.
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (user?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    return true;
}

export async function getAllUsers() {
    await checkIsAdmin();
    
    return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
                select: { sales: true }
            }
        }
    });
}

export async function createUser(data: { name: string; email: string; password: string; role: string }) {
    await checkIsAdmin();

    if (data.role !== "admin" && data.role !== "user") {
        throw new Error("Invalid role");
    }

    try {
        const res = await auth.api.signUpEmail({
            body: {
                email: data.email,
                password: data.password,
                name: data.name
            }
        });

        if (!res?.user) {
            throw new Error("Failed to create user");
        }

        // Update role if it's admin (default is user)
        if (data.role === "admin") {
            await prisma.user.update({
                where: { id: res.user.id },
                data: { role: "admin" }
            });
        }

        revalidatePath("/users");
        return res.user;
    } catch (error: any) {
        console.error("Error creating user:", error);
        throw new Error(error.message || "Failed to create user");
    }
}

export async function updateUser(userId: string, data: { name?: string; email?: string; role?: string; password?: string }) {
    await checkIsAdmin();

    if (data.role && data.role !== "admin" && data.role !== "user") {
        throw new Error("Invalid role");
    }

    // Prevent self-demotion to avoid locking out the only admin
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id === userId && data.role === "user") {
        throw new Error("You cannot demote yourself");
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    
    // In a real app we'd hash the password and update it using Better Auth's auth.api or custom hashing
    // Since Better Auth handles passwords, updating password directly in Prisma might bypass Better Auth's hashing.
    // For now we'll just update name, email, role.

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData
    });

    revalidatePath("/users");
    return updatedUser;
}

export async function deleteUser(userId: string) {
    await checkIsAdmin();
    
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id === userId) {
        throw new Error("You cannot delete yourself");
    }

    await prisma.user.delete({
        where: { id: userId }
    });

    revalidatePath("/users");
    return true;
}
