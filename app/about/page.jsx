import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BsWhatsapp } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export const metadata = {
  title: "About MixTube | Our Story and Mission",
  description:
    "Learn about MixTube, our mission to connect music fans with talented DJs, and the team behind the platform.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        About MixTube
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-12">
          <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden">
            <Image
              src="/og.jpg"
              alt="MixTube Team"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Connecting Music Lovers
              </h2>
              <p className="text-white/80">Since 2020</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            MixTube was born from a simple idea: to create a platform where
            music enthusiasts could discover and enjoy mixtapes from talented
            DJs around the world. What started as a small project in Nairobi,
            Kenya has grown into a global community connecting music lovers and
            artists across continents.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our founder, Nezz Mogambi, Software Developer, noticed a gap in the
            market for a dedicated platform that would showcase African DJs and
            their unique sounds to the world. MixTube was created to bridge this
            gap, providing a space where DJs could share their craft and
            listeners could discover new music.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At MixTube, our mission is to democratize music discovery by
            connecting listeners with talented DJs from diverse backgrounds. We
            believe in:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
            <li>
              <strong>Empowering Artists:</strong> Providing DJs with tools to
              showcase their talent and connect with fans
            </li>
            <li>
              <strong>Cultural Exchange:</strong> Facilitating the discovery of
              music from different cultures and regions
            </li>
            <li>
              <strong>Community Building:</strong> Creating a vibrant community
              of music lovers and creators
            </li>
            <li>
              <strong>Innovation:</strong> Continuously improving our platform
              to enhance the user experience
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            What Sets Us Apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                Focus on African Music
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                While we feature DJs from around the world, we take pride in
                showcasing African talent and bringing diverse African sounds to
                a global audience.
              </p>
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Dedicated DJ Portal
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our separate DJ portal provides artists with powerful tools to
                upload, manage, and promote their mixtapes while tracking
                performance metrics.
              </p>
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
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                High-Quality Audio
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We prioritize audio quality, ensuring that listeners can enjoy
                mixtapes in high fidelity while still optimizing for streaming
                performance.
              </p>
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
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Community-Driven
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our platform encourages interaction between listeners and DJs,
                fostering a vibrant community where feedback and engagement
                drive growth.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Whether you&apos;re a music enthusiast looking to discover new
            sounds or a DJ wanting to share your craft, MixTube welcomes you to
            our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg md:px-8 transition-colors"
            >
              Sign Up as Listener
            </Link>
            <a
              href="https://dj.mixtube.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-400 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 md:py-3 md:text-lg md:px-8 transition-colors"
            >
              DJ Portal
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Have questions or suggestions? We&apos;d love to hear from you!
          </p>

          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Contact Information
            </h3>

            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:info@mixtube.xyz"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    info@mixtube.xyz
                  </a>
                </span>
              </p>

              <p className="text-gray-600 dark:text-gray-300 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
                <span>
                  <strong>Support:</strong>{" "}
                  <a
                    href="mailto:support@mixtube.xyz"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    support@mixtube.xyz
                  </a>
                </span>
              </p>

              <p className="text-gray-600 dark:text-gray-300 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  <strong>Response Time:</strong>
                  <br />
                  We typically respond to emails within 24-48 hours on business
                  days.
                </span>
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Connect With Us
          </h3>
          <div className="flex space-x-4 mb-6">
            <a
              href="https://twitter.com/mogambii"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-6 w-6" />
            </a>

            <a
              href="https://instagram.com/mogambii_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <FaInstagram className="h-6 w-6" />
            </a>

            <a
              href="https://facebook.com/mixtubexyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <FaFacebook className="h-6 w-6" />
            </a>

            <a
              href="https://wa.me/254101468231"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <span className="sr-only">WhatsApp</span>
              <BsWhatsapp className="h-6 w-6" />
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
                  d="M19.812 5.418c.861.23 1.538.907..."
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Need Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Visit our{" "}
              <Link
                href="/support"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Support Center
              </Link>{" "}
              for FAQs and troubleshooting guides, or check out our{" "}
              <Link
                href="/guide"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                User Guide
              </Link>{" "}
              for detailed instructions on using MixTube.
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
