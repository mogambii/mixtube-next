import dynamic from "next/dynamic";
import TopMixtapes from "./(components)/TopMixtapes";
import NewMixtapes from "./(components)/NewMixtapes";
import Link from "next/link";
import {
  PlayCircle,
  Search,
  ExternalLink,
  LogIn,
  UserPlus,
} from "lucide-react";
import { FaMicrophone, FaArrowRight } from "react-icons/fa";

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
          {/* Animated particles effect */}
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
                {/* Discover DJs */}
                <Link
                  href="/discoverdjs"
                  className="group px-6 py-3 bg-white dark:bg-indigo-600 hover:bg-gray-100 dark:hover:bg-indigo-700 text-indigo-600 dark:text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <PlayCircle
                    className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
                    strokeWidth={2}
                  />
                  <span>Discover DJs</span>
                </Link>

                {/* Search Mixtapes */}
                <Link
                  href="/search"
                  className="group px-6 py-3 bg-indigo-600/10 dark:bg-slate-800 hover:bg-indigo-600/20 dark:hover:bg-slate-700 text-indigo-700 dark:text-white border border-indigo-200 text-blue-950 dark:border-slate-600 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <Search
                    className="h-5 w-5 mr-2 transition-transform group-hover:scale-110"
                    strokeWidth={2}
                  />
                  <span>Search Mixtapes</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Top mixtapes section */}
        <section
          className="mb-10 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-gray-700"
          aria-labelledby="top-mixtapes-heading"
        >
          <TopMixtapes />
        </section>

        {/* New mixtapes section */}
        <section
          className="mb-10 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-gray-700"
          aria-labelledby="new-mixtapes-heading"
        >
          <NewMixtapes />
        </section>

        {/* Dual CTA section */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Music Fans CTA */}
          <div className="rounded-xl overflow-hidden shadow-md relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-100 dark:opacity-0"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-purple-900 opacity-0 dark:opacity-100"></div>
            <div className="absolute inset-0 bg-[url('/pattern-bg.png')] mix-blend-overlay opacity-10"></div>

            <div className="relative p-8 text-white h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="mb-4 inline-flex justify-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <PlayCircle
                      className="h-8 w-8 text-white"
                      strokeWidth={1.5}
                    />
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
                  {/* Sign In */}
                  <Link
                    href="/login"
                    className="group inline-flex items-center px-5 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <LogIn
                      className="h-4 w-4 mr-2 transition-transform group-hover:scale-110"
                      strokeWidth={2}
                    />
                    Sign In
                  </Link>

                  {/* Create Account */}
                  <Link
                    href="/signup"
                    className="group inline-flex items-center px-5 py-2 bg-indigo-900/30 backdrop-blur-sm hover:bg-indigo-900/40 text-white border border-indigo-300/30 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <UserPlus
                      className="h-4 w-4 mr-2 transition-transform group-hover:scale-110"
                      strokeWidth={2}
                    />
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* DJs CTA */}
          <div className="rounded-xl overflow-hidden shadow-md relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-100 dark:opacity-0"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-900 opacity-0 dark:opacity-100"></div>
            <div className="absolute inset-0 bg-[url('/pattern-bg.png')] mix-blend-overlay opacity-10"></div>

            <div className="relative p-8 text-white h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="mb-4 inline-flex justify-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <FaMicrophone className="h-8 w-8 text-white" />
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
                    <ExternalLink
                      className="h-4 w-4 mr-2 transition-transform group-hover:scale-110"
                      strokeWidth={2}
                    />
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
                  <FaArrowRight className="h-4 w-4 ml-1" />
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
                  <FaArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
