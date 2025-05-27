import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth"; // Assuming auth is Edge compatible

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	if (!sessionCookie) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	// If session cookie exists, verify the session and get user roles
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session || !session.user) {
		// This case should ideally not happen if sessionCookie exists and is valid
		// but as a safeguard, redirect to login
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	const userRoles = session.user.role || [];
	const allowedRoles = ["admin", "driver"];

	const isAuthorized = userRoles;

	if (!isAuthorized) {
		const url = request.nextUrl.clone();
		url.pathname = "/unauthorized";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/dashboard/:path*"],
};