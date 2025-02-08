import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Mixtape ID is required" }, { status: 400 });
    }

    // Get mixtape from ID
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique: id },
    });

    if (!mixtape) {
      return NextResponse.json({ message: "Mixtape not found" }, { status: 404 });
    }

    const today = new Date().toISOString();
    // Update play count in stats
    await prisma.stats.upsert({
      where: {
        mixtapeId_date: {
          mixtapeId: mixtape.id,
          date: today
        }
      },
      update: {
        plays: {
          increment: 1
        }
      },
      create: {
        mixtapeId: mixtape.id,
        date: today,
        plays: 1,
        downloads: 0,
        likes: 0
      }
    });

    return NextResponse.json({ message: "Play count updated successfully" });
  } catch (error) {
    console.error("Error updating play count:", error);
    return NextResponse.json({ message: "Error updating play count" }, { status: 500 });
  }
}
