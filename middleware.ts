// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { chain } from './middlewares/chain';
import { auth } from './middlewares/auth';
import { authorization } from './middlewares/authorization';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/dashboard')) {
    return chain(auth, authorization)(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
