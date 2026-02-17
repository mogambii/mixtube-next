import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(req, { params }) {
  try {
    const { username } = await params;

    // Get the DJ's profile with counts
    const djProfile = await prisma.user.findUnique({
      where: { username },
      include: {
        followedBy: true,
        following: true,
        _count: {
          select: {
            mixtapes: true
          }
        }
      }
    });

    if (!djProfile) {
      return NextResponse.json({ message: "DJ not found" }, { status: 404 });
    }

    // Get total downloads and plays from stats
    const stats = await prisma.stats.groupBy({
      by: ['mixtapeId'],
      where: {
        mixtape: {
          userId: djProfile.id
        }
      },
      _sum: {
        downloads: true,
        plays: true,
      }
    });

    // Calculate totals
    const totalStats = stats.reduce((acc, curr) => ({
      downloads: (acc.downloads || 0) + (curr._sum.downloads || 0),
      plays: (acc.plays || 0) + (curr._sum.plays || 0)
    }), { downloads: 0, plays: 0 });

    // Format the response
    const response = {
      id: djProfile.id,
      username: djProfile.username,
      djName: djProfile.djName,
      profilep: djProfile.profilep,
      bio: djProfile.bio,
      createdAt: djProfile.createdAt,
      totalMixtapes: djProfile._count.mixtapes,
      totalFollowers: djProfile.followedBy.length,
      totalFollowing: djProfile.following.length,
      totalDownloads: totalStats.downloads,
      totalPlays: totalStats.plays,
      contacts: djProfile.contacts,
      socialMediaHandles: djProfile.socialMediaHandles
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching DJ profile:", error);
    return NextResponse.json(
      { message: "Error fetching DJ profile" },
      { status: 500 }
    );
  }
}
