import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { sendEmail } from "@/lib/email";

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

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
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
        username,
        password: hashedPassword,
        type: "user",
      },
    });

    await sendEmail({
      to: email,
      subject: "Welcome to MixTube!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                font-family: Arial, sans-serif;
                color: #333;
                padding: 20px;
              }
              .header {
                background-color: #4F46E5;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #e5e7eb;
                border-radius: 0 0 8px 8px;
              }
              .button {
                display: inline-block;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                color: #6B7280;
                font-size: 0.875rem;
                margin-top: 20px;
              }
              .feature-list {
                margin: 20px 0;
                padding-left: 20px;
              }
              .feature-list li {
                margin: 10px 0;
                color: #4B5563;
              }
              .welcome-message {
                font-size: 1.1rem;
                color: #1F2937;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Welcome to MixTube! 🎵</h1>
              </div>
              <div class="content">
                <p>Hi ${username},</p>
                <p class="welcome-message">Thank you for joining MixTube! We're thrilled to have you as part of our community.</p>
                <p>Here's what you can do with your new account:</p>
                <ul class="feature-list">
                  <li>Create and customize your DJ profile</li>
                  <li>Upload and share your favorite mixtapes</li>
                  <li>Follow other DJs and music enthusiasts</li>
                  <li>Build your own music community</li>
                </ul>
                <a href="${process.env.NEXTAUTH_URL}/login" class="button">Login to Your Account</a>
                <p style="color: #6B7280; font-size: 0.875rem;">
                  Ready to start your musical journey? Click the button above to begin!
                </p>
              </div>
              <div class="footer">
                <p>This email was sent by MixTube. Please do not reply to this email.</p>
                <p style="font-size: 0.75rem; color: #9CA3AF;">
                  You're receiving this email because you recently created a new MixTube account.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again later." },
      { status: 500 }
    );
  }
}
