import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

// Add comment
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Please login to comment" }, { status: 401 });
    }

    const { unique } = await params;
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 });
    }

    // Get the actual user from DB using email (session.user.id may be Google's sub ID, not the DB CUID)
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get mixtape ID from unique identifier
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique },
    });

    if (!mixtape) {
      return NextResponse.json({ message: "Mixtape not found" }, { status: 404 });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        mixtapeId: mixtape.id,
        userId: dbUser.id,
      },
      include: {
        user: {
          select: {
            username: true,
            djName: true,
            profilep: true,
            id: true,
          },
        },
      },
    });

    // Create notification for mixtape owner
    if (mixtape.userId !== dbUser.id) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          message: `${session.user.username || session.user.email} commented on your mixtape "${mixtape.title}"`,
          userId: mixtape.userId,
          senderId: dbUser.id,
          mixtapeId: mixtape.id,
        },
      });
    }

    return NextResponse.json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "You've already commented on this mixtape" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to add comment. Please try again later." },
      { status: 500 }
    );
  }
}
