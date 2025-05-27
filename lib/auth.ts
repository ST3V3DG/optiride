import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/server/email";
import { openAPI, organization, admin } from "better-auth/plugins";
import { ac, allRoles } from "@/lib/permissions";
 
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    usePlural: true,
    schema: schema,
  }),
  emailAndPassword: { 
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [nextCookies(), openAPI(), organization({ ac, roles: allRoles }), admin()]
});

