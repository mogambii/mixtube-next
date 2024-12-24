import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const response = await fetch(
      `hhttps://api.mixtube.xyz/api/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
 
    if (response.ok) {
      const data = await response.json();
      const token = data.token;


      // Fetch user profile with the received token
      const userdata = await fetch(
        `hhttps://api.mixtube.xyz/api/user/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userdata.ok) {
        // Handle failure in fetching user details
        console.error('Failed to fetch user profile:', userdata.status);
        return new NextResponse(
          JSON.stringify({ error: "Failed to fetch user profile" }),
          { status: 500 }
        );
      }

      const details = await userdata.json();

      const cookiesOptions = {
        httpOnly: true,
        secure: true, // Only use secure cookies in production
        sameSite: "None", // For cross-origin cookies
        maxAge: 60 * 60 * 24 * 7, // 7 days
      };

      // Set cookies
      await cookies(request).set("mixtube-username", username, cookiesOptions);
      await cookies(request).set("mixtube-tokenname", details.username, cookiesOptions);
      await cookies(request).set("mixtube-Djname", details.Djname, cookiesOptions);
      await cookies(request).set("mixtube-type", details.type, cookiesOptions);
      await cookies(request).set("mixtube-token", token, cookiesOptions);
      return new NextResponse(JSON.stringify(data), { status: 200 });
    } else {
      // Log error response details for better debugging
      const errorResponse = await response.json();
      console.error('Login failed:', errorResponse);
      return new NextResponse(
        JSON.stringify({ error: "Login failed", details: errorResponse }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error during login process:', error);
    return new NextResponse(JSON.stringify({ error: "Login failed" }), { status: 500 });
  }
}
