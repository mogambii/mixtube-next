"use client";
import React, { useState, useEffect } from "react";
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
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-5 p-4">
      <h2 className="text-2xl font-semibold mb-4 dark:text-slate-50">
        Notifications
      </h2>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          <ul className="space-y-4 min-h-[600px]">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-opacity duration-300 ${
                  notification.seen ? "opacity-70" : "opacity-100"
                } flex justify-between items-center`}
              >
                <div>
                  <p className="text-sm text-gray-700 dark:text-slate-50">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notification.time).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
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
                    className="text-red-500 hover:text-red-700"
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
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || actionLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || actionLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
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
