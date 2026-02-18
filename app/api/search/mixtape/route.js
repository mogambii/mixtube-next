import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const query = (searchParams.get("query") || "").trim();
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
      50,
    );
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const sortBy = searchParams.get("sort") || "popular";
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json({
        success: true,
        results: [],
        query: "",
        count: 0,
      });
    }

    const tokens = query
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]+/gu, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const buildFieldOr = (term) => [
      { title: { contains: term, mode: "insensitive" } },
      { djName: { contains: term, mode: "insensitive" } },
      { genre: { contains: term, mode: "insensitive" } },
      { desc: { contains: term, mode: "insensitive" } },
    ];

    const where =
      tokens.length <= 1
        ? { OR: buildFieldOr(tokens[0] ?? query) }
        : { AND: tokens.map((token) => ({ OR: buildFieldOr(token) })) };

    const mixtapes = await prisma.mixtape.findMany({
      where,
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
      orderBy: getSortOrder(sortBy),
      take: limit,
      skip,
    });

    const results = mixtapes
      .map((m) => ({
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
        user: m.user
          ? {
              username: m.user.username,
              profilePicture: m.user.profilep,
              djName: m.user.djName,
            }
          : null,
        relevanceScore: calculateRelevanceScore(m, tokens, query),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return NextResponse.json({
      success: true,
      results,
      query,
      count: results.length,
      page,
      limit,
      sortBy,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search mixtapes",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

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

function calculateRelevanceScore(mixtape, tokens, originalQuery) {
  let score = 0;
  const q = originalQuery.toLowerCase();
  const title = (mixtape.title || "").toLowerCase();
  const djName = (mixtape.djName || "").toLowerCase();
  const genre = (mixtape.genre || "").toLowerCase();
  const desc = (mixtape.desc || "").toLowerCase();

  if (title === q) score += 100;
  if (djName === q) score += 80;
  if (genre === q) score += 60;

  if (title.startsWith(q)) score += 50;
  if (djName.startsWith(q)) score += 40;

  tokens.forEach((t) => {
    if (title.includes(t)) score += 10;
    if (djName.includes(t)) score += 8;
    if (genre.includes(t)) score += 5;
    if (desc.includes(t)) score += 3;
  });

  score += Math.log10((mixtape.totalPlays || 0) + 1) * 2;
  score += Math.log10((mixtape.totalLikes || 0) + 1) * 1.5;
  score += Math.log10((mixtape.totalDownloads || 0) + 1);

  return score;
}
