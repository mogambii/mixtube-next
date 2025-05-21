import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Mixtape ID is required" },
        { status: 400 }
      );
    }

    // Get mixtape from ID
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique: id },
    });

    if (!mixtape) {
      return NextResponse.json(
        { message: "Mixtape not found" },
        { status: 404 }
      );
    }
    await prisma.mixtape.update({
      where: { id: mixtape.id },
      data: { totalPlays: mixtape.totalPlays + 1 },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    // Update play count in stats
    const existingStats = await prisma.stats.findFirst({
      where: {
        mixtapeId: mixtape.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
    });

    if (existingStats) {
      await prisma.stats.update({
        where: { id: existingStats.id },
        data: {
          plays: { increment: 1 },
        },
      });
    } else {
      await prisma.stats.create({
        data: {
          mixtapeId: mixtape.id,
          date: today,
          plays: 1,
          downloads: 0,
        },
      });
    }

    return NextResponse.json({ message: "Play count updated successfully" });
  } catch (error) {
    console.error("Error updating play count:", error);
    return NextResponse.json(
      { message: "Error updating play count" },
      { status: 500 }
    );
  }
}
