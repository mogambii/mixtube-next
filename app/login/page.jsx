import Login from "../../components/LoginForm";

export const metadata = {
  title: "Sign In - MixTapped",
  description:
    "Sign in to your MixTapped account and access your personalized music experience",
  keywords:
    "login, sign in, mixtapped, music streaming, dj mix, mixtape, music platform",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <Login />
    </div>
  );
}
