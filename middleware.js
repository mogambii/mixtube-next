import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookieStore = cookies();

  const mixtubeType = cookieStore.get('mixtube-type');
  const mixtubeUsername = cookieStore.get('mixtube-tokenname');

  // Protect the /login route if the user is already logged in
  if (pathname === '/login' && mixtubeType) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  // Protect /dj/[name] route and redirect if the username matches the cookie value
  if (pathname.startsWith('/dj/')) {
    const name = pathname.split('/')[2];
    if (mixtubeUsername && name === mixtubeUsername?.value) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
  }

  // Protect certain routes if the user is not logged in
  const protectedRoutes = ['/create', '/editprofile', '/editmixtape'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!mixtubeType) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dj/:name*', '/create', '/editprofile', '/editmixtape'],
};
