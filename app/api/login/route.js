import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const response = await fetch(
      `https://api.mixtube.xyz/api/user/login`,
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


      const userdata = await fetch(
        `https://api.mixtube.xyz/api/user/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userdata.ok) {
        return new NextResponse(
          JSON.stringify({ error: "Failed to fetch user profile" }),
          { status: 500 }
        );
      }

      const details = await userdata.json();

      const cookiesOptions = {
        httpOnly: true,
        secure: true, 
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      };

      // Set cookies
      await cookies(request).set("mixtube-username", username, cookiesOptions);
      await cookies(request).set("mixtube-tokenname", details.username, cookiesOptions);
      await cookies(request).set("mixtube-Djname", details.Djname, cookiesOptions);
      await cookies(request).set("mixtube-type", details.type, cookiesOptions);
      await cookies(request).set("mixtube-token", token, cookiesOptions);
      return new NextResponse(JSON.stringify({ message: "Login successful" }), { status: 200 });
    } else {
      const errorResponse = await response.json();
      return new NextResponse(
        JSON.stringify(errorResponse),
        { status: 401, statusText: "Login failed, please check your credentials" }
      );
    }
  } catch (error) {
    console.error('Error during login process:', error);
    return new NextResponse(JSON.stringify({ error: "server error" }), { status: 500 ,statusText: "server error"});
  }
}
