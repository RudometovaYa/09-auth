import { parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

async function checkServerSession(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`,
    {
      method: 'GET',
      headers: { Cookie: cookie },
    },
  );

  if (!res.ok) throw new Error('Invalid session');
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get('cookie') || '';

  const parsedCookies = parse(cookieHeader);
  const accessToken = parsedCookies['accessToken'];
  const refreshToken = parsedCookies['refreshToken'];

  const isPrivateRoute = privateRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPrivateRoute) {
    try {
      await checkServerSession(request);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublicRoute) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    if (refreshToken) {
      try {
        await checkServerSession(request);
        return NextResponse.redirect(new URL('/profile', request.url));
      } catch {
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/sign-in', '/sign-up'],
};
