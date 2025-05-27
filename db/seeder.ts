import { seed } from "drizzle-seed";
import { boolean, mysqlEnum, mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";
// import { users } from "./schema";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    profile_picture: varchar("profile_picture", { length: 255 }),
    cni_passport_number: varchar("cni_passport_number", { length: 255 }),
    name: varchar("name", { length: 255 }),
    password: varchar("password", { length: 255 }),
    phone: varchar("phone", { length: 255 }),
    email: varchar("email", { length: 255 }),
    cni_passport_picture_1: varchar("cni_passport_picture_1", { length: 255 }),
    cni_passport_picture_2: varchar("cni_passport_picture_2", { length: 255 }),
    role: mysqlEnum("role", ["driver", "client", "admin"]),
    validated: boolean("validated").notNull().default(false),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});

async function main() {
  const db = drizzle({ client: connection });
  await seed(db, { users });
}

main();