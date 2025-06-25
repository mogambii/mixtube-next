import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUnreadNotificationCount } from "@/lib/notifications";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const unreadOnly = searchParams.get("unread") === "true";
    const type = searchParams.get("type"); // Filter by notification type

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause = {
      userId: user.id,
      ...(unreadOnly && { read: false }),
      ...(type && { type }),
    };

    // Get notifications with sender and mixtape info
    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        include: {
          sender: {
            select: {
              username: true,
              profilep: true,
            },
          },
          mixtape: {
            select: {
              title: true,
              unique: true,
              imgthumb: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: whereClause,
      }),
      getUnreadNotificationCount(user.id),
    ]);

    // Format notifications for response
    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt,
      sender: notification.sender,
      mixtape: notification.mixtape,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      notifications: formattedNotifications,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Get unread notifications count
export async function HEAD(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(null, { status: 401 });
    }
    const email = session?.user?.email;
    const userId = await prisma.user
      .findUnique({ where: { email } })
      .then((user) => {
        if (!user) {
          console.error("User not found");
          return null;
        }
        return user.id;
      });

    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return new NextResponse(null, {
      status: 200,
      headers: {
        "X-Unread-Count": count.toString(),
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(null, { status: 500 });
  }
}

// Mark notifications as read
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationIds } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "Notification IDs array is required" },
        { status: 400 }
      );
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Mark notifications as read
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: user.id,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}

// Delete notification
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const id = request.nextUrl.searchParams.get("id");

    await prisma.notification.delete({
      where: {
        id,
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
