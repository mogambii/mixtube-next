import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "MixTube Support | Get Help",
  description:
    "Get support for MixTube. Contact our team, troubleshoot common issues, and find answers to your questions.",
};

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Support Center
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-12">
          <div className="relative w-full h-96 md:h-[600px] mb-8 rounded-xl overflow-hidden">
            <Image
              src="/images/support-hero.jpg"
              alt="MixTube Support"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                We're Here To Help
              </h2>
              <p className="text-white/80">Get assistance with any issues</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Contact Support
          </h2>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Email Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our support team is available to help with any questions or issues
              you may have.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Email:{" "}
              <a
                href="mailto:support@mixtube.xyz"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                support@mixtube.xyz
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Response time: Usually within 24 hours on business days
            </p>

            <h4 className="text-base font-medium text-gray-800 dark:text-gray-100 mb-3 mt-5">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/mixtubexyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://instagram.com/mixtubexyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://facebook.com/mixtubexyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://youtube.com/mixtubexyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                For Listeners
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you're experiencing issues with your listener account, please
                include:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Your username</li>
                <li>• Device and browser information</li>
                <li>• Detailed description of the issue</li>
                <li>• Screenshots (if applicable)</li>
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
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you're experiencing issues with your DJ account, please
                include:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Your DJ name</li>
                <li>• Mixtape ID (if applicable)</li>
                <li>• Upload error messages</li>
                <li>• Account access issues</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Troubleshooting
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Playback Issues
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you're having trouble playing mixtapes, try these steps:
              </p>
              <ol className="text-gray-600 dark:text-gray-300 space-y-2 list-decimal pl-5">
                <li>Refresh the page</li>
                <li>Clear your browser cache</li>
                <li>Try a different browser</li>
                <li>Check your internet connection</li>
                <li>Disable browser extensions</li>
              </ol>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Account Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you can't access your account:
              </p>
              <ol className="text-gray-600 dark:text-gray-300 space-y-2 list-decimal pl-5">
                <li>Try resetting your password</li>
                <li>Check if you're using the correct email address</li>
                <li>
                  Make sure you're not using a social login if you created your
                  account with email
                </li>
                <li>Clear your browser cookies</li>
                <li>Contact support if issues persist</li>
              </ol>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Upload Problems (For DJs)
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you're having trouble uploading mixtapes:
              </p>
              <ol className="text-gray-600 dark:text-gray-300 space-y-2 list-decimal pl-5">
                <li>Ensure your file is in a supported format (MP3, WAV)</li>
                <li>
                  Check that your file doesn't exceed the 500MB size limit
                </li>
                <li>Verify your internet connection is stable</li>
                <li>Try a different browser</li>
                <li>Make sure your DJ account is verified</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Password Reset Help
          </h2>

          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Password Reset Process
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you need to reset your password:
            </p>
            <ol className="text-gray-600 dark:text-gray-300 space-y-2 list-decimal pl-5">
              <li>Click on "Login" in the top navigation</li>
              <li>Select "Forgot Password"</li>
              <li>Enter the email address associated with your account</li>
              <li>Check your email for a reset link (valid for 15 minutes)</li>
              <li>Click the link and create a new password</li>
            </ol>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Note: If you don't receive the email, check your spam folder. If
              you still don't see it, contact support.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Additional Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/guide"
              className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                User Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive guides for both listeners and DJs on how to use
                MixTube effectively.
              </p>
            </Link>

            <Link
              href="/about"
              className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                About MixTube
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn more about MixTube, our mission, and the team behind the
                platform.
              </p>
            </Link>
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
