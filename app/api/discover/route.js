import getDb from "@/util/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {

        const db = await getDb();
        const url = new URL(request.url);
        const page = url.searchParams.get("page") || 1;

        const totalmixtapes = await db.collection("Mixtape").countDocuments();

        const data = await db.collection("Mixtape").aggregate([
            {
                $lookup: {
                    from: "Stats",
                    localField: "_id",
                    foreignField: "mixtapeId",
                    as: "stats"
                }
            },
            {
                $addFields: {
                    totalPlays: {
                        $add: [
                            { $ifNull: ["$plays", 0] },
                            { $ifNull: [{ $sum: "$stats.plays" }, 0] }
                        ]
                    },
                    totalDownloads: {
                        $add: [
                            { $ifNull: ["$downloads", 0] },
                            { $ifNull: [{ $sum: "$stats.downloads" }, 0] }
                        ]
                    }
                }
            },
            {
                $skip: (page - 1) * 10,
            },
            {
                $limit: 12,
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    djName: 1,
                    unique: 1,
                    imgthumb: 1,
                    totalPlays: 1,
                    totalDownloads: 1
                }
            },
            {
                $sort: {
                    totalPlays: -1
                }
            }
        ]).toArray();
        return NextResponse.json({ data, totalmixtapes }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}