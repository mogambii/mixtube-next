import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getDb from "@/util/db";
export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const rawQuery = request.nextUrl.searchParams.get("query") || "";
        const query = rawQuery.trim();
        if (!query) {
            return NextResponse.json([], { status: 200 });
        }
        const tokens = query
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, " ")
            .split(/\s+/)
            .filter(Boolean);
        const limit = 10;

        let mixtapes = await prisma.mixtape.findMany({
            where: tokens.length > 0
                ? {
                    AND: tokens.map((t) => ({
                        OR: [
                            { title: { contains: t } },
                            { djName: { contains: t } },
                            { genre: { contains: t } },
                            { desc: { contains: t } },
                        ],
                    })),
                  }
                : {
                    OR: [
                        { title: { contains: query } },
                        { djName: { contains: query } },
                        { genre: { contains: query } },
                        { desc: { contains: query } },
                    ],
                  },
            orderBy: [
                { totalPlays: "desc" },
                { time: "desc" },
            ],
            take: limit,
        });

        // Fallback to regex search through Mongo if Prisma returns no results (e.g., case sensitivity differences on Mongo)
        if (!mixtapes || mixtapes.length === 0) {
            const db = await getDb();
            const parts = tokens.length > 0 ? tokens : [query.toLowerCase()];
            const orsForToken = (t) => ([
                { title: { $regex: t, $options: "i" } },
                { djName: { $regex: t, $options: "i" } },
                { genre: { $regex: t, $options: "i" } },
                { desc: { $regex: t, $options: "i" } },
            ]);
            const docs = await db.collection("Mixtape").aggregate([
                {
                    $match: {
                        $and: parts.map((t) => ({ $or: orsForToken(t) })),
                    },
                },
                {
                    $project: {
                        title: 1,
                        djName: 1,
                        unique: 1,
                        imgthumb: 1,
                        totalPlays: 1,
                        totalDownloads: 1,
                        time: 1,
                    },
                },
                { $sort: { totalPlays: -1, time: -1 } },
                { $limit: limit },
            ]).toArray();
            mixtapes = docs;
        }

        const results = (mixtapes || []).map((m) => ({
            title: m.title,
            djName: m.djName,
            unique: m.unique,
            imgthumb: m.imgthumb,
            totalPlays: m.totalPlays,
            totalDownloads: m.totalDownloads,
            date: m.time,
            name: m.djName,
        }));

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
