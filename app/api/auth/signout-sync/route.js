import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/auth/signout-sync
 * Called by the DJ panel (dj.mixtapped.com) to clear the session
 * cookie on this domain (mixtapped.com) as well.
 */
export async function GET(req) {
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  const response = NextResponse.redirect(
    new URL("/login", req.url)
  );

  // Clear the session cookie on this domain
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    domain:
      process.env.NODE_ENV === "production" ? ".mixtapped.com" : undefined,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
