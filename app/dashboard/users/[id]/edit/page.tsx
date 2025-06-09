import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React from "react";
import UsersEdit from "@/components/users-edit";
import { db } from "@/db/db";
import { User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";

export const dynamicParams = false;

export async function generateStaticParams() {
  const rows = await db.select({ id: users.id }).from(users);
  return rows.map((row) => ({
    id: String(row.id),
  }));
}

async function getUser(id: string): Promise<User | undefined> {
  try {
    // Destructure to get all columns from 'users' table schema
    // const allUserColumns = getTableColumns(users);

    // Create a new object for select, omitting the password field
    // const { password, ...safeUserColumns } = allUserColumns;

    const userResult = await db
      .select() // Select only the columns without password
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1);

    if (userResult.length > 0) {
      return userResult[0] as User; // Cast to User
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching user:", error);
    return undefined;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  // Check permission to update users
  // const canUpdateUsers = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { userResource: ["update"] } } });
  // if (!canUpdateUsers?.success) {
  //   redirect('/dashboard'); // Or an access denied page
  // }

  const userProps: NavUserProps = {
    id: session?.user?.id || null,
    name: session?.user?.name || null,
    email: session?.user?.email || null,
    image: session?.user?.image || null,
  };

  return (
    <SidebarProvider>
      <AppSidebar user={userProps} />
      <SidebarInset>
        <PageHeader
          title="Edit User"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Users", href: "/dashboard/users" },
            { label: "Edit User", href: `/dashboard/users/${id}/edit` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <UsersEdit user={user} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
