import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/jwt";

// Add like
export async function POST(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const userId = decoded.id;

    // Check if like already exists
    const existingLike = await prisma.mixtapeLike.findFirst({
      where: {
        mixtapeId: id,
        userId: userId,
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }

    // Create new like
    await prisma.mixtapeLike.create({
      data: {
        mixtapeId: id,
        userId: userId,
      },
    });

    return NextResponse.json({ message: "Liked successfully" });
  } catch (error) {
    console.error("Error adding like:", error);
    return NextResponse.json(
      { error: "Failed to add like" },
      { status: 500 }
    );
  }
}

// Remove like
export async function DELETE(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const userId = decoded.id;

    // Delete like
    await prisma.mixtapeLike.deleteMany({
      where: {
        mixtapeId: id,
        userId: userId,
      },
    });

    return NextResponse.json({ message: "Unliked successfully" });
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json(
      { error: "Failed to remove like" },
      { status: 500 }
    );
  }
}
