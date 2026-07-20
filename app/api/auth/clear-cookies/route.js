import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const cookieNames = [
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
    "__Host-next-auth.csrf-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url"
  ];
  
  const domains = [undefined, ".mixtapped.com", "mixtapped.com", "dj.mixtapped.com"];

  cookieNames.forEach((name) => {
    domains.forEach((domain) => {
      cookieStore.set(name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        domain: domain,
      });
    });
  });

  return NextResponse.json({ success: true });
}
