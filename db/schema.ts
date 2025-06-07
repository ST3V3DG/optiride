import { relations, sql } from "drizzle-orm";
import {
  boolean,
  bigint,
  date,
  decimal,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar,
  year,
  int,
} from "drizzle-orm/mysql-core";

// --- Auth Tables ---

export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    banned: boolean("banned").notNull().default(false),
    banReason: varchar("ban_reason", { length: 255 }),
    banExpires: timestamp("ban_expires", { mode: "string" }),
    nic_passport_number: varchar("nic_passport_number", { length: 255 }).unique(),
    phone: varchar("phone", { length: 255 }).unique(),
    nic_passport_picture_1: varchar("nic_passport_picture_1", { length: 255 }),
    nic_passport_picture_2: varchar("nic_passport_picture_2", { length: 255 }),
    role: mysqlEnum("role", ["user", "driver", "admin"]).default("user"),
    validated: boolean("validated").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`).$onUpdateFn(() => sql`now()`),
  }
);

export const organizations = mysqlTable(
  "organizations",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    logo: text("logo"),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { mode: "string" }).default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .default(sql`now()`)
      .$onUpdateFn(() => sql`now()`)
      .notNull(),
  }
);

export const members = mysqlTable(
  "members",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: bigint("organization_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", ["user", "driver", "admin"]).default("user"),
    joinedAt: timestamp("joined_at", { mode: "string" }).default(sql`now()`),
    leftAt: timestamp("left_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }).default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .default(sql`now()`)
      .$onUpdateFn(() => sql`now()`)
      .notNull(),
  },
  (table) => ({
    userIdx: index("member_user_id_idx").on(table.userId),
    organizationIdx: index("member_organization_id_idx").on(table.organizationId),
    uniqueUserOrg: uniqueIndex("unique_user_org_idx").on(
      table.userId,
      table.organizationId
    ),
  })
);

export const invitations = mysqlTable(
  "invitations",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    inviterId: bigint("inviter_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: bigint("organization_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", ["user", "driver", "admin"]).default("user"),
    status: mysqlEnum("status", [
      "pending",
      "accepted",
      "rejected",
      "declined",
      "canceled",
    ])
      .default("pending")
      .notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" }).default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .default(sql`now()`)
      .$onUpdateFn(() => sql`now()`)
      .notNull(),
  },
  (table) => ({
    organizationIdx: index("invitation_organization_id_idx").on(
      table.organizationId
    ),
    emailIdx: index("invitation_email_idx").on(table.email),
  })
);

export const sessions = mysqlTable("sessions", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: bigint("active_organization_id", {
    mode: "number",
    unsigned: true,
  }).references(() => organizations.id, { onDelete: "set null" }),
  impersonatedBy: varchar("impersonated_by", { length: 255 }),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`).$onUpdateFn(() => sql`now()`),
});

export const accounts = mysqlTable("accounts", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
  accountId: varchar("account_id", { length: 255 })
    .notNull(),
providerId: varchar("provider_id", { length: 255 })
    .notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    mode: "string",
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    mode: "string",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`).$onUpdateFn(() => sql`now()`),
});

export const verifications = mysqlTable("verifications", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`).$onUpdateFn(() => sql`now()`),
});

// --- Application Tables ---

export const cities = mysqlTable("cities", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`).$onUpdateFn(() => sql`now()`),
});

export const cars = mysqlTable("cars", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
  driverId: bigint("driver_id", { mode: "number", unsigned: true })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  brand: varchar("brand", { length: 255 }),
  model: varchar("model", { length: 255 }),
  year: year("year"),
  registration: varchar("registration", { length: 255 }),
  available_seats: int("available_seats"),
  comfort: mysqlEnum("comfort", ["standard", "premium", "luxury"]),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`).$onUpdateFn(() => sql`now()`),
});

export const rides = mysqlTable("rides", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement().notNull(),
  driverId: bigint("driver_id", { mode: "number", unsigned: true })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  carId: bigint("car_id", { mode: "number", unsigned: true })
    .references(() => cars.id)
    .notNull(),
  place_of_departure: bigint("place_of_departure", {
    mode: "number",
    unsigned: true,
  })
    .references(() => cities.id)
    .notNull(),
  place_of_arrival: bigint("place_of_arrival", {
    mode: "number",
    unsigned: true,
  })
    .references(() => cities.id)
    .notNull(),
  collection_point: varchar("collection_point", { length: 255 }),
  drop_off_point: varchar("drop_off_point", { length: 255 }),
  hour_of_departure: time("hour_of_departure"),
  hour_of_arrival: time("hour_of_arrival"),
  date: date("date"),
  duration: bigint("duration", { mode: "number", unsigned: true }),
  price: decimal("price", { precision: 10, scale: 2 }),
  available_seats: bigint("available_seats", {
    mode: "number",
    unsigned: true,
  }),
  description: text("description"),
  status: mysqlEnum("status", ["opened", "completed", "canceled", "full"]),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().default(sql`now()`).$onUpdateFn(() => sql`now()`),
});

// --- Relations ---

export const userRelations = relations(users, ({ many }) => ({
  memberships: many(members),
  created_rides: many(rides, { relationName: "driver_rides" }),
  cars: many(cars),
  sessions: many(sessions),
  accounts: many(accounts),
  sent_invitations: many(invitations, { relationName: "inviter" }),
}));

export const organizationRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  invitations: many(invitations),
}));

export const memberRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
}));

export const invitationRelations = relations(invitations, ({ one }) => ({
  inviter: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
    relationName: "inviter",
  }),
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  activeOrganization: one(organizations, {
    fields: [sessions.activeOrganizationId],
    references: [organizations.id],
  }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const ridesRelations = relations(rides, ({ one }) => ({
  driver: one(users, {
    fields: [rides.driverId],
    references: [users.id],
    relationName: "driver_rides",
  }),
  departureCity: one(cities, {
    fields: [rides.place_of_departure],
    references: [cities.id],
    relationName: "departure_city",
  }),
  arrivalCity: one(cities, {
    fields: [rides.place_of_arrival],
    references: [cities.id],
    relationName: "arrival_city",
  }),
  car: one(cars, {
    fields: [rides.carId],
    references: [cars.id],
  }),
}));

export const citiesRelations = relations(cities, ({ many }) => ({
  departureRides: many(rides, { relationName: "departure_city" }),
  arrivalRides: many(rides, { relationName: "arrival_city" }),
}));

export const carsRelations = relations(cars, ({ one, many }) => ({
  driver: one(users, {
    fields: [cars.driverId],
    references: [users.id],
  }),
  rides: many(rides),
}));

// --- Type Exports ---

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;

export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;

export type Car = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;

export type Ride = typeof rides.$inferSelect;
export type NewRide = typeof rides.$inferInsert;

// --- Schema Export ---

export const schema = {
  // Auth tables
  users,
  organizations,
  members,
  invitations,
  sessions,
  accounts,
  verifications,

  // Application tables
  cities,
  cars,
  rides,
};
