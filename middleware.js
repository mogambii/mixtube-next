import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookieStore = cookies();

  const mixtubeToken = cookieStore.get('mixtube-token');
  const mixtubeType = cookieStore.get('mixtube-type');
  const mixtubeUsername = cookieStore.get('mixtube-tokenname');


  if (pathname.startsWith('/dj/')) {
    const name = pathname.split('/')[2];

    if (mixtubeUsername && name === mixtubeUsername.value) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
  }

  const protectedRoutes = ['/create', '/editprofile', '/editmixtape'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!mixtubeType) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/dj/:name*', '/create', '/editprofile', '/editmixtape'],
};
