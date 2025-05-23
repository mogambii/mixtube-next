"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        await signOut({ callbackUrl: "/signup" });
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDeleteAccount}
      disabled={isDeleting}
      className="w-full md:w-auto"
    >
      {isDeleting ? "Deleting..." : "Delete Account"}
    </Button>
  );
}
