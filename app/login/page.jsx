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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto py-10 px-4">
        <Login />
      </main>
    </div>
  );
}
