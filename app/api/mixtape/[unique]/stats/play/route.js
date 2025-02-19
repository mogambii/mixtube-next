import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req, { params }) {
  try {
    const { unique } = params;
    // Get mixtape ID from unique identifier
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique },
      select: { id: true }
    });

    if (!mixtape) {
      return NextResponse.json({ message: "Mixtape not found" }, { status: 404 });
    }


    // Find or create stats record
    const stats = await prisma.stats.upsert({
      where: {
        mixtapeId: mixtape.id
      },
      update: {
        plays: {
          increment: 1
        }
      },
      create: {
        mixtapeId: mixtape.id,
        plays: 1,
        downloads: 0,
        likes: 0
      }
    });

    return NextResponse.json({ 
      message: "Play count updated successfully",
      stats
    });
  } catch (error) {
    console.error("Error updating play count:", error);
    return NextResponse.json(
      { message: "Failed to update play count" },
      { status: 500 }
    );
  }
}
