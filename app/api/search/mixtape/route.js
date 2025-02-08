import getDb from "@/util/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const query = request.nextUrl.searchParams.get("query");
        const db = await getDb();
        const limit = 10;

        const mixtapes = await db.collection("Mixtape").aggregate([
            // Lookup stats for each mixtape
            {
                $lookup: {
                    from: "Stats",
                    localField: "_id",
                    foreignField: "mixtapeId",
                    as: "stats"
                }
            },
            // Compute total plays and downloads
            {
                $addFields: {
                    totalPlays: {
                        $sum: {
                            $concatArrays: [
                                [{ $ifNull: ["$plays", 0] }], // Include main plays field
                                { $ifNull: ["$stats.plays", []] } // Include stats plays
                            ]
                        }
                    },
                    totalDownloads: {
                        $sum: {
                            $concatArrays: [
                                [{ $ifNull: ["$downloads", 0] }], // Include main downloads field
                                { $ifNull: ["$stats.downloads", []] } // Include stats downloads
                            ]
                        }
                    }
                }
            },
            // Match mixtapes based on query
            {
                $match: {
                    $or: [
                        { title: { $regex: query, $options: "i" } },
                        { description: { $regex: query, $options: "i" } }
                    ]
                }
            },
            // Project only necessary fields (Remove stats array)
            {
                $project: {
                    title: 1,
                    djName: 1,
                    unique: 1,
                    imgthumb: 1,
                    totalPlays: 1,
                    totalDownloads: 1
                }
            },
            // Sort by total plays
            { $sort: { totalPlays: -1 } },
            { $limit: limit }
        ]).toArray();

        return NextResponse.json(mixtapes, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
