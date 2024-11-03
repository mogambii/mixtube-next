"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrashAlt, FaEnvelopeOpen, FaEnvelope } from "react-icons/fa";
import Spinner from "../(components)/Spinner";

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
        const response = await fetch(
          `https://server-nezz.vercel.app/api/user/notifications?page=${page}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("mixtube-token")}`,
            },
          }
        );
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
      const response = await fetch(
        `https://server-nezz.vercel.app/api/user/notification?notificationId=${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("mixtube-token")}`,
          },
        }
      );
      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
      } else {
        alert("Failed to delete notification");
      }
    } catch (error) {
      alert("An error occurred while deleting notification");
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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 dark:text-slate-50 text-center">
        Notifications
      </h2>
      {notifications.length > 0 ? (
        <div>
          <ul className="space-y-4 min-h-[600px]">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-opacity duration-300 border border-gray-200 dark:border-gray-700 flex justify-between items-center ${
                  notification.seen ? "opacity-70" : "opacity-100"
                }`}
              >
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
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    aria-label="Mark as read"
                    role="button"
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
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Delete notification"
                    role="button"
                    disabled={actionLoading}
                  >
                    <FaTrashAlt className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || actionLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Previous
            </button>
            <span className="text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || actionLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
