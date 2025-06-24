"use server"

import { apiClient } from "@/lib/axios";
import { cookies } from "next/headers";

export async function Register(name: string, email: string, password: string, password_confirmation: string)
{
    // const response = await apiClient.post('/register', { name: name, email: email, password: password, password_confirmation: password_confirmation })

    return  await apiClient.post('/api/register', { name: name, email: email, password: password, password_confirmation: password_confirmation });
}

export async function Login(email: string, password: string)
{
    try
    {
        const response = await apiClient.post('/api/login', { email: email, password: password });
        const token = response.data.token;
        const cookieStore = await cookies();
        
        cookieStore.set("token",
            token,
            // {
            //     httpOnly: true, // Recommended for security
            //     secure: process.env.NODE_ENV === "production", // Use secure in production
            //     maxAge: 60 * 60 * 24 * 7, // 1 week
            //     path: "/",
            // }
        );
        apiClient.defaults.headers.common[ 'Authorization' ] = `Bearer ${token}`;
        apiClient.defaults.headers.common[ 'Accept' ] = 'application/vnd.api+json';
        apiClient.defaults.headers.common[ 'Content-Type' ] = 'application/vnd.api+json';
        apiClient.defaults.withCredentials = true;
        apiClient.defaults.withXSRFToken = true;
        return {success: true, data: response};
    } catch (error: any) {
        throw new Error(error.message);
    }  
}

export async function Logout() {
    try {
        const response = await apiClient.post('/logout');
        const cookieStore = await cookies();
        cookieStore.delete("token");
        delete apiClient.defaults.headers.common['Authorization'];
        delete apiClient.defaults.headers.common['Accept'];
        delete apiClient.defaults.headers.common['Content-Type'];
        apiClient.defaults.withCredentials = false;
        apiClient.defaults.withXSRFToken = false;
        return {success: true, data: response};
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function ForgotPassword(email: string) {
        
}