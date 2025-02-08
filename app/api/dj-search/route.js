import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query") || "";

    try {
        const results = await prisma.user.findMany({
            where: {
                type: "DJ",
                OR: [
                    {
                        username: {
                            contains: query.toLowerCase(),
                        },
                    },
                    {
                        djName: {  
                            contains: query.toLowerCase(),
                        },
                    },
                ],
            },
            select: {
                username: true,
                profilep: true,
                djName: true
            },
        });

        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
