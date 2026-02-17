import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { createCommentNotification } from "@/lib/notifications";

// Add a comment
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Please login to comment" }, { status: 401 });
    }

    const { unique } = await params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ message: "Comment content is required" }, { status: 400 });
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
        content,
        mixtapeId: mixtape.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    });

    // Create notification for the mixtape owner
    await createCommentNotification(session.user.id, mixtape.id, content);

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ message: "Error adding comment" }, { status: 500 });
  }
}

// Get comments for a mixtape
export async function GET(req, { params }) {
  try {
    const { unique } = await params;

    // Get mixtape ID from unique identifier
    const mixtape = await prisma.mixtape.findUnique({
      where: { unique },
    });

    if (!mixtape) {
      return NextResponse.json({ message: "Mixtape not found" }, { status: 404 });
    }

    // Get comments with user info
    const comments = await prisma.comment.findMany({
      where: {
        mixtapeId: mixtape.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ message: "Error fetching comments" }, { status: 500 });
  }
}
