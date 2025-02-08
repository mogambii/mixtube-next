import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const email = req.nextUrl.searchParams.get("email");

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
