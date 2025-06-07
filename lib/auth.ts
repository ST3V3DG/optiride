// lib/auth.ts

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";           // ← your Drizzle client instance
import { schema } from "@/db/schema";   // ← { users, accounts, sessions, verifications, … }
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/server/email";
import { organization, admin } from "better-auth/plugins";
import { ac, allRoles } from "@/lib/permissions";

export const auth = betterAuth({
  // ──────────────────────────────────────────────────────────────────────────
  // 1) DATABASE / ADAPTER
  // ──────────────────────────────────────────────────────────────────────────
  database: drizzleAdapter(db, {
    provider: "mysql",
    usePlural: true,
    schema: schema,
  }),

  // ──────────────────────────────────────────────────────────────────────────
  // 2) USER MODEL MAPPINGS
  // ──────────────────────────────────────────────────────────────────────────
  user: {
    modelName: "users",

    // Standard fields Better Auth expects on users:
    // fields: {
    //   id:             "id",             // bigint PK
    //   name:           "name",           // varchar
    //   email:          "email",          // varchar unique
    //   emailVerified:  "email_verified", // boolean
    //   image:          "image",          // text (nullable)
    //   createdAt:      "created_at",     // datetime
    //   updatedAt:      "updated_at",     // datetime
    // },

    // Any other columns in `users` go here as additionalFields:
    additionalFields: {
      banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        fieldName: "banned",
        input: false, // don’t allow user to set directly
      },
      banReason: {
        type: "string",
        required: false,
        fieldName: "ban_reason",
        input: false,
      },
      banExpires: {
        type: "date",
        required: false,
        fieldName: "ban_expires",
        input: false,
      },
      nicPassportNumber: {
        type: "string",
        required: false,
        fieldName: "nic_passport_number",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        fieldName: "phone",
        input: false,
      },
      nicPassportPicture1: {
        type: "string",
        required: false,
        fieldName: "nic_passport_picture_1",
        input: false,
      },
      nicPassportPicture2: {
        type: "string",
        required: false,
        fieldName: "nic_passport_picture_2",
        input: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        fieldName: "role",
        input: false,
      },
      validated: {
        type: "boolean",
        required: false,
        defaultValue: false,
        fieldName: "validated",
        input: false,
      },
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3) ACCOUNT MODEL MAPPINGS
  // ──────────────────────────────────────────────────────────────────────────
  // account: {
  //   modelName: "accounts",
  //   fields: {
  //     id:                     "id",                         // bigint PK
  //     userId:                 "user_id",                    // bigint → FK to users.id
  //     providerId:             "provider_id",                // varchar
  //     providerAccountId:      "account_id",                 // varchar
  //     accessToken:            "access_token",               // text (nullable)
  //     refreshToken:           "refresh_token",              // text (nullable)
  //     idToken:                "id_token",                   // text (nullable)
  //     accessTokenExpiresAt:   "access_token_expires_at",    // datetime (nullable)
  //     refreshTokenExpiresAt:  "refresh_token_expires_at",   // datetime (nullable)
  //     scope:                  "scope",                      // text (nullable)
  //     password:               "password",                   // text (nullable)
  //     createdAt:              "created_at",                 // datetime
  //     updatedAt:              "updated_at",                 // datetime
  //   },
  // },

  // ──────────────────────────────────────────────────────────────────────────
  // 4) SESSION MODEL MAPPINGS
  // ──────────────────────────────────────────────────────────────────────────
  // session: {
  //   modelName: "sessions",
  //   fields: {
  //     id:                     "id",                       // bigint PK
  //     userId:                 "user_id",                  // bigint → FK to users.id
  //     token:                  "token",                    // varchar unique (sessionToken)
  //     ipAddress:              "ip_address",               // text (nullable)
  //     userAgent:              "user_agent",               // text (nullable)
  //     activeOrganizationId:   "active_organization_id",   // bigint (nullable)
  //     impersonatedBy:         "impersonated_by",          // varchar (nullable)
  //     expiresAt:              "expires_at",               // datetime
  //     createdAt:              "created_at",               // datetime
  //     updatedAt:              "updated_at",               // datetime
  //   },
  // },

  // ──────────────────────────────────────────────────────────────────────────
  // 5) VERIFICATION MODEL MAPPINGS
  // ──────────────────────────────────────────────────────────────────────────
  // verification: {
  //   modelName: "verifications",
  //   fields: {
  //     id:         "id",             // bigint PK
  //     identifier: "identifier",     // text
  //     value:      "value",          // text (token)
  //     expiresAt:  "expires_at",     // datetime
  //     createdAt:  "created_at",     // datetime
  //     updatedAt:  "updated_at",     // datetime
  //   },
  // },

  // ──────────────────────────────────────────────────────────────────────────
  // 6) EMAIL + PASSWORD CONFIGURATION
  // ──────────────────────────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 7) EMAIL VERIFICATION HOOKS
  // ──────────────────────────────────────────────────────────────────────────
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email:\n\n ${url}`,
      });
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 8) ADVANCED OPTIONS
  // ──────────────────────────────────────────────────────────────────────────
  advanced: {
    database: {
      generateId: false,   // use MySQL AUTO_INCREMENT instead of UUID
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 9) PLUGINS
  // ──────────────────────────────────────────────────────────────────────────
  plugins: [
    nextCookies(),
    organization({ ac, roles: allRoles }),
    admin(),
  ],
});
