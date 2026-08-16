import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");
    const email = emailParam || session?.user?.email;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First get the user's ID
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the user's following list with pagination
    const following = await prisma.follower.findMany({
      where: { followerId: user.id },
      skip,
      take: limit,
      select: {
        following: {
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            image: true,
            profilep: true,
            type: true,
            djName: true,
          },
        },
      },
    });

    // Transform the data to match the expected format
    const users = following.map((f) => f.following);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching following list:", error);
    return NextResponse.json(
      { error: "Failed to fetch following list" },
      { status: 500 }
    );
  }
}
