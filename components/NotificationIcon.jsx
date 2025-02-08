"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";
import { useSession } from "next-auth/react";

export default function NotificationIcon() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications", {
          method: 'HEAD'
        });
        if (response.ok) {
          const count = parseInt(response.headers.get('X-Unread-Count') || '0');
          setUnreadCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    if (session) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [session]);

  return (
    <div className="flex items-center gap-4">
      {session && (
        <Link
          href="/notifications"
          className="relative flex items-center text-lg text-gray-800 dark:text-slate-100 hover:text-primary transition-colors"
        >
          <FaBell className="flex items-center justify-center" size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
