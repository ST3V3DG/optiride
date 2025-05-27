// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";
// import * as schema from "./schema";

// // This check ensures this code only runs on the server
// if (typeof window !== 'undefined') {
//   throw new Error(
//     'db.server.ts should only be imported from server-side code. ' +
//     'For client components, use API routes to fetch data instead.'
//   );
// }

// // Check for required environment variables
// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL environment variable is not set');
// }

// // Create a function to get or create the database client
// function createDrizzleClient() {
//   const connection = mysql.createPool(process.env.DATABASE_URL as string);
//   return drizzle(connection, { 
//     schema,
//     mode: 'default'  // Add the required mode property
//   });
// }

// // Use a global variable to maintain a singleton instance
// let globalDb: ReturnType<typeof createDrizzleClient>;

// // Get or create the database client
// export const db = globalDb || (globalDb = createDrizzleClient());
