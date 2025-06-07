import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { db } from "@/db/db";
import { users, type User } from "@/db/schema";
import React from "react";
import ProfileCard from "@/components/profile-card";
import { eq } from "drizzle-orm";
import NoData from "@/components/no-data";
import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";

async function getUser(id: string): Promise<User | null> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)));
    return user[0] as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
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
          title="User profile"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Users", href: "/dashboard/users" },
            { label: "User profile", href: `/dashboard/users/${id}` },
          ]}
          actions={<ThemeToggle />}
        />
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
          {user ? <ProfileCard user={user} /> : <NoData />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
