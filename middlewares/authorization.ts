import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import { startsWith } from "zod/v4";

export async function authorization(request: NextRequest) {
	// If session cookie exists, verify the session and get user roles
	// const session = await auth.api.getSession({ headers: request.headers });
    //
	// const pathname = request.nextUrl.pathname;
    //
	// const allowedRole = "admin";
    //
	// const userRole = session?.user.role;
    //
	// const isAuthorized = allowedRole === userRole;
    //
	// if (!isAuthorized) {
	// 	const url = request.nextUrl.clone();
	// 	url.pathname = "/unauthorized";
	// 	return NextResponse.redirect(url);
	// }

	return NextResponse.next();
}