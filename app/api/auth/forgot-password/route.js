import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      );
    }

    // Check if user has a password (is not a social login only account)
    if (!user.password) {
      return NextResponse.json(
        { error: "This account does not use password authentication" },
        { status: 400 }
      );
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min from now

    // Save reset token
    await prisma.resetToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Reset Your MixTube Password",
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
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your MixTube password. If you didn't make this request, you can safely ignore this email.</p>
                <p>To reset your password, click the button below:</p>
                <a href="${resetUrl}" class="button">Reset My Password</a>
                <p style="color: #6B7280; font-size: 0.875rem;">
                  This link will expire in 15 minutes for security reasons.
                </p>
                <p style="color: #6B7280; font-size: 0.875rem;">
                  If the button above doesn't work, you can copy and paste this URL into your browser:<br>
                  <span style="color: #4F46E5;">${resetUrl}</span>
                </p>
              </div>
              <div class="footer">
                <p>This email was sent by MixTube. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset" },
      { status: 500 }
    );
  }
}
