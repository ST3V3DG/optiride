import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { db } from "@/db/db";
import { User, users } from "@/db/schema";
import UsersTable from "@/components/users-table";
// import { getTableColumns } from "drizzle-orm";
import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavUserProps } from "@/lib/types";

// Helper function to fetch users - this runs on the server
async function getUsers(): Promise<User[]> {
  try {
    // Destructure to get all columns from 'users' table schema
    // const allUserColumns = getTableColumns(users);

    // Create a new object for select, omitting the password field
    // const { password, ...safeUserColumns } = allUserColumns;

    const selectedUsers = await db
      .select() // Select only the columns without password
      .from(users);
    return selectedUsers as User[]; // Assuming selectedUsers matches User[] type structure
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Return empty array on error
  }
}

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login'); 
  }
  const canViewPage = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { userResource: ["read"] } } });
  if (!canViewPage?.granted) {
    redirect('/dashboard');
  }

  const initialUsers = await getUsers();
  
  const userProps: NavUserProps = {
    id: session?.user?.id || null, 
      name: session?.user?.name || null,
      email: session?.user?.email || null,
      image: session?.user?.image || null,
    };
  
    
  const canCreateUsers = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { userResource: ["create"] } } });

  const pageHeaderActions = (
    <div className="flex items-center gap-2">
      {canCreateUsers?.granted && (
        <Button asChild>
          <a href="/dashboard/users/create">Create User</a>
        </Button>
      )}
      <ThemeToggle />
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar user={userProps} />
      <SidebarInset>
        <PageHeader
          title="User Management" // Updated title
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Users", href: "/dashboard/users" },
          ]}
          actions={pageHeaderActions} // Pass the conditionally constructed actions
        />
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min px-2 p-4">
            <UsersTable initialUsers={initialUsers} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
