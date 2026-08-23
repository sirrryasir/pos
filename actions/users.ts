"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

export async function updateUserRole(userId: string, newRole: string) {
    await checkIsAdmin();

    if (newRole !== "admin" && newRole !== "user") {
        throw new Error("Invalid role");
    }

    // Prevent self-demotion to avoid locking out the only admin
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id === userId && newRole === "user") {
        throw new Error("You cannot demote yourself");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    });

    revalidatePath("/users");
    return updatedUser;
}
