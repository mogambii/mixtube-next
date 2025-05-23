"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function ProfileIcon() {
  const { data: session } = useSession();

  if (!session?.user) return null;
  const { name, image, email } = session.user;

  return (
    <Link href="/profile">
      <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
        <Avatar>
          <AvatarImage src={image} size={8} alt={name} />
          <AvatarFallback>{name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </button>
    </Link>
  );
}
