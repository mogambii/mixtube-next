import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.mixtapeLike.count({
      where: {
        userId: session.user.id,
      },
    });

    const favorites = await prisma.mixtapeLike.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        mixtape: {
          include: {
            user: {
              select: {
                djName: true,
                profilep: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the expected format
    const transformedFavorites = favorites.map((fav) => ({
      id: fav.mixtape.id,
      title: fav.mixtape.title,
      imgthumb: fav.mixtape.imgthumb,
      unique: fav.mixtape.unique,
      djName: fav.mixtape.user?.djName || "Unknown DJ",
    }));

    return new NextResponse(JSON.stringify({
      favorites: transformedFavorites,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
