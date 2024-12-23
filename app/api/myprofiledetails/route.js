import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const cookieStore = await cookies()
        const username = cookieStore.get("mixtube-username")?.value
        const response = await fetch(`https://server-nezz.vercel.app/api/user/dj/profile/?username=${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const cookieStore = await cookies()
        const username = cookieStore.get("mixtube-username")?.value
        const response = await fetch(`https://server-nezz.vercel.app/api/user/dj/profile/?username=${username}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const rawFormData = await request.formData(); // Parse incoming form data
        const formData = new FormData();

        for (const [key, value] of rawFormData.entries()) {
            formData.append(key, value);
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("mixtube-token")?.value;

        const response = await fetch("https://server-0g0d.onrender.com/api/user/profile", {
            method: "PATCH",
            headers: {
                authorization: `Bearer ${token}`,
            },
            body: formData, 
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

