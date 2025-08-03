"use server";
import { cookies } from "next/headers";
export async function handleLogin(data) {
  try {
    const response = await fetch("https://api.mixtapped.com/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      cookies().set("mixtapped-token", result.token);

      // Fetch user profile after login
      const profileResponse = await fetch(
        "https://api.mixtapped.com/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${result.token}`,
          },
        }
      );

      const profile = await profileResponse.json();
      cookies().set("mixtapped-tokenname", profile.username);
      if (profile.Djname) {
        cookies().set("mixtapped-Djname", profile.Djname);
      }
      cookies().set("mixtapped-type", profile.type);

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
    cookies().delete("mixtapped-username");
    await cookies().delete("mixtapped-tokenname");
    await cookies().delete("mixtapped-Djname");
    await cookies().delete("mixtapped-type");
    cookies().delete("mixtapped-token");
  } catch (error) {
    console.log(error);
  }
}

export async function handleCommentSubmit(data) {
  const token = cookies().get("mixtapped-token")?.value;
  try {
    const response = await fetch(`https://api.mixtapped.com/api/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function handleFollowToggle(data) {
  const token = cookies().get("mixtapped-token")?.value;
  try {
    const response = await fetch(
      `https://api.mixtapped.com/api/user/engage/${data.action}?username=${data.username}`,
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
    console.log(error);
  }
}

export async function handleUpdateDownloads(id) {
  try {
    const response = await fetch(
      `https://api.mixtapped.com/api/download/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    console.log(error);
  }
}
