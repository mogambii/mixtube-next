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
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [session, fetchUnreadCount]);

  useEffect(() => {
    const handleNotificationUpdate = () => {
      fetchUnreadCount();
    };

    window.addEventListener('notification-update', handleNotificationUpdate);
    return () => window.removeEventListener('notification-update', handleNotificationUpdate);
  }, [fetchUnreadCount]);

  if (!session) return null;

  return (
    <Link
      href="/notifications"
      className="relative p-1.5 sm:p-2 flex items-center justify-center text-gray-800 dark:text-slate-100 hover:text-primary transition-colors group rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
      aria-label="Notifications"
    >
      <FaBell 
        className={`transition-transform group-hover:scale-110 ${
          isLoading ? 'animate-pulse' : ''
        }`} 
        size={17} 
      />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 sm:h-4.5 sm:w-4.5 flex items-center justify-center font-bold animate-bounce leading-none">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
