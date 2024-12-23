import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookieStore = await  cookies();

  const mixtubeUsername = cookieStore.get('mixtube-username');
  const token = cookieStore.get('mixtube-token')?.value;


  if (pathname.startsWith('/dj/')) {
    const name = pathname.split('/')[2];
    if (mixtubeUsername && name === mixtubeUsername?.value) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
  }

  // Protect certain routes if the user is not logged in
  const protectedRoutes = ['/create', '/editprofile', '/editmixtape','/profile']
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dj/:name*', '/create', '/editprofile', '/editmixtape'],
};
