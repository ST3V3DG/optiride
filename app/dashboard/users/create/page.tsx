import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import React from "react";
import UsersCreate from "@/components/users-create";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavUserProps } from "@/lib/types";
<<<<<<< HEAD
import { PageHeader } from "@/components/page-header";
=======
>>>>>>> fix-build-errors

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
<<<<<<< HEAD
  
=======

>>>>>>> fix-build-errors
  // Check permission to create users
  // const canCreateUsers = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { userResource: ["create"] } } });
  // if (!canCreateUsers?.success) {
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
           title={`Edit user`}
           breadcrumbs={[
             { label: "Dashboard", href: "/dashboard" },
             { label: "users", href: "/dashboard/users" },
             { label: "Edit", href: `/dashboard/users/create` },
           ]}
           actions={<ThemeToggle />}
         />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <UsersCreate />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
}
