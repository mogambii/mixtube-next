import getDb from "@/util/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { unique } =  await params;

    try {
        const db = await getDb();

        const data = await db.collection("Mixtape").aggregate([
            {
                $match: {
                    unique
                }
            },
            {
                $lookup: {
                    from: "Stats",
                    localField: "_id",
                    foreignField: "mixtapeId",
                    as: "stats"
                },
                $lookup: {
                    from: "User",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            }
        ]).toArray();
        console.log(data)
        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
