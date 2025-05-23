"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  if (!session) return null;
  return (
    <Button
      variant="outline"
      className="justify-start w-full text-destructive hover:text-destructive"
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="mr-2 h-4 w-4" />{" "}
      {loading ? "Logging out..." : "Sign Out"}
    </Button>
  );
}
