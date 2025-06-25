"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";
import { useSession } from "next-auth/react";

export default function NotificationIcon() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!session) return;
    
    try {
      setIsLoading(true);
      const response = await fetch("/api/notifications/count");
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [session, fetchUnreadCount]);

  // Listen for custom events to update count (e.g., when user follows/likes)
  useEffect(() => {
    const handleNotificationUpdate = () => {
      fetchUnreadCount();
    };

    window.addEventListener('notification-update', handleNotificationUpdate);
    return () => window.removeEventListener('notification-update', handleNotificationUpdate);
  }, [fetchUnreadCount]);

  return (
    <div className="flex items-center gap-4">
      {session && (
        <Link
          href="/notifications"
          className="relative flex items-center text-lg text-gray-800 dark:text-slate-100 hover:text-primary transition-colors group"
        >
          <FaBell 
            className={`flex items-center justify-center transition-transform group-hover:scale-110 ${
              isLoading ? 'animate-pulse' : ''
            }`} 
            size={20} 
          />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-bounce">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
