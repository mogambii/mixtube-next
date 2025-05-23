import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists before deleting
    const user = await prisma.User.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
      // Delete associated data one by one
      // 1. Delete sessions
      await prisma.Session.deleteMany({
        where: { userId: user.id },
      });

      // 2. Delete accounts (OAuth connections)
      await prisma.Account.deleteMany({
        where: { userId: user.id },
      });

      // 3. Delete notifications
      await prisma.Notification.deleteMany({
        where: {
          OR: [
            { userId: user.id },
            { senderId: user.id }
          ]
        },
      });

      // 4. Delete follows
      await prisma.Follower.deleteMany({
        where: {
          OR: [
            { followerId: user.id },
            { followingId: user.id }
          ]
        },
      });

      // 5. Delete mixtape likes
      await prisma.MixtapeLike.deleteMany({
        where: { userId: user.id },
      });

      // 6. Delete comments
      await prisma.Comment.deleteMany({
        where: { userId: user.id },
      });

      // 7. Finally delete the user
      await prisma.User.delete({
        where: { id: user.id },
      });

      return NextResponse.json({ message: "Account deleted successfully" });
    } catch (deleteError) {
      console.error("Error during deletion:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete account: " + deleteError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account: " + error.message },
      { status: 500 }
    );
  }
}
