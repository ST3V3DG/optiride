import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	console.log(sessionCookie);
 
	if (!sessionCookie) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}
 
	return NextResponse.next();
}
 
export const config = {
	matcher: ["/dashboard", "/dashboard/:path*"],
};