"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrashAlt, FaEnvelopeOpen, FaEnvelope } from "react-icons/fa";
import Spinner from "../(components)/Spinner";
import toast from "react-hot-toast";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(`/api/notifications?page=${page}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.status === 404) {
          setNotifications([]);
          setTotalPages(1);
          setError(null);
        } else if (response.ok) {
          setNotifications(data.notifications);
          setTotalPages(data.totalPages || 1);
          if (data.notifications.length === 0 && page > 1) {
            setPage(page - 1);
          }
        } else {
          setError(data.message || "Failed to load notifications");
        }
      } catch (error) {
        setError("An error occurred while fetching notifications");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [page]);

  const deleteNotification = async (notificationId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
        toast.success("Notification deleted successfully");
      } else {
        toast.error("Failed to delete notification");
      }
    } catch (error) {
      toast.error("An error occurred while deleting notification");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleNotificationStatus = async (notification) => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: notification.id,
          seen: !notification.seen,
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, seen: !n.seen } : n
          )
        );
        toast.success(
          `Notification marked as ${!notification.seen ? "read" : "unread"}`
        );
      } else {
        toast.error("Failed to update notification status");
      }
    } catch (error) {
      toast.error("An error occurred while updating notification");
    } finally {
      setActionLoading(false);
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
      <h2 className="text-2xl font-semibold mb-6 dark:text-slate-50 text-center">
        Notifications
      </h2>
      {notifications.length > 0 ? (
        <div className="space-y-6">
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-300 flex items-start gap-4 ${
                  notification.seen
                    ? "opacity-80 border border-gray-200 dark:border-gray-700"
                    : "opacity-100 border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-700"
                } hover:shadow-md`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Image
                    priority={true}
                    src={notification.sender?.profilep || "/default-avatar.png"}
                    alt={`${notification.sender?.username || "User"} avatar`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    height={40}
                    width={40}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/mix/${notification.mixtape?.unique}`}
                    className="block group"
                  >
                    <p className="text-sm text-gray-800 dark:text-slate-100 leading-relaxed">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {notification.sender?.username}
                      </span>{" "}
                      {notification.message.replace(
                        notification.sender?.username || "",
                        ""
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 italic truncate">
                      “{notification.mixtape?.title}”
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(
                        notification.createdAt || notification.time
                      ).toLocaleString()}
                    </p>
                  </Link>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 items-center">
                  <button
                    onClick={() => toggleNotificationStatus(notification)}
                    className={`p-1 rounded-full ${
                      notification.seen
                        ? "text-gray-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-600"
                        : "text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-600"
                    } focus:outline-none transition-colors`}
                    aria-label={
                      notification.seen ? "Mark as unread" : "Mark as read"
                    }
                    disabled={actionLoading}
                  >
                    {notification.seen ? (
                      <FaEnvelopeOpen className="h-4 w-4" />
                    ) : (
                      <FaEnvelope className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-gray-600 focus:outline-none transition-colors"
                    aria-label="Delete notification"
                    disabled={actionLoading}
                  >
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || actionLoading}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || actionLoading}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg max-w-md w-full">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No notifications available.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              When you receive notifications, they&apos;ll appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
