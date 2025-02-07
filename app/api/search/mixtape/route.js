import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function GET(request) {
    try {
        const query = await request.nextUrl.searchParams.get("query");
        const limit = 10;
        const mixtapes = await prisma.mixtape.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            select: {
                title: true,
                time: true,
                djName: true,
                imgthumb: true,
                unique: true
            },
            take: limit
        })
        console.log(mixtapes)
        return NextResponse.json(mixtapes, { status: 200 });
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}