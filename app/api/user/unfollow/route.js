import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request) {
  try {
    const { username, djusername } = await request.json();
    
    if (!username || !djusername) {
      return NextResponse.json(
        { error: "Both username and djusername are required" },
        { status: 400 }
      );
    }

    // Get both users
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ where: { username } }),
      prisma.user.findUnique({ where: { username: djusername } })
    ]);

    if (!follower || !following) {
      return NextResponse.json(
        { error: "One or both users not found" },
        { status: 404 }
      );
    }

    // Delete the follow relationship
    const deletedFollow = await prisma.follower.deleteMany({
      where: {
        followerId: follower.id,
        followingId: following.id,
      },
    });

    if (deletedFollow.count === 0) {
      return NextResponse.json(
        { error: "Follow relationship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `${username} has unfollowed ${djusername}`
    });
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
