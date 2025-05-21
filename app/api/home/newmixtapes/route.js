import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const mixtapes = await prisma.mixtape.findMany({
      take: 12,
      orderBy: {
        time: "desc",
      },
      select: {
        id: true,
        title: true,
        imgthumb: true,
        unique: true,
        djName: true,
        totalPlays: true,
        totalDownloads: true,
      },
    });
    // Convert BigInt values to numbers for JSON serialization
    const serializedMixtapes = mixtapes.map((mixtape) => ({
      ...mixtape,
      totalPlays: Number(mixtape.totalPlays),
      totalDownloads: Number(mixtape.totalDownloads),
    }));
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
    console.error("Error fetching new mixtapes:", error);
    return NextResponse.json(
      { error: "Failed to fetch new mixtapes" },
      { status: 500 }
    );
  }
}
