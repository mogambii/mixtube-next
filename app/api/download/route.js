export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
        return new Response(JSON.stringify({ error: "url is required" }), {
            status: 400,
            headers: {
                "content-type": "application/json",
            },
        });
    }

    try {
        const fileResponse = await fetch(url);

        if (!fileResponse.ok) {
            return new Response(JSON.stringify({ error: "Failed to fetch file from the provided URL" }), {
                status: 500,
                headers: {
                    "content-type": "application/json",
                },
            });
        }

        const contentType = fileResponse.headers.get("content-type") || "application/octet-stream";
        let contentDisposition = fileResponse.headers.get("content-disposition") || 'attachment; filename="downloaded-file"';

        return new Response(fileResponse.body, {
            status: 200,
            headers: {
                "content-type": contentType,
                "content-disposition": contentDisposition,
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "An error occurred while downloading the file" }), {
            status: 500,
            headers: {
                "content-type": "application/json",
            },
        });
    }
}
