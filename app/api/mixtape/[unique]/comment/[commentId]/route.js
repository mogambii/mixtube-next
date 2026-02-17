import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

// Delete comment
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Please login to delete comments" }, { status: 401 });
    }

    const { commentId } = await params;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        mixtape: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // Check if the user owns the comment or is the mixtape owner
    if (comment.userId !== session.user.id && comment.mixtape.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized to delete this comment" }, { status: 403 });
    }

    // Delete the comment and related notification in a transaction
    await prisma.$transaction([
      prisma.comment.delete({
        where: { id: commentId },
      }),
      prisma.notification.deleteMany({
        where: {
          type: "COMMENT",
          mixtapeId: comment.mixtapeId,
          senderId: comment.userId,
        },
      }),
    ]);

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Comment not found or already deleted" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to delete comment. Please try again later." },
      { status: 500 }
    );
  }
}
