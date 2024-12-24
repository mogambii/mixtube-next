import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("mixtube-token")?.value;
        const id = request.nextUrl.searchParams.get("id");

        const response = await fetch(`https://api.mixtube.xyz/api/my/mixtape/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("mixtube-token")?.value;
        const id = request.nextUrl.searchParams.get("id");

        const response = await fetch(`https://api.mixtube.xyz/api/mixtape/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
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


export async function PATCH(request) {
    try {
        // Retrieve the form data from the request
        const formData = await request.formData();

        // Get the token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("mixtube-token")?.value;

        // Extract the id from the URL parameters
        const id = request.nextUrl.searchParams.get("id");

        // Send the form data with the PUT request to the API
        const response = await fetch(`https://api.mixtube.xyz/api/mixtape/${id}`, {
            method: "PUT", // Use PUT or PATCH depending on your API
            body: formData, // Send the form data directly
            headers: {
                Authorization: `Bearer ${token}`,
                // Don't manually set the Content-Type; FormData will handle it
            },
        });

        // Handle unsuccessful responses
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON response from the API
        const data = await response.json();

        // Return the response as JSON
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.log(error); // Log the error for debugging
        // Return an error response if something goes wrong
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
