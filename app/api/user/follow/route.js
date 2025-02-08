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

    // Check if already following
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: follower.id,
        followingId: following.id,
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      );
    }

    // Create follow relationship
    const follow = await prisma.follower.create({
      data: {
        followerId: follower.id,
        followingId: following.id,
      },
    });

    return NextResponse.json({ 
      success: true,
      follow,
      message: `${username} is now following ${djusername}`
    });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
