"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Link from "next/link";

export default function ProfileIcon() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) return null;

  const { name, image, type } = session.user;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Profile Icon Button */}
      <PopoverTrigger asChild>
        <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
          <Avatar>
            <AvatarImage src={image} size={8} alt={name} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      {/* Popup Content (Dropdown) */}
      <PopoverContent className="w-48 p-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <div className="text-center border-b pb-2">
          <h3 className="text-sm text-gray-900 dark:text-gray-50 font-semibold">{name}</h3>
        </div>

        <div className="mt-2 space-y-2">
          {/* Dashboard Link for DJs */}
          {type === "DJ" && (
            <Link href="https://dj.mixtube.xyz">
              <Button className="w-full">Dashboard</Button>
            </Link>
          )}

          {/* Favorites Link */}
          <Link href="/favorites">
            <Button className="w-full" variant="outline">
              My Favorites
            </Button>
          </Link>

          {/* Logout Button */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
