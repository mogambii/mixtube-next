export async function GET(request) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my/mixtape`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${request.headers.get("Authorization")}`,
            },
            
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 }); 
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}