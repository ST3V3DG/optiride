import { NextResponse, NextRequest } from 'next/server';
import { apiClient } from './lib/axios';

export async function middleware(request: NextRequest) {
//   try {
//     // Get the auth token from cookies
//     const token = request.cookies.get('token')?.value;
    
//     if (!token) {
//       throw new Error('No token found');
//     }

//     // Make sure the token is included in the request
//     const response = await apiClient.get("/csrf-cookie").then(() => apiClient.get('/auth-user'));

//     if (response.data.data?.user) {
      return NextResponse.next();
//     }

//   } catch (error) {
//     console.error('Authentication error:', error);
//   }

//   // If we get here, either there was an error or user is not authenticated
//   const loginUrl = new URL('/login', request.url);
//   loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
  // return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*'],
};