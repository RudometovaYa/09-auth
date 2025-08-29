import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { serverGetSession } from './lib/api/serverApi';

const privateRoutes = ['/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      const data = await serverGetSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed['Max-Age']),
          };
          if (parsed.accessToken)
            cookieStore.set('accessToken', parsed.accessToken, options);
          if (parsed.refreshToken)
            cookieStore.set('refreshToken', parsed.refreshToken, options);
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }

        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/profile/:path*', '/sign-in', '/sign-up'],
};

/* import { parse } from 'cookie';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { serverGetSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const cookiesData = await cookies();
  const accessToken = cookiesData.get('accessToken')?.value;
  const refreshToken = cookiesData.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPrivateRoute) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.nextUrl.origin));
    }

    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      const res = await serverGetSession();
      const resCookies = res.headers['set-cookie'];

      if (resCookies) {
        const array = Array.isArray(resCookies) ? resCookies : [resCookies];
        for (const cookiesStr of array) {
          if (cookiesStr) {
            const parsed = parse(cookiesStr);
            const options: Partial<ResponseCookie> = {
              maxAge: Number(parsed['Max-Age']),
              path: parsed.Path,
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            };
            if (parsed.accessToken) {
              cookiesData.set('accessToken', parsed.accessToken, options);
            }
            if (parsed.refreshToken) {
              cookiesData.set('refreshToken', parsed.refreshToken, options);
            }
          }
        }

        return NextResponse.next({
          headers: {
            Cookie: cookiesData.toString(),
          },
        });
      }

      return NextResponse.redirect(new URL('/sign-in', request.nextUrl.origin));
    }
  }

  if (isPublicRoute) {
    if (!accessToken && !refreshToken) {
      return NextResponse.next();
    }
    if (accessToken) {
      return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }
    if (refreshToken) {
      const res = await serverGetSession();
      const resCookies = res.headers['set-cookie'];

      if (resCookies) {
        const array = Array.isArray(resCookies) ? resCookies : [resCookies];
        for (const cookiesStr of array) {
          if (cookiesStr) {
            const parsed = parse(cookiesStr);
            const options: Partial<ResponseCookie> = {
              maxAge: Number(parsed['Max-Age']),
              path: parsed.Path,
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            };
            if (parsed.accessToken) {
              cookiesData.set('accessToken', parsed.accessToken, options);
            }
            if (parsed.refreshToken) {
              cookiesData.set('refreshToken', parsed.refreshToken, options);
            }
          }
        }

        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }

      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
 */
