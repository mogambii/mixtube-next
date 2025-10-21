import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { startOfDay, format } from "date-fns";
import checkAndCreateMilestones from "@/scripts/create-milestone-notifications";

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
    const updatedMixtape = await prisma.mixtape.update({
      where: { id: mixtape.id },
      data: { totalDownloads: mixtape.totalDownloads + 1 },
    });

    // Check for milestone notifications
    await checkAndCreateMilestones(mixtape);

    // Set today's date at start of day
    const today = startOfDay(new Date());
    const formattedDate = format(today, "yyyy-MM-dd");

    try {
      // Update or create daily stats using a transaction to ensure data consistency
      await prisma.$transaction(async (tx) => {
        // First check if stats for today exist
        const existingStats = await tx.stats.findUnique({
          where: {
            mixtapeId_date: {
              mixtapeId: mixtape.id,
              date: today,
            },
          },
        });

        if (existingStats) {
          // Update existing stats
          await tx.stats.update({
            where: { id: existingStats.id },
            data: { downloads: existingStats.downloads + 1 },
          });
        } else {
          // Create new stats
          await tx.stats.create({
            data: {
              mixtapeId: mixtape.id,
              date: today,
              plays: 0,
              downloads: 1,
            },
          });
        }
      });

      console.log(
        `Download stats updated for mixtape ${mixtape.id} on ${formattedDate}`
      );
    } catch (statsError) {
      console.error(
        `Error updating stats for mixtape ${mixtape.id}:`,
        statsError
      );
      // Continue execution - don't fail the download if stats update fails
    }

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
