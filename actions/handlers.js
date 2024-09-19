"use server"
import { cookies } from "next/headers";
export async function handleLogin(data) {
    console.log(data)
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
            cookies().set("mixtube-token",result.token)
            const profileResponse = await fetch(
              "https://server-nezz.vercel.app/api/user/profile",
              {
                headers: {
                  Authorization: `Bearer ${result.token}`,
                },
              }
            );
            const profile = await profileResponse.json();
            cookies().set("mixtube-tokenname", profile.username);
            if (profile.Djname) {
              cookies().set("mixtube-Djname", profile.Djname);
            }
            cookies().set("mixtube-type", profile.type);
            return {status:200,message:"logged in"}
          }else{
            return {status : 500, message:result.error}
          }
    } catch (error) {
        console.log(error)
        return {status : 500, message:"an error occurred"}

    }
}