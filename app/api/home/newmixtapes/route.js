import { NextResponse } from "next/server";
import getDb from "@/util/db";

export async function GET() {
  try {
    const db = await getDb();
    const mixtapes = await db.collection("Mixtape").aggregate([
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
        $sort: {
          time: -1
        }
      },
      {
        $limit: 12
      },
      {
        $project: {
          _id: 0,
          title: 1,
          imgthumb: 1,
          unique: 1,
          djName: 1,
          engagement: {
            plays: { $ifNull: ["$totalPlays", 0] },
            downloads: { $ifNull: ["$totalDownloads", 0] }
          }
        }
      }
    ]).toArray();

    return NextResponse.json({ mixtapes });
  } catch (error) {
    console.error("Error fetching new mixtapes:", error);
    return NextResponse.json(
      { error: "Failed to fetch new mixtapes" },
      { status: 500 }
    );
  }
}