"use server";

import { z } from "zod";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { drizzle } from "drizzle-orm/mysql2";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const userActionSchema = z.object({
  cni_passport_number: z.string().min(9),
  name: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email(),
  role: z.enum(["client", "driver", "admin"]),
  validated: z.boolean(),
});

export async function createUser(formData: z.infer<typeof userActionSchema>) {
  const validatedFields = userActionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  // const newUserId = randomUUID();

  try {
    const result = await db.insert(users).values({
      ...validatedFields.data,
    }).execute();

    revalidatePath("/dashboard/users");
    return { success: "User created successfully."};
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Database error: Failed to create user." };
  }
}

export async function updateUser(userId: string, formData: z.infer<typeof userActionSchema>) { 
   const validatedFields = userActionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error.flatten() };
  }
  const { ...dataToUpdate } = validatedFields.data; 

  try {
    await db.update(users)
      .set({
        ...dataToUpdate, 
        updatedAt: sql`NOW()`,
      })
      .where(eq(users.id, Number(userId))) 
      .execute();

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);
    return { success: "User updated successfully." };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Database error: Failed to update user." };
  }
}

export async function toggleProfileValidation(id: string, validationStatus: boolean) { 
  try {
    await db
      .update(users)
      .set({
        validated: validationStatus,
        updatedAt: sql`NOW()`,
      })
      .where(eq(users.id, Number(id))) 
      .execute();

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
    return { success: "User validation updated successfully." };
  } catch (error) {
    console.error("Error updating user validation status:", error);
    return { error: "Database error: Failed to update user validation status." };
  }
}

// Configuration de la connexion à la base de données MySQL avec Drizzle
// async function initializeDatabase(): Promise<MySql2Database> {
//   const connection = await createConnection({
//     uri: process.env.DATABASE_URL,
//   });
//   return drizzle(connection);
// }

// Server Action pour gérer le téléversement et la mise à jour
export async function uploadProfilePicture(formData: FormData, userId?: string | undefined) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const authUser = session?.user;
  if (!authUser) {
    return { error: "Utilisateur non authentifié" };
  }

  userId = userId ? userId : authUser.id;
  
  const file = formData.get("profilePicture") as File;
  if (!file) {
    return { error: "Aucun fichier sélectionné" };
  }

  // Validation du type de fichier (images uniquement)
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Type de fichier non autorisé. Utilisez JPEG, PNG ou GIF." };
  }

  // Validation de la taille du fichier (max 4 Mo)
  const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
  if (file.size > maxSize) {
    return { error: "Le fichier est trop volumineux. Maximum 4 Mo." };
  }

  try {
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `profile-${userId}-${timestamp}.${fileExtension}`;
    const filePath = join(process.cwd(), "public/images", fileName);

    // Créer le répertoire /public/images s'il n'existe pas
    await mkdir(join(process.cwd(), "public/images"), { recursive: true });

    // Écrire le fichier dans /public/images
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Construire l'URL relative
    const fileUrl = `/images/${fileName}`;

    // Mettre à jour le champ image dans la table users
    await db
      .update(users)
      .set({ image: fileUrl })
      .where(eq(users.id, Number(userId)));
    
    revalidatePath(`${'/dashboard/user/' + userId}`);

    return { success: true, fileUrl };
  } catch (error) {
    console.error("Erreur dans uploadProfilePicture :", error);
    return { error: "Échec du téléversement ou de la mise à jour de la base de données" };
  }
}