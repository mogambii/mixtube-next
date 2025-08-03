import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "MixTapped Guide & Support | Help Center",
  description:
    "Find answers to common questions, learn how to use MixTapped, and get support for any issues you may encounter.",
};

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Guide & Support
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-12">
          <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden">
            <Image
              src="/images/support-hero.jpg"
              alt="MixTapped Support"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                How Can We Help?
              </h2>
              <p className="text-white/80">Find answers and get support</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                How do I create an account?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creating an account is easy! Click on the{" "}
                <code>&quot;Sign Up&quot;</code> button in the top right corner
                of the homepage. Fill in your details, verify your email
                address, and you&apos;re ready to go. You can also sign up using
                your Google or Facebook account for a quicker registration
                process.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                I forgot my password. How do I reset it?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                If you&apos;ve forgotten your password, click on the{" "}
                <code>&quot;Login&quot;</code> button, then select{" "}
                <code>&quot;Forgot Password&quot;</code>. Enter the email
                address associated with your account, and we&apos;ll send you a
                password reset link. The link is valid for 15 minutes. Follow
                the instructions in the email to create a new password.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                How do I follow a DJ?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                To follow a DJ, navigate to their profile page by clicking on
                their name or profile picture. On their profile page,
                you&apos;ll find a <code>&quot;Follow&quot;</code> button. Click
                on it to start following them. You&apos;ll receive notifications
                when they upload new mixtapes or make updates to their profile.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Can I download mixtapes for offline listening?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can download mixtapes for offline listening. When
                playing a mixtape, look for the download icon in the player
                controls. Click on it to download the mixtape to your device.
                Please note that some mixtapes may not be available for download
                based on the DJ&apos;s preferences.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                How do I become a DJ on MixTapped?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                To become a DJ on MixTapped, visit our DJ Portal at{" "}
                <Link
                  href="https://dj.mixtapped.com"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dj.mixtapped.com
                </Link>
                . Create a DJ account, complete your profile with your bio,
                social media links, and profile picture. Once approved, you can
                start uploading your mixtapes and building your audience.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Getting Started Guides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                For Listeners
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Creating and customizing your profile</li>
                <li>• Discovering new mixtapes and DJs</li>
                <li>• Creating playlists and favorites</li>
                <li>• Interacting with the community</li>
                <li>• Managing notifications</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                For DJs
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Setting up your DJ profile</li>
                <li>• Uploading and managing mixtapes</li>
                <li>• Promoting your content</li>
                <li>• Understanding analytics</li>
                <li>• Building your audience</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Technical Support
          </h2>

          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Common Technical Issues
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-200">
                  Playback Issues
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  If you&apos;re experiencing playback issues, try refreshing
                  the page, clearing your browser cache, or using a different
                  browser. Make sure your internet connection is stable and that
                  you have the latest version of your browser.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-200">
                  Upload Problems
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  For DJs experiencing upload issues, ensure your file is in a
                  supported format (MP3, WAV) and doesn&apos;t exceed the 500MB
                  size limit. Check your internet connection stability during
                  uploads.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-200">
                  Account Access
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  If you can&apos;t access your account, try resetting your
                  password. If you still have issues, contact our support team
                  with your username and the email address associated with your
                  account.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Contact Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is
              here to help!
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Email:{" "}
              <a
                href="mailto:support@mixtapped.com"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                support@mixtapped.com
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Response time: Usually within 24 hours on business days
            </p>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
