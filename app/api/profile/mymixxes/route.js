import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookieStore = await cookies();
  const username = cookieStore.get("mixtapped-username")?.value;
  const currentPage = request.nextUrl.searchParams.get("page");
  const itemsPerPage = request.nextUrl.searchParams.get("limit");
  const token = cookieStore.get("mixtapped-token")?.value;
  try {
    const response = await fetch(
      `https://api.mixtapped.com/api/search/mixtapes?search=${username}&page=${currentPage}&limit=${itemsPerPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json();
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
