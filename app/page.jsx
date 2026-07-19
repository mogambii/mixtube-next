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

const SearchInputTrigger = dynamic(() => import("./(components)/SearchInputTrigger"));

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
    <div className="min-h-screen bg-gradient-to-b rounded-2xl mx-2 p-2 from-white to-slate-50 dark:from-gray-950 dark:to-gray-900">
      {/* Page Content */}

      <main className="max-w-7xl mx-auto px-4 pt-6 pb-10" role="main">
        {/* Hero banner with premium glassmorphic aesthetic */}
        <section className="mb-12 mt-2 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] dark:shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)] relative">
          {/* Deep vibrant gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 opacity-95 dark:opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent dark:from-blue-900/40"></div>
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] mix-blend-overlay opacity-30 dark:opacity-10"></div>
          
          {/* Floating animated orbs */}
          <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-50 dark:opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-fuchsia-400 blur-[80px] animate-blob-drift-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-indigo-400 blur-[80px] animate-blob-drift-1"></div>
          </div>

          <div className="relative p-10 md:p-16 lg:p-20 z-10 flex flex-col items-center justify-center min-h-[400px]">
            <div className="max-w-4xl mx-auto text-center w-full">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-righteous text-white mb-6 tracking-wide drop-shadow-xl">
                Discover the Best
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white drop-shadow-lg">
                  DJ Mixtapes
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 dark:text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Stream trending mixes from top DJs around the world, or upload your own and share your sound globally.
              </p>
            </div>
          </div>
        </section>

        {/* Top mixtapes section */}
        <section
          className="mb-12 bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl rounded-[2rem] p-2 md:p-4 shadow-xl border border-white/50 dark:border-white/5"
          aria-labelledby="top-mixtapes-heading"
        >
          <TopMixtapes />
        </section>

        {/* New mixtapes section */}
        <section
          className="mb-12 bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl rounded-[2rem] p-2 md:p-4 shadow-xl border border-white/50 dark:border-white/5"
          aria-labelledby="new-mixtapes-heading"
        >
          <NewMixtapes />
        </section>

        {/* Dual CTA section */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Music Fans CTA */}
          <div className="group rounded-[2rem] overflow-hidden shadow-xl relative transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 opacity-90 dark:opacity-80 transition-opacity group-hover:opacity-100"></div>
            <div className="absolute inset-0 bg-[url('/pattern-bg.png')] mix-blend-overlay opacity-20"></div>

            <div className="relative p-10 text-white h-full flex flex-col">
              <div className="flex flex-col flex-1">
                <div className="mb-6 inline-flex">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                    <PlayCircle className="h-8 w-8 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-righteous mb-4 drop-shadow-sm tracking-wide">
                  For Listeners
                </h2>
                <p className="text-indigo-50 dark:text-indigo-100 mb-8 max-w-md leading-relaxed text-lg">
                  Save your favorite mixtapes, build custom playlists, and follow the world's best DJs.
                </p>
                <div className="flex flex-wrap gap-4 mt-auto">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
                  >
                    <LogIn className="h-5 w-5 mr-2" strokeWidth={2.5} />
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-6 py-3 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white border border-white/20 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
                  >
                    <UserPlus className="h-5 w-5 mr-2" strokeWidth={2.5} />
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* DJs CTA */}
          <div className="group rounded-[2rem] overflow-hidden shadow-xl relative transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 opacity-90 dark:opacity-80 transition-opacity group-hover:opacity-100"></div>
            <div className="absolute inset-0 bg-[url('/pattern-bg.png')] mix-blend-overlay opacity-20"></div>

            <div className="relative p-10 text-white h-full flex flex-col">
              <div className="flex flex-col flex-1">
                <div className="mb-6 inline-flex">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                    <FaMicrophone className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-righteous mb-4 drop-shadow-sm tracking-wide">
                  For DJs & Artists
                </h2>
                <p className="text-blue-50 dark:text-blue-100 mb-8 max-w-md leading-relaxed text-lg">
                  Create your profile, upload your exclusive mixes, and grow your audience worldwide.
                </p>
                <div className="flex mt-auto">
                  <a
                    href="https://dj.mixtapped.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" strokeWidth={2.5} />
                    Open DJ Portal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works section */}
        <section className="mb-12 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl rounded-[2rem] p-10 shadow-lg border border-white/40 dark:border-white/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-righteous text-gray-900 dark:text-white mb-4 tracking-wide">
              How MixTapped Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Connecting music fans with talented DJs from around the world through a premium dedicated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <div className="relative group">
              <div className="w-12 h-12 mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  For Music Fans
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Discover, stream, and download mixtapes instantly. Follow your favorite DJs and curate your ultimate playlist.
                </p>
                <Link
                  href="/signup"
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors inline-flex items-center group-hover:translate-x-1"
                >
                  Join the platform
                  <FaArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="relative group">
              <div className="w-12 h-12 mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  For DJs & Artists
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Upload mixtapes, track your engagement metrics, and push your sound to a rapidly growing audience.
                </p>
                <Link
                  href="https://dj.mixtapped.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center group-hover:translate-x-1"
                >
                  Visit DJ portal
                  <FaArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="relative group">
              <div className="w-12 h-12 mb-6 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Connect & Share
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Immerse yourself in global sounds, share heavy mixes with friends, and join the music community.
                </p>
                <Link
                  href="/discover"
                  className="text-fuchsia-600 dark:text-fuchsia-400 font-bold hover:text-fuchsia-700 dark:hover:text-fuchsia-300 transition-colors inline-flex items-center group-hover:translate-x-1"
                >
                  Explore now
                  <FaArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
