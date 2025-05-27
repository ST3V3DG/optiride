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

// --- Auth Tables (from auth-schema.ts, with user table merged) ---

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
  role: mysqlEnum("role", ["driver", "client", "admin"]).default("client"),
  validated: boolean("validated").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const organization = mysqlTable("organization", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  metadata: text("metadata"), // For any extra JSON data
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const member = mysqlTable(
  "member",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Foreign key to your users table
    organizationId: varchar("organizationId", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 255 }).notNull(), // e.g., 'admin', 'driver', 'user'
    teamId: varchar("teamId", { length: 255 }), // Optional: if you use the teams feature
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdx: index("member_userId_idx").on(table.userId),
      organizationIdx: index("member_organizationId_idx").on(
        table.organizationId
      ),
      teamIdx: index("member_teamId_idx").on(table.teamId), // Optional
      uniqueUserOrg: uniqueIndex("unique_user_org_idx").on(
        table.userId,
        table.organizationId
      ), // Ensures a user has only one role per org
    };
  }
);

export const invitation = mysqlTable(
  "invitation",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    inviterId: varchar("inviterId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Foreign key to your users table
    organizationId: varchar("organizationId", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 255 }).notNull(),
    teamId: varchar("teamId", { length: 255 }), // Optional: if you use the teams feature
    status: varchar("status", { length: 50 }).default("pending").notNull(), // e.g., 'pending', 'accepted', 'rejected', 'canceled'
    expiresAt: timestamp("expiresAt", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => {
    return {
      organizationIdx: index("invitation_organizationId_idx").on(
        table.organizationId
      ),
      emailIdx: index("invitation_email_idx").on(table.email),
    };
  }
);

export const sessions = mysqlTable("sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: varchar("activeOrganizationId", {
    length: 255,
  }).references(() => organization.id, { onDelete: "set null" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = mysqlTable("verifications", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Application-Specific Tables (from old schema.ts, with FKs updated) ---

export const rides = mysqlTable("rides", {
  id: serial("id").primaryKey(),
  driverId: bigint("driver_id", { mode: "number", unsigned: true })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  carId: bigint({ mode: "number", unsigned: true })
    .references(() => cars.id)
    .notNull(),
  place_of_departure: bigint({ mode: "number", unsigned: true })
    .references(() => cities.id)
    .notNull(),
  place_of_arrival: bigint({ mode: "number", unsigned: true })
    .references(() => cities.id)
    .notNull(),
  collection_point: varchar("collection_point", { length: 255 }),
  drop_off_point: varchar("drop_off_point", { length: 255 }),
  hour_of_departure: time("hour_of_departure"),
  hour_of_arrival: time("hour_of_arrival"),
  date: date("date"),
  duration: bigint({ mode: "number", unsigned: true }),
  price: decimal("price", { precision: 10, scale: 2 }),
  number_of_seats: bigint({ mode: "number", unsigned: true }),
  description: text("description"),
  status: mysqlEnum("status", ["opened", "completed", "canceled", "full"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cities = mysqlTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  number_of_seats: bigint({ mode: "number", unsigned: true }),
  comfort: mysqlEnum("comfort", ["standard", "premium", "luxury"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Type Exports ---

// Auth types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
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
  created_rides: many(rides, { relationName: "created_rides" }),
  related_cars: many(cars, { relationName: "related_cars" }),

  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
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
  }),
  place_of_departure: one(cities, {
    fields: [rides.place_of_departure],
    references: [cities.id],
  }),
  place_of_arrival: one(cities, {
    fields: [rides.place_of_arrival],
    references: [cities.id],
  }),
  car: one(cars, {
    fields: [rides.carId],
    references: [cars.id],
  }),
}));

export const citiesRelations = relations(cities, ({ many }) => ({
  departure_rides: many(rides, { relationName: "departure_city_rides" }),
  arrival_rides: many(rides, { relationName: "arrival_city_rides" }),
}));

export const carsRelations = relations(cars, ({ one, many }) => ({
  driver: one(users, {
    fields: [cars.driverId],
    references: [users.id],
  }),
  rides: many(rides, { relationName: "rides" }),
}));

export const schema = { users, sessions, accounts, verifications };
