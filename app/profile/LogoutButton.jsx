"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const DJ_PANEL_URL = process.env.NEXT_PUBLIC_DJ_PANEL_URL || "https://dj.mixtapped.com";

export default function LogoutButton() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // Aggressively clear old domain-specific cookies that override the shared cookie
    await fetch("/api/auth/clear-cookies", { method: "POST" }).catch(() => {});
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
