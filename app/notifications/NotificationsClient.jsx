"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaEnvelopeOpen, FaEnvelope, FaHeart, FaUserPlus, FaComment, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

export default function NotificationsClient({ initialNotifications, initialUnreadCount, totalCount }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(totalCount > initialNotifications.length);
  const [actionLoading, setActionLoading] = useState(false);
  const { ref: loadMoreRef, inView } = useInView();

  const fetchMoreNotifications = async (nextPage) => {
    try {
      const response = await fetch(`/api/notifications?page=${nextPage}&limit=20`);
      const data = await response.json();
      
      if (response.ok) {
        return {
          newNotifications: data.notifications || [],
          hasNextPage: data.pagination?.hasNextPage || false
        };
      }
      return { newNotifications: [], hasNextPage: false };
    } catch (error) {
      console.error("Error fetching more notifications:", error);
      return { newNotifications: [], hasNextPage: false };
    }
  };

  useEffect(() => {
    const loadMore = async () => {
      if (inView && !loadingMore && hasMore) {
        setLoadingMore(true);
        const nextPage = page + 1;
        const { newNotifications, hasNextPage } = await fetchMoreNotifications(nextPage);
        
        if (newNotifications.length > 0) {
          setNotifications(prev => [...prev, ...newNotifications]);
          setPage(nextPage);
          setHasMore(hasNextPage);
        } else {
          setHasMore(false);
        }
        setLoadingMore(false);
      }
    };

    loadMore();
  }, [inView, loadingMore, hasMore, page]);

  const markAsRead = async (notificationIds) => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationIds: notificationIds,
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            notificationIds === "all"
              ? { ...n, read: true }
              : Array.isArray(notificationIds)
              ? (notificationIds.includes(n.id) ? { ...n, read: true } : n)
              : (n.id === notificationIds ? { ...n, read: true } : n)
          )
        );
        
        // Update unread count
        const updatedCount = notificationIds === "all"
          ? 0
          : Array.isArray(notificationIds)
          ? Math.max(0, unreadCount - notificationIds.length)
          : Math.max(0, unreadCount - 1);
        setUnreadCount(updatedCount);
        
        toast.success(notificationIds === "all" ? "All notifications marked as read" : "Notification marked as read");
        
        // Trigger notification icon update
        window.dispatchEvent(new Event('notification-update'));
      } else {
        toast.error("Failed to mark notification as read");
      }
    } catch (error) {
      toast.error("An error occurred while updating notification");
    } finally {
      setActionLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "FOLLOW":
        return <FaUserPlus className="h-4 w-4 text-blue-500" />;
      case "LIKE":
        return <FaHeart className="h-4 w-4 text-red-500" />;
      case "COMMENT":
        return <FaComment className="h-4 w-4 text-green-500" />;
      case "MILESTONE":
        return <span className="text-lg">🎉</span>;
      default:
        return <FaEnvelope className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "FOLLOW":
        return "border-blue-500/30 bg-blue-500/5";
      case "LIKE":
        return "border-red-500/30 bg-red-500/5";
      case "COMMENT":
        return "border-green-500/30 bg-green-500/5";
      case "MILESTONE":
        return "border-yellow-500/30 bg-yellow-500/5";
      default:
        return "border-white/20 dark:border-white/10 bg-white/40 dark:bg-gray-800/40";
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs sm:text-sm px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold shadow-sm">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAsRead("all")}
            disabled={actionLoading}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-xl text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-gray-700/60 shadow-sm transition-all duration-300 disabled:opacity-50"
          >
            <FaEnvelopeOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          <ul className="space-y-3 sm:space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`relative p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl transition-all duration-300 flex items-start gap-3 sm:gap-4 backdrop-blur-2xl ${
                  notification.read
                    ? "bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-white/10 shadow-sm opacity-80"
                    : `bg-white/70 dark:bg-gray-800/70 border border-white/40 dark:border-white/20 shadow-lg ${getNotificationColor(notification.type)}`
                } hover:shadow-xl group`}
              >
                {!notification.read && (
                  <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Link href={`/dj/${notification.sender?.username}`}>
                    <div className="relative group/avatar cursor-pointer">
                      <Image
                        priority={true}
                        src={optimizeCloudinaryUrl(notification.sender?.profilep) || "/default-avatar.png"}
                        alt={`${notification.sender?.username || "User"} avatar`}
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-md group-hover/avatar:ring-indigo-400 transition-colors duration-300"
                        height={56}
                        width={56}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 sm:p-1.5 shadow-sm ring-2 ring-white dark:ring-gray-900">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4 sm:pr-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs sm:text-sm md:text-base text-gray-800 dark:text-slate-200 leading-relaxed">
                      <Link href={`/dj/${notification.sender?.username}`}>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                          {notification.sender?.username}
                        </span>
                      </Link>{" "}
                      {notification.message.replace(
                        notification.sender?.username || "",
                        ""
                      )}
                    </p>
                    
                    {notification.mixtape && (
                      <Link
                        href={`/mix/${notification.mixtape.unique}`}
                        className="block group/link mt-2 sm:mt-3"
                      >
                        <div className="flex items-center space-x-2.5 sm:space-x-3 p-2.5 sm:p-3 bg-white/40 dark:bg-gray-700/40 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-gray-600/60 shadow-sm transition-colors duration-200">
                          {notification.mixtape.imgthumb && (
                            <Image
                              src={optimizeCloudinaryUrl(notification.mixtape.imgthumb)}
                              alt={notification.mixtape.title}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover shadow-sm flex-shrink-0"
                              height={40}
                              width={40}
                            />
                          )}
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover/link:text-indigo-500 transition-colors">
                            {notification.mixtape.title}
                          </span>
                        </div>
                      </Link>
                    )}
                    
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleString(undefined, { 
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 sm:p-2.5 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-white/40 dark:border-white/10 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      aria-label="Mark as read"
                      title="Mark as read"
                      disabled={actionLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Infinite Scroll Loader */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center pt-6 sm:pt-8 pb-8 sm:pb-10">
              {loadingMore ? (
                <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-full shadow-lg">
                  <FaSpinner className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Loading more...</span>
                </div>
              ) : (
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-full shadow-lg">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Scroll for more</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-8 sm:p-12 rounded-3xl max-w-md w-full border border-white/20 dark:border-white/10 shadow-lg">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200/50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              When you receive notifications about follows, likes, or comments, they&apos;ll appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
