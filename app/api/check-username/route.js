import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Format username: lowercase, no spaces, only allowed characters
    const formattedUsername = username
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "") // Remove all spaces
      .replace(/[^a-z0-9._]/g, ""); // Only allow lowercase letters, numbers, dots, and underscores

    // Validate username format
    if (formattedUsername.length < 3) {
      return NextResponse.json(
        { 
          available: false, 
          error: "Username must be at least 3 characters long",
          formattedUsername 
        },
        { status: 200 }
      );
    }

    if (formattedUsername.length > 30) {
      return NextResponse.json(
        { 
          available: false, 
          error: "Username must be less than 30 characters",
          formattedUsername 
        },
        { status: 200 }
      );
    }

    // Check if username starts with a letter or number
    if (!/^[a-z0-9]/.test(formattedUsername)) {
      return NextResponse.json(
        { 
          available: false, 
          error: "Username must start with a letter or number",
          formattedUsername 
        },
        { status: 200 }
      );
    }

    // Check if username exists in database
    const existingUser = await prisma.user.findUnique({
      where: { username: formattedUsername },
      select: { id: true, username: true }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          available: false, 
          error: "Username is already taken",
          formattedUsername 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        available: true, 
        message: "Username is available",
        formattedUsername 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error checking username availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 