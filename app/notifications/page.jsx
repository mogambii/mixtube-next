"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrashAlt, FaEnvelopeOpen, FaEnvelope, FaHeart, FaUserPlus, FaComment } from "react-icons/fa";
import Spinner from "../(components)/Spinner";
import toast from "react-hot-toast";
import Image from "next/image";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(`/api/notifications?page=${page}&limit=20`);
        const data = await response.json();
        
        if (response.ok) {
          setNotifications(data.notifications || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setUnreadCount(data.unreadCount || 0);
          
          if (data.notifications.length === 0 && page > 1) {
            setPage(page - 1);
          }
        } else {
          setError(data.error || "Failed to load notifications");
        }
      } catch (error) {
        setError("An error occurred while fetching notifications");
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [page]);

  const markAsRead = async (notificationIds) => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds],
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            Array.isArray(notificationIds) 
              ? (notificationIds.includes(n.id) ? { ...n, read: true } : n)
              : (n.id === notificationIds ? { ...n, read: true } : n)
          )
        );
        
        // Update unread count
        const updatedCount = Array.isArray(notificationIds) 
          ? Math.max(0, unreadCount - notificationIds.length)
          : Math.max(0, unreadCount - 1);
        setUnreadCount(updatedCount);
        
        toast.success("Notification marked as read");
        
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
        return "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800";
      case "LIKE":
        return "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800";
      case "COMMENT":
        return "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800";
      case "MILESTONE":
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800";
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h2>
        {unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
            {unreadCount} unread
          </span>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-6">
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 flex items-start gap-4 ${
                  notification.read
                    ? "opacity-75 border border-gray-200 dark:border-gray-700"
                    : `opacity-100 border-2 ${getNotificationColor(notification.type)}`
                } hover:shadow-md group`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      priority={true}
                      src={notification.sender?.profilep || "/default-avatar.png"}
                      alt={`${notification.sender?.username || "User"} avatar`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      height={48}
                      width={48}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-800 dark:text-slate-100 leading-relaxed">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {notification.sender?.username}
                      </span>{" "}
                      {notification.message.replace(
                        notification.sender?.username || "",
                        ""
                      )}
                    </p>
                    
                    {notification.mixtape && (
                      <Link
                        href={`/mix/${notification.mixtape.unique}`}
                        className="block group"
                      >
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          {notification.mixtape.imgthumb && (
                            <Image
                              src={notification.mixtape.imgthumb}
                              alt={notification.mixtape.title}
                              className="w-8 h-8 rounded object-cover"
                              height={32}
                              width={32}
                            />
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium truncate">
                            {notification.mixtape.title}
                          </span>
                        </div>
                      </Link>
                    )}
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 items-center">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-600 focus:outline-none transition-colors"
                      aria-label="Mark as read"
                      disabled={actionLoading}
                    >
                      <FaEnvelopeOpen className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || actionLoading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages || actionLoading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 p-12 rounded-2xl max-w-md w-full border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              When you receive notifications about follows, likes, or comments, they'll appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
