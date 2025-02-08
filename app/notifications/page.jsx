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
    <div className="mx-4 max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-6 dark:text-slate-50 text-center">
        Notifications
      </h2>
      {notifications.length > 0 ? (
        <div>
          <ul className="space-y-4 min-h-[600px]">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-all duration-300 border ${
                  notification.seen
                    ? "border-gray-200 dark:border-gray-700 opacity-70"
                    : "border-blue-500 dark:border-blue-400 opacity-100"
                } hover:shadow-lg`}
              >
                <div className="flex justify-between items-start gap-4">
                  <Link href={`https://mixtube.xyz/mix/${notification.unique}`}>
                    <div className="flex-1 cursor-pointer">
                      <p className="text-sm text-gray-800 dark:text-slate-50">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.time).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleNotificationStatus(notification)}
                      className={`${
                        notification.seen
                          ? "text-gray-400 hover:text-blue-500"
                          : "text-blue-500 hover:text-blue-700"
                      } focus:outline-none transition-colors duration-200`}
                      aria-label={
                        notification.seen ? "Mark as unread" : "Mark as read"
                      }
                      disabled={actionLoading}
                    >
                      {notification.seen ? (
                        <FaEnvelopeOpen className="h-5 w-5" />
                      ) : (
                        <FaEnvelope className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
                      aria-label="Delete notification"
                      disabled={actionLoading}
                    >
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || actionLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || actionLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center dark:text-slate-50 flex min-h-[600px] items-center justify-center">
          <p>No notifications available.</p>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
