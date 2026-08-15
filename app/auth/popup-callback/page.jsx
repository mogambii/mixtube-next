"use client";

import { useEffect } from "react";

/**
 * This page is used as the callbackUrl for Google OAuth popup sign-in.
 * After NextAuth redirects here on successful auth, it closes the popup
 * window so the parent page can detect it and proceed.
 */
export default function PopupCallback() {
  useEffect(() => {
    // Post message to parent window if available
    try {
      if (window.opener) {
        window.opener.postMessage({ type: "GOOGLE_SIGNIN_SUCCESS" }, "*");
      }
    } catch (e) {
      console.error(e);
    }

    // Unconditionally call window.close() since this tab was opened via window.open()
    window.close();

    // Fallback: If browser blocks window.close() (e.g. opened directly by user), redirect to home
    const fallbackTimer = setTimeout(() => {
      window.location.href = "/";
    }, 1000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <p className="text-gray-700 dark:text-gray-200 text-base font-semibold">
          Signing you in...
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Closing window...
        </p>
      </div>
    </div>
  );
}
