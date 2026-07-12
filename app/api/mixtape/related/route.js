import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const excludeId = searchParams.get("excludeId");
    const limit = parseInt(searchParams.get("limit") || "4", 10);
    
    if (!genre) {
      return new NextResponse(
        JSON.stringify({ error: "Genre parameter is required" }),
        { status: 400 }
      );
    }

    // Support comma-separated multi-genre: match any of the genres
    const genreList = genre.split(",").map((g) => g.trim()).filter(Boolean);

    // Find related mixtapes by any matching genre, excluding the current mixtape
    const relatedMixtapes = await prisma.mixtape.findMany({
      where: {
        OR: genreList.map((g) => ({ genre: { contains: g, mode: "insensitive" } })),
        ...(excludeId && { unique: { not: excludeId } }),
      },
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
        time: "desc", // Get the most recent first
      },
      take: limit,
    });

    // If no mixtapes found with the same genre, fetch recent mixtapes instead
    if (relatedMixtapes.length === 0) {
      const recentMixtapes = await prisma.mixtape.findMany({
        where: {
          ...(excludeId && { unique: { not: excludeId } }),
        },
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

      const formattedRecentMixtapes = recentMixtapes.map((mixtape) => ({
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

      return new NextResponse(
        JSON.stringify({ 
          mixtapes: formattedRecentMixtapes,
          source: "recent" 
        }), 
        { status: 200 }
      );
    }

    // Format the related mixtapes response
    const formattedRelatedMixtapes = relatedMixtapes.map((mixtape) => ({
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

    return new NextResponse(
      JSON.stringify({ 
        mixtapes: formattedRelatedMixtapes,
        source: "genre" 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching related mixtapes:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
