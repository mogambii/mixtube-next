import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const djusername = searchParams.get("djusername").toLowerCase();
    const email = searchParams.get("email").toLowerCase();

    if (!djusername || !email) {
      return NextResponse.json(
        { error: "Both username and djusername parameters are required" },
        { status: 400 }
      );
    }

    // Get both users
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username: djusername } }),
    ]);

    if (!follower || !following) {
      return NextResponse.json(
        { error: "One or both users not found" },
        { status: 404 }
      );
    }

    // Check if following relationship exists
    const follow = await prisma.follower.findFirst({
      where: {
        followerId: follower.id,
        followingId: following.id,
      },
    });

    return NextResponse.json({
      isFollowing: !!follow,
      follower: { id: follower.id, username: follower.username },
      following: { id: following.id, username: following.username },
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
