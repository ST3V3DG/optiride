import { relations } from "drizzle-orm";
import {
  boolean,
  bigint,
  char,
  date,
  decimal,
  index,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// --- Auth Tables ---

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),

  cni_passport_number: varchar("cni_passport_number", { length: 255 }).unique(),
  phone: varchar("phone", { length: 255 }).unique(),
  cni_passport_picture_1: varchar("cni_passport_picture_1", { length: 255 }),
  cni_passport_picture_2: varchar("cni_passport_picture_2", { length: 255 }),
  role: mysqlEnum("role", ["user", "driver", "admin"]).default("user"),
  validated: boolean("validated").notNull().default(false),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const organizations = mysqlTable("organizations", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const members = mysqlTable(
  "members",
  {
    id: serial("id").primaryKey().notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: bigint("organization_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", ["user", "driver", "admin"]).default("user"),
    teamId: bigint("team_id", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("member_user_id_idx").on(table.userId),
    organizationIdx: index("member_organization_id_idx").on(table.organizationId),
    teamIdx: index("member_teamId_idx").on(table.teamId),
    uniqueUserOrg: uniqueIndex("unique_user_org_idx").on(table.userId, table.organizationId),
  })
);

export const invitations = mysqlTable(
  "invitations",
  {
    id: serial("id").primaryKey().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    inviterId: bigint("inviter_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: bigint("organization_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", ["user", "driver", "admin"]).default("user"),
    teamId: bigint("team_id", { mode: "number", unsigned: true }),
    status: mysqlEnum("status", ["pending", "accepted", "rejected", "canceled"])
      .default("pending")
      .notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => ({
    organizationIdx: index("invitation_organization_id_idx").on(table.organizationId),
    emailIdx: index("invitation_email_idx").on(table.email),
  })
);

export const sessions = mysqlTable("sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: bigint("active_organization_id", { mode: "number", unsigned: true })
    .references(() => organizations.id, { onDelete: "set null" }),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = mysqlTable("accounts", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const verifications = mysqlTable("verifications", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// --- Application Tables ---

export const rides = mysqlTable("rides", {
  id: serial("id").primaryKey(),
  driverId: bigint("driver_id", { mode: "number", unsigned: true })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  carId: bigint("car_id", { mode: "number", unsigned: true })
    .references(() => cars.id)
    .notNull(),
  place_of_departure: bigint("place_of_departure", { mode: "number", unsigned: true })
    .references(() => cities.id)
    .notNull(),
  place_of_arrival: bigint("place_of_arrival", { mode: "number", unsigned: true })
    .references(() => cities.id)
    .notNull(),
  collection_point: varchar("collection_point", { length: 255 }),
  drop_off_point: varchar("drop_off_point", { length: 255 }),
  hour_of_departure: time("hour_of_departure"),
  hour_of_arrival: time("hour_of_arrival"),
  date: date("date"),
  duration: bigint("duration", { mode: "number", unsigned: true }),
  price: decimal("price", { precision: 10, scale: 2 }),
  number_of_seats: bigint("number_of_seats", { mode: "number", unsigned: true }),
  description: text("description"),
  status: mysqlEnum("status", ["opened", "completed", "canceled", "full"]),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const cities = mysqlTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const cars = mysqlTable("cars", {
  id: serial("id").primaryKey(),
  driverId: bigint("driver_id", { mode: "number", unsigned: true })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  brand: varchar("brand", { length: 255 }),
  model: varchar("model", { length: 255 }),
  year: char("year", { length: 4 }),
  registration: varchar("registration", { length: 255 }),
  number_of_seats: bigint("number_of_seats", { mode: "number", unsigned: true }),
  comfort: mysqlEnum("comfort", ["standard", "premium", "luxury"]),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// --- Type Exports ---

// Auth types
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

// Application types
export type Ride = typeof rides.$inferSelect;
export type NewRide = typeof rides.$inferInsert;
export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;
export type Car = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;

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
  rides,
  cities,
  cars,
};