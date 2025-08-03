import dynamic from "next/dynamic";
import TopMixtapes from "./(components)/TopMixtapes";
import NewMixtapes from "./(components)/NewMixtapes";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

// Dynamically import MpNav and NavMenu for performance optimization
const MpNav = dynamic(() => import("./(components)/MpNav"));
const NavMenu = dynamic(() => import("@/components/NavMenu"));

export const metadata = {
  title: "Stream & Download the Best DJ Mixtapes | MixTapped Music",
  description:
    "Discover the top DJ mixtapes on MixTapped. Stream, download, and share trending mixtapes. Explore new DJs, exclusive mixes, and your favorite music daily.",
  keywords:
    "DJ mixtapes, free mixtape downloads, trending mixtapes, new DJ mixes, mixtape streaming, music downloads, share mixtapes, top mixtapes, MixTapped music",
  openGraph: {
    type: "website",
    url: "https://mixtapped.com/",
    title: "Stream & Download Trending DJ Mixtapes | MixTapped",
    description:
      "Get the latest DJ mixtapes on MixTapped. Stream music, download exclusive mixes, and discover trending DJs. Share and enjoy top mixtapes daily.",
    images: [
      {
        url: "https://mixtapped.com/og.jpg",
        width: 800,
        height: 600,
        alt: "MixTapped - Discover and stream the best DJ mixtapes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stream & Download Top DJ Mixtapes | MixTapped",
    description:
      "Find trending DJ mixtapes on MixTapped. Stream, download, and share your favorite mixes anytime. Explore exclusive music and new DJs daily.",
    images: ["https://mixtapped.com/og.jpg"],
  },
  alternates: {
    canonical: "https://mixtapped.com/",
  },
};

export default function Mainpage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-900">
      {/* Sticky header with blur effect */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/search"
              className="flex-shrink-0 flex items-center"
              aria-label="Search Mixtapes"
            >
              <MpNav place="Search Mixtapes" />
            </Link>

            <div className="flex items-center space-x-4">
              <NavMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 pb-10" role="main">
        {/* Hero banner with enhanced gradient and visual elements */}
        <section className="mb-10 rounded-2xl overflow-hidden shadow-md relative">
          {/* Light mode background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90 dark:opacity-0"></div>
          {/* Dark mode background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-0 dark:opacity-90"></div>
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] mix-blend-overlay opacity-20"></div>
          {/* Animated particles effect (light dots moving) */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-white opacity-30 animate-float-slow"></div>
            <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-white opacity-20 animate-float-medium"></div>
            <div className="absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full bg-white opacity-25 animate-float-fast"></div>
            <div className="absolute bottom-1/4 right-1/3 w-1 h-1 rounded-full bg-white opacity-30 animate-float-slow"></div>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-white opacity-25 animate-float-medium"></div>
            <div className="absolute top-3/4 right-1/2 w-3 h-3 rounded-full bg-white opacity-20 animate-float-fast"></div>
          </div>

          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-white/90 text-sm font-medium mr-2">
                  For Music Fans & DJs
                </span>
                <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">
                  The Ultimate Platform
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                Discover and Share the Best DJ
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100 dark:from-blue-300 dark:to-indigo-200 ml-2">
                  Mixtapes
                </span>
              </h1>
              <p className="text-lg text-white dark:text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
                Find your favorite mixes from top DJs around the world or create
                your own DJ profile and share your music with a global audience
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/discoverdjs"
                  className="group px-6 py-3 bg-white dark:bg-indigo-600 hover:bg-gray-100 dark:hover:bg-indigo-700 text-indigo-600 dark:text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                  <span>Discover DJs</span>
                </Link>
                <Link
                  href="/search"
                  className="group px-6 py-3 bg-indigo-600/10 dark:bg-slate-800 hover:bg-indigo-600/20 dark:hover:bg-slate-700 text-indigo-700 dark:text-white border border-indigo-200 dark:border-slate-600 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search Mixtapes</span>
                </Link>
                <a
                  href="https://dj.mixtapped.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-6 py-3 bg-purple-600/90 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  <span>DJ Portal</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats highlight section with enhanced visuals */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-slate-100 dark:border-gray-700 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800/50">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Thousands of Mixtapes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Access our growing library of exclusive DJ mixes updated daily
              from top artists around the world
            </p>
            <div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Explore mixtapes →
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-slate-100 dark:border-gray-700 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800/50">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Top DJs Worldwide
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Follow your favorite DJs and discover new talent from around the
              globe with our curated profiles
            </p>
            <div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Discover DJs →
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-slate-100 dark:border-gray-700 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800/50">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Stream or Download
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Listen online or download mixtapes to enjoy offline anytime on any
              device, wherever you go
            </p>
            <div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Start listening →
            </div>
          </div>
        </section>

        {/* Top mixtapes section with enhanced styling */}
        <section
          className="mb-10 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-gray-700"
          aria-labelledby="top-mixtapes-heading"
        >
          <TopMixtapes />
        </section>

        {/* New mixtapes section with enhanced styling */}
        <section
          className="mb-10 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-gray-700"
          aria-labelledby="new-mixtapes-heading"
        >
          <NewMixtapes />
        </section>

        {/* Dual CTA section with user/DJ distinction */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Music Fans CTA */}
          <div className="rounded-xl overflow-hidden shadow-md relative">
            {/* Light mode background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-100 dark:opacity-0"></div>
            {/* Dark mode background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-purple-900 opacity-0 dark:opacity-100"></div>
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-[url('/pattern-bg.png')] mix-blend-overlay opacity-10"></div>

            <div className="relative p-8 text-white h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="mb-4 inline-flex justify-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 drop-shadow-sm">
                  For Music Fans
                </h2>
                <p className="text-indigo-100 dark:text-indigo-200 mb-6 max-w-md mx-auto">
                  Create an account to save your favorite mixtapes, create
                  playlists, and follow your favorite DJs.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-auto">
                  <Link
                    href="/login"
                    className="group inline-flex items-center px-5 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 transition-transform group-hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="group inline-flex items-center px-5 py-2 bg-indigo-900/30 backdrop-blur-sm hover:bg-indigo-900/40 text-white border border-indigo-300/30 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 transition-transform group-hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* DJs CTA */}
          <div className="rounded-xl overflow-hidden shadow-md relative">
            {/* Light mode background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-100 dark:opacity-0"></div>
            {/* Dark mode background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-900 opacity-0 dark:opacity-100"></div>
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-[url('/pattern-bg.png')] mix-blend-overlay opacity-10"></div>

            <div className="relative p-8 text-white h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="mb-4 inline-flex justify-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 drop-shadow-sm">
                  For DJs & Artists
                </h2>
                <p className="text-blue-100 dark:text-blue-200 mb-6 max-w-md mx-auto">
                  Create your DJ profile, upload mixtapes, and connect with fans
                  through our dedicated DJ platform.
                </p>
                <div className="flex justify-center mt-auto">
                  <a
                    href="https://dj.mixtapped.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center px-5 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 transition-transform group-hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    DJ Portal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works section */}
        <section className="mb-10 bg-white dark:bg-gray-800/90 rounded-xl p-8 shadow-md border border-slate-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How MixTapped Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              MixTapped connects music fans with talented DJs from around the
              world through our dedicated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -left-3 top-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shadow-sm">
                1
              </div>
              <div className="pl-6 border-l-2 border-indigo-100 dark:border-indigo-900/50 h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  For Music Fans
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Create a free account to discover, stream, and download
                  mixtapes. Follow your favorite DJs and create playlists.
                </p>
                <Link
                  href="/signup"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors inline-flex items-center"
                >
                  Sign up as a listener
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-3 top-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shadow-sm">
                2
              </div>
              <div className="pl-6 border-l-2 border-indigo-100 dark:border-indigo-900/50 h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  For DJs & Artists
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Create your DJ profile on our dedicated DJ portal. Upload
                  mixtapes, track plays, and grow your audience.
                </p>
                <Link
                  href="https://dj.mixtapped.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors inline-flex items-center"
                >
                  Visit DJ portal
                  <FaArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-3 top-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shadow-sm">
                3
              </div>
              <div className="pl-6 border-l-2 border-indigo-100 dark:border-indigo-900/50 h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Connect & Share
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Discover new music, share mixtapes with friends, and connect
                  with a global community of music lovers.
                </p>
                <Link
                  href="/discoverdjs"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors inline-flex items-center"
                >
                  Explore trending DJs
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
