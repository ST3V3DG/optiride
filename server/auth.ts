"use server"

import { auth } from "@/lib/auth";

// Re-export the auth instance for the CLI to pick up
export { auth };

export const LogIn = async (email: string, password: string) => {
    try {
        const response = await auth.api.signInEmail({
            body: {
                email: `${email}`,
                password: `${password}`,
            },
        })
        return {success: true, data: response};
    } catch (error) {
        console.error("Error while logging in", error);
        return {success: false, error: error};
    }
}

export const SignUp = async (name: string, email: string, password: string ) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                name: `${name}`,
                email: `${email}`,
                password: `${password}`,
            },
        })
        return {success: true, data: response};
    } catch (error) {
        console.error("Error while signing up", error);
        return {success: false, error: error};
    }
}

// export const LogOut = async () => {
//     try {
//         const response = await authClient.signOut();
//         return {success: true, data: response};
//     } catch (error) {
//         console.error("Error while logging out", error);
//         return {success: false, error: error};
//     }
// }