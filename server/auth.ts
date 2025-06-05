"use server"

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function LogIn( email: string, password: string, callbackURL?: string ) {
    try {
        const response = await auth.api.signInEmail({
            body: {
                email: `${email}`,
                password: `${password}`,
                callbackURL: `${callbackURL}` || `/`,
            },
        })
        return {success: true, data: response};
    } catch (error) {
        if (error instanceof APIError) {
            console.log(error.message, error.status)
        }
        console.error("Error while logging in", error);
        return {success: false, error: error};
    }
}

export async function SignUp( name: string, email: string, password: string, callbackURL?: string ) {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                name: `${name}`,
                email: `${email}`,
                password: `${password}`,
                callbackURL: `${callbackURL}` || `/`,
            },
        })
        return {success: true, data: response};
    } catch (error) {
        if (error instanceof APIError) {
            console.log(error.message, error.status)
            console.log("Error while signing up", error);
        }
        return {success: false, error: error};
    }
}

// export async function LogOut() {
//     try {
//         const response = await authClient.signOut();
//         return {success: true, data: response};
//     } catch (error) {
//         console.error("Error while logging out", error);
//         return {success: false, error: error};
//     }
// }