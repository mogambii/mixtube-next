import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { checkAndCreateMilestoneNotification } from "@/lib/notifications";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mixtapeId } = await request.json();

    if (!mixtapeId) {
      return NextResponse.json(
        { error: "Mixtape ID is required" },
        { status: 400 }
      );
    }

    // Get the mixtape with current stats
    const mixtape = await prisma.mixtape.findUnique({
      where: { id: mixtapeId },
      select: {
        id: true,
        title: true,
        totalPlays: true,
        totalDownloads: true,
        userId: true,
      },
    });

    if (!mixtape) {
      return NextResponse.json(
        { error: "Mixtape not found" },
        { status: 404 }
      );
    }

    // Check if the user owns this mixtape
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (mixtape.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only check milestones for your own mixtapes" },
        { status: 403 }
      );
    }

    // Check for play milestones
    if (mixtape.totalPlays > 0) {
      await checkAndCreateMilestoneNotification(
        mixtape.id,
        'plays',
        mixtape.totalPlays
      );
    }

    // Check for download milestones
    if (mixtape.totalDownloads > 0) {
      await checkAndCreateMilestoneNotification(
        mixtape.id,
        'downloads',
        mixtape.totalDownloads
      );
    }

    return NextResponse.json({
      message: "Milestone check completed",
      mixtape: {
        title: mixtape.title,
        totalPlays: mixtape.totalPlays,
        totalDownloads: mixtape.totalDownloads,
      },
    });
  } catch (error) {
    console.error("Error checking milestones:", error);
    return NextResponse.json(
      { error: "Failed to check milestones" },
      { status: 500 }
    );
  }
}

// Bulk check milestones for all mixtapes (admin only)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you can modify this logic based on your admin system)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { type: true },
    });

    if (user?.type !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all mixtapes with their stats
    const mixtapes = await prisma.mixtape.findMany({
      select: {
        id: true,
        title: true,
        totalPlays: true,
        totalDownloads: true,
      },
    });

    let notificationsCreated = 0;

    // Check milestones for each mixtape
    for (const mixtape of mixtapes) {
      if (mixtape.totalPlays > 0) {
        await checkAndCreateMilestoneNotification(
          mixtape.id,
          'plays',
          mixtape.totalPlays
        );
        notificationsCreated++;
      }

      if (mixtape.totalDownloads > 0) {
        await checkAndCreateMilestoneNotification(
          mixtape.id,
          'downloads',
          mixtape.totalDownloads
        );
        notificationsCreated++;
      }
    }

    return NextResponse.json({
      message: "Bulk milestone check completed",
      mixtapesChecked: mixtapes.length,
      notificationsCreated,
    });
  } catch (error) {
    console.error("Error in bulk milestone check:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk milestone check" },
      { status: 500 }
    );
  }
} 