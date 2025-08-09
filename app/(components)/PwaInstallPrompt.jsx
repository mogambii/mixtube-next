"use client";

import { useEffect, useMemo, useState } from "react";

const DISMISS_KEY = "pwa-install-dismissed-at";
const INSTALLED_KEY = "pwa-installed";
const SNOOZE_MS = 1000 * 60 * 60 * 24 * 3; // 3 days

export default function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIosSafari, setIsIosSafari] = useState(false);

  const shouldShow = useMemo(() => {
    if (isStandalone) return false;
    const dismissedAt = Number(globalThis?.localStorage?.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < SNOOZE_MS) return false;
    if (localStorage.getItem(INSTALLED_KEY) === "1") return false;
    return true;
  }, [isStandalone]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isInStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches ||
      // iOS Safari
      ("standalone" in window.navigator && window.navigator.standalone);
    setIsStandalone(Boolean(isInStandalone));

    // rudimentary iOS Safari detection
    const ua = window.navigator.userAgent || "";
    const isiOS = /iPhone|iPad|iPod/i.test(ua);
    const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
    setIsIosSafari(isiOS && isSafari);

    const onBeforeInstall = (e) => {
      // Only show our custom prompt
      e.preventDefault();
      setPromptEvent(e);
      if (shouldShow) setIsVisible(true);
    };

    const onAppInstalled = () => {
      try {
        localStorage.setItem(INSTALLED_KEY, "1");
      } catch {}
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    // If iOS Safari (no beforeinstallprompt), we can optionally show a helper
    if (isIosSafari && shouldShow) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [isIosSafari, shouldShow]);

  const handleInstall = async () => {
    if (promptEvent) {
      promptEvent.prompt();
      const choice = await promptEvent.userChoice.catch(() => null);
      if (choice && choice.outcome === "accepted") {
        try {
          localStorage.setItem(INSTALLED_KEY, "1");
        } catch {}
        setIsVisible(false);
      } else {
        handleDismiss();
      }
      setPromptEvent(null);
      return;
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-6">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 shadow-2xl backdrop-blur p-4 animate-in slide-in-from-bottom-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">Install Mixtapped</p>
            {isIosSafari && !promptEvent ? (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                To install, tap the Share icon in Safari and choose "Add to Home Screen".
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Get quick access from your home screen and enjoy faster loading offline.
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Not now
          </button>
          {!isIosSafari && (
            <button
              type="button"
              onClick={handleInstall}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


