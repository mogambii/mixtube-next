"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersection } from "@/hooks/use-intersection";
import Follow from "@/components/Follow";
import { Loader2, Users, Mic2, Compass } from "lucide-react";
import Link from "next/link";

// ─── skeleton row ─────────────────────────────────────────────────────────────

const UserRowSkeleton = () => (
  <div className="flex items-center justify-between px-2.5 sm:px-4 py-2.5 sm:py-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-11 w-11 rounded-full flex-shrink-0" />
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-8 w-20 rounded-xl" />
  </div>
);


const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-6 mb-5">
      <Users className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
    </div>
    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
      Not following anyone yet
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mb-6">
      Start following your favourite DJs to see their latest mixtapes and
      updates in your feed.
    </p>
    <Link href="/discoverdjs">
      <Button
        size="sm"
        className="rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25"
      >
        <Compass className="h-4 w-4" />
        Discover DJs
      </Button>
    </Link>
  </div>
);

// ─── user row ─────────────────────────────────────────────────────────────────

const UserRow = ({ user, index }) => (
  <div
    className="group flex items-center justify-between px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/60"
    style={{ animationDelay: `${index * 40}ms` }}
  >
    <Link
      href={`/dj/${user.name}`}
      className="flex items-center gap-3 min-w-0 flex-1"
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-11 w-11 ring-2 ring-transparent group-hover:ring-indigo-200 dark:group-hover:ring-indigo-800 transition-all duration-200">
          <AvatarImage src={user.image || user.profilep} alt={user.name} />
          <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
          {user.name}
        </p>
        {user.djName ? (
          <div className="flex items-center gap-1 mt-0.5">
            <Mic2 className="h-3 w-3 text-indigo-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.djName}
            </span>
          </div>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Listener
          </p>
        )}
      </div>
    </Link>

    <div className="flex-shrink-0 ml-3">
      <Follow username={user.name} following={true} />
    </div>
  </div>
);

// ─── main component ───────────────────────────────────────────────────────────

export default function UserList({ email }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const isIntersecting = useIntersection(loadMoreRef, { threshold: 1 });

  const fetchUsers = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/user/following?page=${page}&limit=8`,
      );
      const data = await res.json();
      if (data.users.length < 8) setHasMore(false);
      setUsers((prev) => [...prev, ...data.users]);
      setPage((p) => p + 1);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, email, page]);

  useEffect(() => {
    if (isIntersecting) fetchUsers();
  }, [isIntersecting, fetchUsers]);

  const isInitialLoad = users.length === 0 && isLoading;
  const isEmpty = users.length === 0 && !isLoading && !hasMore;

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Following
          </span>
        </div>
        {users.length > 0 && (
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {users.length}
            {hasMore ? "+" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
        {isInitialLoad ? (
          // Initial skeleton
          <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {[...Array(4)].map((_, i) => (
              <UserRowSkeleton key={i} />
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {users.map((user, index) => (
              <UserRow key={user.id} user={user} index={index} />
            ))}

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div
                ref={loadMoreRef}
                className="flex items-center justify-center py-4"
              >
                {isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                )}
              </div>
            )}

            {/* End of list */}
            {!hasMore && users.length > 0 && (
              <p className="text-center text-xs text-gray-400 dark:text-gray-600 py-4">
                — {users.length} people followed —
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
