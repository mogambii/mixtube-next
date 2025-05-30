import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { djusername } = await request.json();
    const useremail = session.user.email;

    const lowercase_djemail = await prisma.user
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
      prisma.user.findUnique({ where: { email: useremail } }),
      prisma.user.findUnique({ where: { email: lowercase_djemail } }),
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
      message: `${follower.username} has unfollowed ${following.username}`,
    });
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
