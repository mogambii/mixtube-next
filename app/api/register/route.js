import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return new NextResponse(
        "User with this email or username already exists",
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        type: "user" // Default type for all users
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
