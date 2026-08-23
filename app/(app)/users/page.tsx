import { getAllUsers } from "@/actions/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "./users-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const users = await getAllUsers();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6 pb-5 border-b border-border/50">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Users</h1>
      </div>

      <UsersTable initialUsers={users} currentUserId={session.user.id} />
    </div>
  );
}
