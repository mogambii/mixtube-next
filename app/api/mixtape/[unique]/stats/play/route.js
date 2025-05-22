import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req, { params }) {
  try {
    const { unique } = await params;

    // Fetch mixtape with totalPlays
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique },
      select: { id: true, totalPlays: true },
    });

    if (!mixtape) {
      return NextResponse.json(
        { message: "Mixtape not found" },
        { status: 404 }
      );
    }

    // Increment totalPlays
    await prisma.mixtape.update({
      where: { id: mixtape.id },
      data: { totalPlays: mixtape.totalPlays + 1 },
    });

    // Get today's date, but set time to 00:00:00 to match the unique index on date
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Upsert stats with composite unique constraint (mixtapeId + date)
    const stats = await prisma.stats.upsert({
      where: {
        mixtapeId_date: {
          mixtapeId: mixtape.id,
          date: today,
        },
      },
      update: {
        plays: {
          increment: 1,
        },
      },
      create: {
        mixtapeId: mixtape.id,
        date: today,
        plays: 1,
        downloads: 0,
        shares: 0,
      },
    });

    return NextResponse.json({
      message: "Play count updated successfully",
      stats,
    });
  } catch (error) {
    console.error("Error updating play count:", error);
    return NextResponse.json(
      { message: "Failed to update play count" },
      { status: 500 }
    );
  }
}
