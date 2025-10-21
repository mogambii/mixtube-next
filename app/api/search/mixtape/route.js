import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getDb from "@/util/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const rawQuery = searchParams.get("query") || "";
    const query = rawQuery.trim();
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = searchParams.get("sort") || "popular"; // popular, recent, downloads

    // Return empty array for empty queries
    if (!query) {
      return NextResponse.json(
        {
          success: true,
          results: [],
          query: "",
          count: 0,
        },
        { status: 200 }
      );
    }

    // Tokenize the search query
    const tokens = query
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .split(/\s+/)
      .filter(Boolean);

    // Validate limit
    const validatedLimit = Math.min(Math.max(1, limit), 50);

    // Determine sort order
    const orderBy = getSortOrder(sortBy);

    // Build search conditions with case-insensitive mode
    const searchConditions = buildSearchConditions(tokens, query);

    // Execute Prisma query with enhanced selection
    let mixtapes = await prisma.mixtape.findMany({
      where: searchConditions,
      select: {
        id: true,
        title: true,
        djName: true,
        unique: true,
        imgthumb: true,
        genre: true,
        desc: true,
        totalPlays: true,
        totalDownloads: true,
        totalLikes: true,
        time: true,
        user: {
          select: {
            username: true,
            profilep: true,
            djName: true,
          },
        },
      },
      orderBy: orderBy,
      take: validatedLimit,
    });

    // Fallback to MongoDB regex search if Prisma returns no results
    if (!mixtapes || mixtapes.length === 0) {
      mixtapes = await fallbackMongoSearch(
        tokens,
        query,
        validatedLimit,
        sortBy
      );
    }

    // Transform and enrich results
    const results = (mixtapes || []).map((m) => ({
      id: m.id,
      title: m.title,
      djName: m.djName || m.user?.djName || "Unknown DJ",
      unique: m.unique,
      imgthumb: m.imgthumb || "",
      genre: m.genre,
      description: m.desc,
      totalPlays: m.totalPlays || 0,
      totalDownloads: m.totalDownloads || 0,
      totalLikes: m.totalLikes || 0,
      date: m.time,
      // Include user info if available
      user: m.user
        ? {
            username: m.user.username,
            profilePicture: m.user.profilep,
            djName: m.user.djName,
          }
        : null,
      // Calculate relevance score
      relevanceScore: calculateRelevanceScore(m, tokens, query),
    }));

    // Sort by relevance if we have tokens (multi-word search)
    const finalResults =
      tokens.length > 1
        ? results.sort((a, b) => b.relevanceScore - a.relevanceScore)
        : results;

    return NextResponse.json(
      {
        success: true,
        results: finalResults,
        query: query,
        count: finalResults.length,
        limit: validatedLimit,
        sortBy: sortBy,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mixtape Search Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search mixtapes",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Build Prisma search conditions
function buildSearchConditions(tokens, originalQuery) {
  if (tokens.length > 0) {
    // Multi-token search: all tokens must match
    return {
      AND: tokens.map((token) => ({
        OR: [
          { title: { contains: token, mode: "insensitive" } },
          { djName: { contains: token, mode: "insensitive" } },
          { genre: { contains: token, mode: "insensitive" } },
          { desc: { contains: token, mode: "insensitive" } },
        ],
      })),
    };
  } else {
    // Single term search
    return {
      OR: [
        { title: { contains: originalQuery, mode: "insensitive" } },
        { djName: { contains: originalQuery, mode: "insensitive" } },
        { genre: { contains: originalQuery, mode: "insensitive" } },
        { desc: { contains: originalQuery, mode: "insensitive" } },
      ],
    };
  }
}

// Fallback MongoDB regex search
async function fallbackMongoSearch(tokens, query, limit, sortBy) {
  try {
    const db = await getDb();
    const searchTerms = tokens.length > 0 ? tokens : [query.toLowerCase()];

    const buildRegexConditions = (term) => [
      { title: { $regex: term, $options: "i" } },
      { djName: { $regex: term, $options: "i" } },
      { genre: { $regex: term, $options: "i" } },
      { desc: { $regex: term, $options: "i" } },
    ];

    // Determine sort for MongoDB
    let mongoSort = { totalPlays: -1, time: -1 };
    if (sortBy === "recent") {
      mongoSort = { time: -1, totalPlays: -1 };
    } else if (sortBy === "downloads") {
      mongoSort = { totalDownloads: -1, time: -1 };
    }

    const docs = await db
      .collection("Mixtape")
      .aggregate([
        {
          $match: {
            $and: searchTerms.map((term) => ({
              $or: buildRegexConditions(term),
            })),
          },
        },
        {
          $project: {
            title: 1,
            djName: 1,
            unique: 1,
            imgthumb: 1,
            genre: 1,
            desc: 1,
            totalPlays: 1,
            totalDownloads: 1,
            totalLikes: 1,
            time: 1,
            userId: 1,
          },
        },
        { $sort: mongoSort },
        { $limit: limit },
      ])
      .toArray();

    return docs;
  } catch (error) {
    console.error("MongoDB fallback search error:", error);
    return [];
  }
}

// Determine sort order based on parameter
function getSortOrder(sortBy) {
  switch (sortBy) {
    case "recent":
      return [{ time: "desc" }, { totalPlays: "desc" }];
    case "downloads":
      return [{ totalDownloads: "desc" }, { time: "desc" }];
    case "likes":
      return [{ totalLikes: "desc" }, { time: "desc" }];
    case "popular":
    default:
      return [{ totalPlays: "desc" }, { time: "desc" }];
  }
}

// Calculate relevance score for ranking results
function calculateRelevanceScore(mixtape, tokens, originalQuery) {
  let score = 0;
  const queryLower = originalQuery.toLowerCase();
  const title = (mixtape.title || "").toLowerCase();
  const djName = (mixtape.djName || "").toLowerCase();
  const genre = (mixtape.genre || "").toLowerCase();
  const desc = (mixtape.desc || "").toLowerCase();

  // Exact matches get highest scores
  if (title === queryLower) score += 100;
  if (djName === queryLower) score += 80;
  if (genre === queryLower) score += 60;

  // Starts with query
  if (title.startsWith(queryLower)) score += 50;
  if (djName.startsWith(queryLower)) score += 40;

  // Contains all tokens
  tokens.forEach((token) => {
    if (title.includes(token)) score += 10;
    if (djName.includes(token)) score += 8;
    if (genre.includes(token)) score += 5;
    if (desc.includes(token)) score += 3;
  });

  // Boost by engagement metrics (normalized)
  score += Math.log10((mixtape.totalPlays || 0) + 1) * 2;
  score += Math.log10((mixtape.totalLikes || 0) + 1) * 1.5;
  score += Math.log10((mixtape.totalDownloads || 0) + 1);

  return score;
}
