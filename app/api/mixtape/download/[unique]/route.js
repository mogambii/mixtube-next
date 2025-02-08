import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Please login to download" }, { status: 401 });
    }

    const { unique } = params;
    console.log(unique);

    // Get mixtape ID from unique identifier
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique },
    });

    if (!mixtape) {
      return NextResponse.json({ message: "Mixtape not found" }, { status: 404 });
    }

    // Update or create stats record
    const today = new Date().toISOString()
    await prisma.stats.upsert({
      where: {
        mixtapeId_date: {
          mixtapeId: mixtape.id,
          date: today
        }
      },
      update: {
        downloads: {
          increment: 1
        }
      },
      create: {
        mixtapeId: mixtape.id,
        date: today,
        plays: 0,
        downloads: 1,
        likes: 0
      }
    });


    return NextResponse.json({ message: "Download count updated successfully" });
  } catch (error) {
    console.error("Error updating download count:", error);
    return NextResponse.json(
      { message: "Failed to update download count" },
      { status: 500 }
    );
  }
}
