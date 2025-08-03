import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { sendEmailResend } from "@/lib/resend";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email, username, or password" },
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
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (formattedUsername.length > 30) {
      return NextResponse.json(
        { error: "Username must be less than 30 characters" },
        { status: 400 }
      );
    }

    // Check if username starts with a letter or number
    if (!/^[a-z0-9]/.test(formattedUsername)) {
      return NextResponse.json(
        { error: "Username must start with a letter or number" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: formattedUsername }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            existingUser.email === email
              ? "Email already registered"
              : "Username already taken",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username: formattedUsername,
        password: hashedPassword,
        type: "user",
      },
    });

    // Send welcome email
    await sendEmailResend({
      to: email,
      subject: "Welcome to MixTapped!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Welcome to MixTapped!</h1>
          <p>Hi there!</p>
          <p>Thank you for joining MixTapped! We're excited to have you as part of our community.</p>
          <p>Your account has been successfully created with the username: <strong>${formattedUsername}</strong></p>
          <p>You can now:</p>
          <ul>
            <li>Discover amazing mixtapes from talented DJs</li>
            <li>Create playlists of your favorite tracks</li>
            <li>Follow your favorite artists</li>
            <li>Share music with friends</li>
          </ul>
          <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
          <p>Happy listening!</p>
          <p>The MixTapped Team</p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: user.id, email: user.email, username: user.username },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
