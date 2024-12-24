import { NextResponse } from "next/server";

export async function PATCH(request) {
    try {
        const formData = await request.formData();
        const cookieStore = await cookies();
        const token = cookieStore.get("mixtube-token")?.value;
        const id = request.nextUrl.searchParams.get("id");

        const response = await fetch(`hhttps://api.mixtube.xyz/api/user/profile/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}       
