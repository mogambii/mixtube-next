"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersection } from "@/hooks/use-intersection";
import Follow from "@/components/Follow";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";

export default function UserList({ email }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const isIntersecting = useIntersection(loadMoreRef, {
    threshold: 1,
  });

  const fetchUsers = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/user/following?email=${encodeURIComponent(
          email
        )}&page=${page}&limit=8`
      );
      const data = await response.json();

      if (data.users.length < 8) {
        setHasMore(false);
      }

      setUsers((prev) => [...prev, ...data.users]);
      setPage((p) => p + 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isIntersecting) {
      fetchUsers();
    }
  }, [isIntersecting, fetchUsers]);

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id} className="hover:bg-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={user.image || user.profilep}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{user.name}</h3>
                  </div>
                  {user.djName && (
                    <p className="text-sm text-muted-foreground">
                      {user.djName}
                    </p>
                  )}
                </div>
              </div>
              <Follow username={user.name} following={true} />
            </div>
          </CardContent>
        </Card>
      ))}
      {users.length === 0 && isLoading ? (
        // Initial loading state with skeletons
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : hasMore ? (
        <div
          ref={loadMoreRef}
          className="h-16 flex items-center justify-center"
        >
          {isLoading && (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          )}
        </div>
      ) : users.length > 0 ? (
        <p className="text-center text-sm text-muted-foreground py-4">
          You&apos;ve reached the end of the list
        </p>
      ) : (
        <Card className="p-6">
          <div className="text-center space-y-4 gap-4">
            <div className="flex justify-center">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Following Yet</h3>
              <p className="text-sm mb-3 text-muted-foreground max-w-sm mx-auto">
                Start following your favorite DJs to see their latest mixtapes
                and updates in your feed.
              </p>
            </div>
            <Link href="/discoverdjs" className="p-2 my-2 mt-3">
              <Button className=" p-2 m-2">
                <Users className="mr-2 h-4 w-4" />
                Explore DJs
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
