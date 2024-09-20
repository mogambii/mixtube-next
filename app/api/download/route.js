export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    async function fetchMixData(id2) {
        if (!id) return null;
        
        try {
          const response = await fetch(
            `https://server-nezz.vercel.app/api/mixtape/${id2}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );
          
          if (!response.ok)
            throw new Error(`Failed to fetch mixtape: ${response.statusText}`);
      
          const record = await response.json();
          return record;
        } catch (error) {
          console.error(error.message);
          return null;
        }
      }

      const mix = await fetchMixData(id);
      console.log(mix)
    if (!mix?.audio) {
        return new Response(JSON.stringify({ error: "url is required" }), {
            status: 400,
            headers: {
                "content-type": "application/json",
            },
        });
    }

    try {
        const fileResponse = await fetch(mix?.download_url);

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
