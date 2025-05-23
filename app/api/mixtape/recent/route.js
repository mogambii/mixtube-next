import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    
    // Fetch recent mixtapes
    const recentMixtapes = await prisma.mixtape.findMany({
      include: {
        user: {
          select: {
            username: true,
            profilep: true,
            id: true,
          },
        },
      },
      orderBy: {
        time: "desc",
      },
      take: limit,
    });

    // Format the mixtapes for response
    const formattedMixtapes = recentMixtapes.map((mixtape) => ({
      id: mixtape.id,
      title: mixtape.title,
      genre: mixtape.genre,
      cover: mixtape.imgthumb,
      time: mixtape.time,
      unique: mixtape.unique,
      djName: mixtape.djName,
      totalPlays: mixtape.totalPlays,
      user: {
        username: mixtape.user.username,
        profilep: mixtape.user.profilep,
        userId: mixtape.user.id,
      },
    }));

    return new NextResponse(JSON.stringify(formattedMixtapes), { status: 200 });
  } catch (error) {
    console.error("Error fetching recent mixtapes:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
