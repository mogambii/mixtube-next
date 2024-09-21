"use server"
import { cookies } from "next/headers";
export async function handleLogin(data) {
  try {
    const response = await fetch(
      "https://server-nezz.vercel.app/api/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (response.ok) {
      // Set token in cookies
      cookies().set("mixtube-token", result.token);

      // Fetch user profile after login
      const profileResponse = await fetch(
        "https://server-nezz.vercel.app/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${result.token}`,
          },
        }
      );

      const profile = await profileResponse.json();

      // Set profile-related cookies
      cookies().set("mixtube-tokenname", profile.username);
      if (profile.Djname) {
        cookies().set("mixtube-Djname", profile.Djname);
      }
      cookies().set("mixtube-type", profile.type);

      // Return successful login data
      return {
        status: 200,
        message: "logged in",
        data: {
          username: profile.username,
          Djname: profile.Djname,
          type: profile.type,
          token: result.token,
        },
      };
    } else {
      // Handle non-OK responses
      return { status: 500, message: result.error };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { status: 500, message: "An error occurred during login" };
  }
}

export async function LogOut() {
  try {
    cookies().delete("mixtube-username")
    await cookies().delete("mixtube-tokenname")
    await cookies().delete("mixtube-Djname")
    await cookies().delete("mixtube-type")
   cookies().delete("mixtube-token")
  } catch (error) {
    console.log(error)
  }
  
}

export async function handleLIkeAndUnlike(data) {
  const action = data.action
  const id = data.id
  const token = cookies().get("mixtube-token")?.value
  try { 
    const response = await fetch(
      `https://server-nezz.vercel.app/api/${action}?post=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    console.log(error)
  }
}

export async function handleCommentSubmit(data) {
  const token = cookies().get("mixtube-token")?.value
  try {
    const response = await fetch(
      `https://server-nezz.vercel.app/api/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    console.log(error)
  }
}

export async function handleFollowToggle(data) {
  const token = cookies().get("mixtube-token")?.value
  try {
    const response = await fetch(
      `https://server-nezz.vercel.app/api/user/engage/${data.action}?username=${data.username}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    console.log(error)
  }
}

export async function handleUpdateDownloads(id) {
  try {
    const response = await fetch(
      `https://server-nezz.vercel.app/api/download/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    return res;
  }
  catch (error) {
    console.log(error)
  }
}