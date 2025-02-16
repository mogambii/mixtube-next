import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const encodedEmail = req.nextUrl.searchParams.get("email");
    const email = decodeURIComponent(encodedEmail).replace(/\+/g, "+");

    const userId = await prisma.user.findUnique({
      where: {
        email: email,
      },
    }).then((user) => {
      if (!user) {
        console.error("User not found");
        return null;
      }
      return user.id;
    });

    console.log("userId", userId, "mixtapeId", id, "email", email);

    if (!userId) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const mixtapeId = await prisma.mixtape.findUnique({
      where: {
        unique: id,
      },
    }).then((mixtape) => {
      if (!mixtape) {
        console.error("Mixtape not found");
        return null;
      }
      return mixtape.id;
    });

    if (!mixtapeId) {
      return NextResponse.json(
        { error: "Mixtape not found" },
        { status: 404 }
      );
    }

    const like = await prisma.mixtapeLike.findFirst({
      where: {
        mixtapeId: mixtapeId,
        userId: userId,
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      { error: "Failed to check like status" },
      { status: 500 }
    );
  }
}
