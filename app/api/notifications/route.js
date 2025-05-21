import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
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

    // Get notifications with valid senders
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        sender: {
          select: {
            username: true,
            djName: true,
            profilep: true,
          },
        },
        mixtape: {
          select: {
            title: true,
            unique: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
    // console.log(notifications);
    // Get total count of valid notifications
    const totalCount = await prisma.notification.count({
      where: {
        userId,
      },
    });

    // Mark fetched notifications as read
    if (notifications.length > 0) {
      await prisma.notification.updateMany({
        where: {
          id: { in: notifications.map((n) => n.id) },
          read: false,
        },
        data: { read: true },
      });
    }

    return new NextResponse(
      JSON.stringify({
        notifications,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
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

// Mark notification as read/unread
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const { id, read } = await request.json();

    const notification = await prisma.notification.update({
      where: {
        id,
        userId,
      },
      data: { read },
    });

    return new NextResponse(JSON.stringify(notification), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
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
