import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { ac, allRoles } from "@/lib/permissions"

export const authClient = createAuthClient({
    baseURL: process.env.BASE_URL,
    plugins: [organizationClient({ ac, roles: allRoles })],
})