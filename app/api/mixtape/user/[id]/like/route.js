import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Add like
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Please login to like mixtapes" },
        { status: 401 }
      );
    }

    const { id } = params;
    const userId = session.user.id;

    const mixtapeId = await prisma.mixtape
      .findUnique({
        where: {
          unique: id,
        },
      })
      .then((mixtape) => {
        if (!mixtape) {
          console.error("Mixtape not found");
          return null;
        }
        return mixtape.id;
      });

    // Check if like already exists
    const existingLike = await prisma.mixtapeLike.findFirst({
      where: {
        mixtapeId: mixtapeId,
        userId: userId,
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { message: "Mixtape already in favorites" },
        { status: 400 }
      );
    }

    //increment total likes
    // Increment total plays
    await prisma.mixtape.update({
      where: { id: mixtapeId },
      data: {
        totalLikes: {
          increment: 1,
        },
      },
    });

    // Create new like
    await prisma.mixtapeLike.create({
      data: {
        mixtapeId: mixtapeId,
        userId: userId,
      },
    });

    return NextResponse.json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Error adding like:", error);
    return NextResponse.json(
      { message: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

// Remove like
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Please login to unlike mixtapes" },
        { status: 401 }
      );
    }

    const { id } = params;
    const userId = session.user.id;

    const mixtapeId = await prisma.mixtape
      .findUnique({
        where: {
          unique: id,
        },
      })
      .then((mixtape) => {
        if (!mixtape) {
          console.error("Mixtape not found");
          return null;
        }
        return mixtape.id;
      });

    // Find and delete the like
    const deletedLike = await prisma.mixtapeLike.deleteMany({
      where: {
        mixtapeId: mixtapeId,
        userId: userId,
      },
    });

    // Decrement total plays by 1
    await prisma.mixtape.update({
      where: { id: mixtapeId },
      data: {
        totalLikes: {
          decrement: 1,
        },
      },
    });

    if (deletedLike.count === 0) {
      return NextResponse.json(
        { message: "Mixtape not in favorites" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json(
      { message: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
