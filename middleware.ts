import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p.startsWith('/api/auth')) return NextResponse.next(); // auth ongemoeid laten
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|assets|public).*)'],
};
