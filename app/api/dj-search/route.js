import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query") || "";
  const sort = searchParams.get("sort") || "name";
  const filter = searchParams.get("filter") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  // Validate pagination parameters
  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(Math.max(1, limit), 100); // Cap at 100
  const skip = (validatedPage - 1) * validatedLimit;

  try {
    // Build where clause based on filter
    let whereClause = {
      type: { in: ["DJ", "dj", "Dj"] }, // Filter for DJ users only (case insensitive)
    };

    // Enhanced search query with case-insensitive matching
    if (query && query.trim()) {
      const searchTerm = query.trim();
      whereClause = {
        AND: [
          { type: { in: ["DJ", "dj", "Dj"] } },
          {
            OR: [
              {
                username: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                djName: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                bio: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      };
    }

    // Determine sort order
    let orderBy = {};

    // Apply filter-based sorting
    if (filter === "new") {
      orderBy = { createdAt: "desc" };
    } else if (filter === "popular") {
      // Use sort parameter for popular filter
      orderBy = getOrderByClause(sort);
    } else {
      // Default: use sort parameter
      orderBy = getOrderByClause(sort);
    }

    // Execute Prisma query with optimized selection
    const results = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        profilep: true,
        djName: true,
        name: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            followedBy: true,
            mixtapes: true,
            likedMixtapes: true,
          },
        },
      },
      skip: skip,
      take: validatedLimit,
      orderBy: orderBy,
    });

    // Get total count for pagination
    const totalResults = await prisma.user.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalResults / validatedLimit);

    // Transform results to include computed fields
    const transformedResults = results.map((dj) => ({
      id: dj.id,
      username: dj.username,
      profilep: dj.profilep,
      djName: dj.djName || dj.name || "Unknown DJ",
      bio: dj.bio,
      createdAt: dj.createdAt,
      followers: dj._count.followedBy,
      mixtapesCount: dj._count.mixtapes,
      likesReceived: dj._count.likedMixtapes,
      // Popularity score (can be used for trending)
      popularityScore: calculatePopularityScore(dj._count),
    }));

    const response = {
      success: true,
      results: transformedResults,
      pagination: {
        currentPage: validatedPage,
        totalPages,
        totalResults,
        limit: validatedLimit,
        hasNextPage: validatedPage < totalPages,
        hasPreviousPage: validatedPage > 1,
      },
      filters: {
        query: query.trim(),
        sort,
        filter,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("DJ Search Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search DJs",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to determine order by clause
function getOrderByClause(sort) {
  switch (sort) {
    case "name":
      return { djName: "asc" };
    case "followers":
      return { followedBy: { _count: "desc" } };
    case "popular":
      // Sort by total mixtapes count
      return { mixtapes: { _count: "desc" } };
    case "recent":
      return { createdAt: "desc" };
    case "active":
      // Most recently updated profiles
      return { updatedAt: "desc" };
    default:
      return { djName: "asc" };
  }
}

// Calculate popularity score based on engagement metrics
function calculatePopularityScore(counts) {
  const { followedBy = 0, mixtapes = 0, likedMixtapes = 0 } = counts;

  // Weighted popularity score
  // Followers: 3x weight, Mixtapes: 2x weight, Likes: 1x weight
  return followedBy * 3 + mixtapes * 2 + likedMixtapes * 1;
}
