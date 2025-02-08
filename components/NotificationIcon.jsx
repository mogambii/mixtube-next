import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

async function verifyToken(token) {
  try {
    const res = await fetch(
      `https://api.mixtube.xyz/api/user/check-token?token=${token}`
    );
    if (!res.ok) {
      console.error("Invalid token");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}

async function fetchNotificationsCount(token) {
  try {
    const response = await fetch(
      "https://api.mixtube.xyz/api/user/total-notifications",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.count;
    } else {
      console.error("Failed to fetch notifications count:", data.message);
      return 0;
    }
  } catch (error) {
    console.error("Failed to fetch notifications count:", error);
    return 0;
  }
}

export default async function NotificationIcon() {
  const session = await getServerSession();

  const notifications = 10

  return (
    <div className="flex items-center gap-4">
      {session && (
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
    </div>
  );
}

