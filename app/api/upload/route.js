import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Get the form data from the request
        const formData = await request.formData();
        
        // Retrieve the token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("mixtube-token")?.value;

        // Fetch the user profile using the token
        const profile = await fetch("https://server-nezz.vercel.app/api/user/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data_res = await profile.json();

        const { username, Djname } = data_res;

        // Append additional fields (username, Djname) to the form data
        formData.append('username', username);
        formData.append('Djname', Djname);

        // Send the form data to the target API with the authorization token
        const response = await fetch("https://server-0g0d.onrender.com/api/upload", {
            method: "POST",
            body: formData,  // Directly pass the FormData object
            headers: {
                Authorization: `Bearer ${token}`,
                // No need to set "Content-Type", the browser will handle it
            }
        });

        // Check if the response is successful
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        // Parse the JSON response from the upload API
        const data = await response.json();
        
        // Return the data as a Next.js response
        return new NextResponse(JSON.stringify(data), { status: 200 });

    } catch (error) {
        console.log(error);
        // Return an error response if anything fails
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
