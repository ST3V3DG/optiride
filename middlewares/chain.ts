// middlewares/chain.ts
import { NextRequest, NextResponse } from 'next/server';

type Middleware = (request: NextRequest) => Promise<NextResponse>;

export function chain(...middlewares: Middleware[]) {
  return async (request: NextRequest) => {
    for (const middleware of middlewares) {
      const response = await middleware(request);
      if (response.redirected || response.status !== 200) {
        return response;
      }
    }
    return NextResponse.next();
  };
}
