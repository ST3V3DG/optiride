"use server";

import { z } from "zod";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const userActionSchema = z.object({
  // nic_passport_number: z.string().min(9),
  name: z.string().min(2),
  // phone: z.string().min(9),
  email: z.string().email(),
  // role: z.enum(["user", "driver", "admin"]),
  // validated: z.boolean(),
});

const updateUserSchema = userActionSchema.extend({
  password: z.string().optional()
});

// Schema for createUser, including password
const createUserPayloadSchema = userActionSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function createUser(formData: z.infer<typeof createUserPayloadSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }
  // const canCreate = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { userResource: ["create"] } } });
  // if (!canCreate?.success) {
  //   return { error: "Forbidden: You do not have permission to create users." };
  // }

  const validatedFields = createUserPayloadSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  try {
    const { name, email, password } = validatedFields.data;

    const newUser = await auth.api.signUpEmail({ body: {
      name: name,
      email: email,
      password: password,
    }, headers: await headers() });
    if (!newUser) { // Or check for specific error indicators from better-auth
      return { error: "Better Auth: Failed to create user." };
    }

    revalidatePath("/dashboard/users");
    return { success: "User created successfully." };
  } catch (error: any) {
    console.error("Error creating user:", error);
    // Check for better-auth specific error messages or types if available
    return { error: error.message || "Server error: Failed to create user." };
  }
}

export async function updateUser(userId: string, formData: z.infer<typeof updateUserSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }
  // const canUpdate = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { userResource: ["update"] } } });
  // if (!canUpdate?.success) {
  //   // For now, strictly checking admin permission for this generic update function.
  //   // A separate updateProfile function could handle self-updates with different logic if needed.
  //   return { error: "Forbidden: You do not have permission to update users." };
  // }

  // For updateUser, password is optional. We use userActionSchema and manually check password.
  const validatedFields = updateUserSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error.flatten() };
  }

  const { name, email, password } = validatedFields.data;
  const betterAuthUpdateData: any = {
    email,
    data: {
      name,
    }
  };

  if (password && password.trim() !== "") {
    // Add password validation if needed, e.g., min length
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters long if provided." };
    }
    betterAuthUpdateData.password = password;
  }

  try {
    const updatedUser = await updateUser(userId, betterAuthUpdateData);
    if (!updatedUser) { // Or check for specific error indicators
        return { error: "Better Auth: Failed to update user." };
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);
    return { success: "User updated successfully." };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { error: error.message || "Server error: Failed to update user." };
  }
}

export async function toggleProfileValidation(id: string, validationStatus: boolean) { 
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }
  // const canValidate = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { userResource: ["update"] } } });
  // if (!canValidate?.success) {
  //   return { error: "Forbidden: You do not have permission to change user validation status." };
  // }

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
    return { error: "Utilisateur non authentifié" }; // Existing check for basic authentication
  }

  const targetUserId = userId ? userId : authUser.id;

  // If userId is provided and it's different from the authenticated user's ID,
  // it means an admin might be trying to change another user's picture.
  // if (userId && userId !== authUser.id) {
  //   const canUpdateOther = await auth.api.hasPermission({ headers: await headers(), body: { permissions: { userResource: ["update"] } } });
  //   if (!canUpdateOther?.success) {
  //     return { error: "Forbidden: You do not have permission to update other users' profile pictures." };
  //   }
  // }
  // If userId is not provided or userId === authUser.id, the user is updating their own picture.
  // This is generally allowed for any authenticated user.

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
      .where(eq(users.id, Number(targetUserId))); // Use targetUserId here
    
    revalidatePath(`${'/dashboard/user/' + targetUserId}`); // Use targetUserId here

    return { success: true, fileUrl };
  } catch (error) {
    console.error("Erreur dans uploadProfilePicture :", error);
    return { error: "Échec du téléversement ou de la mise à jour de la base de données" };
  }
}