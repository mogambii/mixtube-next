import React from "react";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { redirect } from "next/navigation";
import NotificationsClient from "./NotificationsClient";

export const metadata = {
  title: "Notifications | mixtapped",
  description: "View your recent notifications on mixtapped.",
};

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const limit = 20;

  const [notifications, totalCount, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
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
      take: limit,
    }),
    prisma.notification.count({
      where: { userId: user.id },
    }),
    getUnreadNotificationCount(user.id),
  ]);

  const formattedNotifications = notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    message: notification.message,
    read: notification.read,
    createdAt: notification.createdAt,
    sender: notification.sender,
    mixtape: notification.mixtape,
  }));

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen rounded-3xl overflow-hidden">
      <NotificationsClient 
        initialNotifications={formattedNotifications} 
        initialUnreadCount={unreadCount} 
        totalCount={totalCount} 
      />
    </div>
  );
}
