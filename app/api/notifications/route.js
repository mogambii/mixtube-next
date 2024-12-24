import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    const page = request.nextUrl.searchParams.get("page");
    try {
        const cookieStore = await cookies()
        const username = cookieStore.get("mixtube-username")?.value
        const token = cookieStore.get("mixtube-token")?.value
        const response = await fetch(`https://api.mixtube.xyz/api/user/notifications?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache:"no-cache"
            
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
        const token = cookieStore.get("mixtube-token")?.value
        const id = request.nextUrl.searchParams.get("id");
        const response = await fetch(`https://api.mixtube.xyz/api/user/notification?notificationId=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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