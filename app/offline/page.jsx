export const metadata = {
  title: "Offline | Mixtapped",
};

export default function OfflinePage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-3 p-6">
      <h1 className="text-2xl font-semibold">You are offline</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        It looks like there is no internet connection. You can continue browsing
        cached pages or try again when you are back online.
      </p>
    </div>
  );
}


