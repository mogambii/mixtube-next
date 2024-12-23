import Link from "next/link";
import { FaBell } from "react-icons/fa6";
import { cookies } from "next/headers";

async function verifyToken(token) {
  try {
    const res = await fetch(
      `https://server-nezz.vercel.app/api/user/check-token?token=${token}`
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
  const cookieStore = await  cookies();
  // Retrieve cookies on the server side
  const mixtubeToken = cookieStore.get("mixtube-token");

  const token = mixtubeToken ? mixtubeToken.value : null;

  const isTokenValid = token ? await verifyToken(token) : false;
  const notifications = isTokenValid ? await fetchNotificationsCount(token) : 0;

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
        <div className="flex items-center gap-4 dark:text-slate-50">
          <div className="flex items-center gap-x-2 text-lg font-semibold">
            {token ? (
              <Link
                href="/profile"
                className="px-2 py-1 rounded-full ring-1 ring-slate-900 dark:ring-slate-50 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Profile
              </Link>
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
    </div>
  );
}

