import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {


    const { id } = params;
    const userId = req.nextUrl.searchParams.get('userId');

    const like = await prisma.mixtapeLike.findFirst({
      where: {
        mixtapeId: id,
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
