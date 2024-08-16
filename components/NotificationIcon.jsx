"use client";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState(0);
  const [token, setToken] = useState(null);
  const [type, setType] = useState(null);
  const pathname = usePathname();

  const notificationPage = pathname.includes("notifications");
  const isProfilePage = pathname.includes("profile");

  useEffect(() => {
    // Safely access localStorage in a useEffect
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("mixtube-token");
      const storedType = localStorage.getItem("mixtube-type");
      setToken(storedToken);
      setType(storedType);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyToken();
      fetchNotificationsCount();
    }

    if (notificationPage) {
      setNotifications(0); // Clear notifications if on the notification page
    }
  }, [token, notificationPage]);

  async function verifyToken() {
    try {
      const res = await fetch(
        `https://server-nezz.vercel.app/api/user/check-token?token=${token}`
      );
      if (!res.ok) {
        // Handle token verification failure if needed
      }
    } catch (error) {
      console.error("Token verification error:", error);
    }
  }

  async function fetchNotificationsCount() {
    if (!type) return;

    try {
      const response = await fetch(
        "https://server-nezz.vercel.app/api/user/total-notifications",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.count);
      } else {
        console.error("Failed to fetch notifications count:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch notifications count:", error);
    }
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Handle logout logic if needed
    }
  };

  return (
    <div className="flex items-center gap-4">
      {token && (
        <Link
          href="/notifications"
          className="relative flex items-center text-lg text-gray-800 dark:text-slate-100"
        >
          <FaBell className="flex items-center justify-center" size={20} />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {notifications}
            </span>
          )}
        </Link>
      )}
      {!isProfilePage && (
        <div className="flex items-center gap-4 dark:text-slate-50">
          <div className="flex items-center gap-x-2 text-lg font-semibold">
            {type === "DJ" ? (
              <Link
                href="/profile"
                className="px-2 py-1 rounded-full ring-1 ring-slate-900 dark:ring-slate-50 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Profile
              </Link>
            ) : type ? (
              <button
                onClick={handleLogout}
                className="px-2 py-1 rounded-full ring-1 dark:ring-slate-50 ring-slate-950 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="px-2 py-1 rounded-full ring-1 dark:ring-slate-50 ring-slate-950 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
