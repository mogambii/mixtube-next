import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    // Find valid reset token
    const resetToken = await prisma.resetToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
    });

    
    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.passwordReset.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
