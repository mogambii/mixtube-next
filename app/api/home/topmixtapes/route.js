import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Get date from 2 months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const mixtapes = await prisma.mixtape.findMany({
      where: {
        time: {
          gte: twoMonthsAgo
        }
      },
      select: {
        id: true,
        title: true,
        imgthumb: true,
        unique: true,
        djName: true,
        totalPlays: true,
        totalDownloads: true,
        time: true,
      },
    });

    // Convert BigInt values and calculate trending score
    const scoredMixtapes = mixtapes
      .map(mixtape => {
        const plays = Number(mixtape.totalPlays);
        const downloads = Number(mixtape.totalDownloads);
        return {
          ...mixtape,
          totalPlays: plays,
          totalDownloads: downloads,
          trendingScore: (plays * 0.6) + (downloads * 0.4)
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 12);

    // Remove trendingScore from response
    const serializedMixtapes = scoredMixtapes.map(({ trendingScore, ...mixtape }) => mixtape);
    return NextResponse.json(
      { mixtapes: serializedMixtapes },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching top mixtapes:", error);
    return NextResponse.json(
      { error: "Failed to fetch top mixtapes" },
      { status: 500 }
    );
  }
}
