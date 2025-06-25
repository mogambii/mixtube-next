import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { createFollowNotification } from "@/lib/notifications";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { djusername } = await request.json();
    const lowercase_email = await prisma.user
      .findUnique({ where: { email: session.user.email } })
      .then((user) => {
        if (!user) {
          console.error("User not found");
          return null;
        }
        return user.email.toLowerCase();
      });
    const djemail = await prisma.user
      .findUnique({ where: { username: djusername } })
      .then((user) => {
        if (!user) {
          console.error("User not found");
          return null;
        }
        return user.email.toLowerCase();
      });
    if (!djusername) {
      return NextResponse.json(
        { error: "djusername is required" },
        { status: 400 }
      );
    }

    // Get both users
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ where: { email: lowercase_email } }),
      prisma.user.findUnique({ where: { email: djemail } }),
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

    // Create notification for the user being followed
    await createFollowNotification(follower.id, following.id);

    return NextResponse.json({
      success: true,
      follow,
      message: `${follower.username} is now following ${following.username}`,
    });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
