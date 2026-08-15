"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function ProfileIcon() {
  const { data: session } = useSession();

  if (!session?.user) return null;
  const { name, image, email } = session.user;

  return (
    <Link href="/profile" aria-label="Profile">
      <button className="flex items-center justify-center p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition shrink-0">
        <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-xs font-semibold">
            {name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
    </Link>
  );
}
