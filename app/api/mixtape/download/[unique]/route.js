import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { startOfDay } from "date-fns";

export async function POST(req, { params }) {
  try {
    const { unique } = params;

    // Get mixtape by unique identifier
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique },
    });

    if (!mixtape) {
      return NextResponse.json(
        { message: "Mixtape not found" },
        { status: 404 }
      );
    }

    // Increment totalDownloads
    await prisma.mixtape.update({
      where: { id: mixtape.id },
      data: { totalDownloads: mixtape.totalDownloads + 1 },
    });

    // Set today's date at start of day
    const today = startOfDay(new Date());

    // Update or create daily stats
    await prisma.stats.upsert({
      where: {
        mixtapeId_date: {
          mixtapeId: mixtape.id,
          date: today, // Date type, not string
        },
      },
      update: {
        downloads: {
          increment: 1,
        },
      },
      create: {
        mixtapeId: mixtape.id,
        date: today,
        plays: 0,
        downloads: 1,
      },
    });

    return NextResponse.json({
      message: "Download count updated successfully",
    });
  } catch (error) {
    console.error("Error updating download count:", error);
    return NextResponse.json(
      { message: "Failed to update download count" },
      { status: 500 }
    );
  }
}
