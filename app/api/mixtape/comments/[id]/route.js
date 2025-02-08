import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

// Delete a comment
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Please login to delete comment" }, { status: 401 });
    }

    const { id } = params;

    // Get the comment
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        mixtape: true
      }
    });

    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // Check if user owns the comment or the mixtape
    if (comment.userId !== session.user.id && comment.mixtape.userId !== session.user.id) {
      return NextResponse.json({ message: "Not authorized to delete this comment" }, { status: 403 });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ message: "Error deleting comment" }, { status: 500 });
  }
}
