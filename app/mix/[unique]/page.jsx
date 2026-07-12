import React from "react";
import { FaDownload, FaHeart, FaRegCirclePlay } from "react-icons/fa6";
import { FaCalendarAlt, FaMusic } from "react-icons/fa";
import {
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  Heart,
  Plus,
  ArrowDown,
  Info,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentsPage from "@/app/(components)/Comments";
import DownloadBtn from "@/components/Download_btn";
import Share from "@/components/Share";
import LikeBtn, { LikeProvider } from "@/components/Like-btn";
import LikeCounter from "@/components/LikeCounter";
import AudioAdd from "@/app/(components)/AudioAdd";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import prisma from "@/lib/prismadb";

// Dynamically import the LikeProvider with no SSR to avoid hydration issues
const DynamicLikeProvider = dynamic(() =>
  import("@/components/Like-btn").then((mod) => mod.LikeProvider),
);

async function checkLikeStatus(email, mixtapeId) {
  if (!email) {
    return;
  }
  try {
    const res = await fetch(
      `http://localhost:3000/api/mixtape/user/${mixtapeId}/liked?email=${email}`,
      {
        cache: "no-cache",
      },
    );
    if (!res.ok) throw new Error("Failed to check like status");
    const results = await res.json();
    return results.liked;
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
}

// Fetch mixtape data by unique
async function getMixtape(unique) {
  try {
    const res = await prisma.mixtape.findUnique({
      where: {
        unique: unique,
      },
      include: {
        user: {
          select: {
            username: true,
            profilep: true,
          },
        },
      },
    });
    return res;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { unique } = await params;
  const mix = await getMixtape(unique);

  const defaultImageUrl = "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png";
  const imageUrl = mix?.cover || defaultImageUrl;

  return {
    title: mix ? `${mix.title} | mixtapped` : "Mixtape Not Found",
    description:
      `${mix?.desc} mix on mixtapped | stream, play and download| by  ${
        mix?.djName || mix?.name
      }` || `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtapped.`,
    keywords: [
      "mixtape",
      "music",
      "dj mix",
      mix?.genre || "genre",
      mix?.title || "mixtape",
      "Mixtapped",
      mix?.djName || mix?.name,
    ],
    openGraph: {
      title: `${mix?.title || "Mixtape"} | mixtapped`,
      description:
        mix?.desc ||
        `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtapped.`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${mix?.djName || mix?.name}'s mixtape cover`,
        },
      ],
      type: "music.song",
    },
    twitter: {
      card: "summary_large_image",
      title: `${mix?.title || "Mixtape"} | Mixtapped`,
      description:
        mix?.desc ||
        `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtapped.`,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://mixtapped.com/mixtape/${unique}`,
    },
  };
}

export default async function MixTape({ params }) {
  const session = await getServerSession();
  const { unique } = await params;
  const liked = await checkLikeStatus(session?.user?.email, unique);
  const mix = await getMixtape(unique);

  async function getRelatedMixtapes(mixtape, currentId) {
    if (!mixtape || !mixtape.genre) return [];

    try {
      const res = await fetch(
        `http://localhost:3000/api/mixtape/related?genre=${encodeURIComponent(
          mixtape.genre,
        )}&excludeId=${currentId}&limit=4`,
        { cache: "no-cache" },
      );

      if (!res.ok) {
        console.warn("Falling back to recent mixtapes API");
        const recentRes = await fetch(
          `http://localhost:3000/api/mixtape/recent?limit=4`,
          { cache: "no-cache" },
        );
        if (!recentRes.ok) throw new Error("Failed to fetch mixtapes");
        const recentData = await recentRes.json();
        return recentData.filter((item) => item.unique !== currentId);
      }

      const data = await res.json();
      return data.mixtapes || [];
    } catch (error) {
      console.error("Error fetching related mixtapes:", error);
      return [];
    }
  }

  const relatedMixtapes = await getRelatedMixtapes(mix, unique);

  if (!mix) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        {/* AlertCircle replaces the hand-drawn warning SVG */}
        <AlertCircle
          className="w-24 h-24 mb-6 text-indigo-500 dark:text-indigo-400"
          strokeWidth={1.5}
        />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Mixtape Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The mixtape you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicAlbum",
          "@id": `https://mixtapped.com/mixtape/${unique}`,
          name: mix.title,
          description: mix.desc,
          byArtist: { "@type": "Person", name: mix.djName },
          genre: mix.genre,
          image: mix.cover,
          datePublished: mix.time,
          track: {
            "@type": "MusicRecording",
            name: mix.title,
            duration: "N/A",
            inAlbum: mix.title,
          },
        })}
      </script>

      {/* Hero Section with Cover Art */}
      <div className="relative w-full h-56 sm:h-72 md:h-96 lg:h-[28rem] overflow-hidden rounded-md group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm opacity-80 transform scale-110 animate-subtle-float transition-all duration-3000"
          style={{
            backgroundImage: `url(${mix.imgthumb})`,
            animation: "subtle-float 30s ease-in-out infinite alternate",
            transformOrigin: "center",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/50 to-purple-900/40 mix-blend-overlay transition-opacity duration-1000 group-hover:opacity-70"></div>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.05] group-hover:opacity-[0.08] mix-blend-overlay pointer-events-none transition-opacity duration-1000"></div>

        {/* Floating music note decorations — FaMusic replaces both inline music-note SVGs */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 text-white/20 animate-float-slow pointer-events-none flex items-center justify-center">
          <FaMusic />
        </div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 text-white/15 animate-float-medium pointer-events-none flex items-center justify-center">
          <FaMusic />
        </div>

        {/* Centered title overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
          <div className="max-w-3xl w-full mx-auto bg-black/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 shadow-2xl transform translate-y-0 transition-all duration-700 group-hover:scale-105">
            <div className="flex items-center justify-center flex-wrap gap-1.5 mb-1">
              {(mix.genre || "Unknown").split(",").map((g) => g.trim()).filter(Boolean).map((g) => (
                <span key={g} className="px-3 py-1 bg-indigo-600/80 rounded-full text-xs text-white font-medium">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg text-center">
              {mix.title}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-300 text-sm sm:text-base">By</span>
              <Link
                href={`/dj/${mix.user.username}`}
                className="text-indigo-300 hover:text-indigo-200 text-sm sm:text-base font-medium hover:underline transition-colors"
              >
                {mix.djName}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto mt-4 md:-mt-16 lg:-mt-20 z-10 md:z-20 px-4 sm:px-6">
        {/* Mixtape Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Cover Art */}
            <div className="w-full md:w-1/3 lg:w-1/4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
              <div className="relative group w-full max-w-[250px] md:max-w-none">
                <div className="absolute inset-0 rounded-full bg-black shadow-xl transform scale-[0.85] group-hover:scale-[0.9] transition-transform duration-700 ease-out"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-900 to-gray-800 transform scale-[0.4] group-hover:scale-[0.45] transition-transform duration-700 ease-out">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-700 transform scale-[0.5]"></div>
                  <div className="absolute inset-0 rounded-full border border-gray-600 transform scale-[0.2]"></div>
                </div>

                <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl ring-4 ring-indigo-400/20 dark:ring-white/10 transform transition-all duration-500 ease-out group-hover:shadow-indigo-500/30 group-hover:scale-[1.02] before:absolute before:inset-0 before:z-10 before:bg-gradient-to-br before:from-black/0 before:via-black/0 before:to-black/30 before:opacity-60 group-hover:before:opacity-80 before:transition-opacity">
                  <div
                    className="absolute inset-0 z-20 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out transform translate-x-full group-hover:translate-x-[-180%] pointer-events-none"
                    style={{
                      width: "250%",
                      height: "500%",
                      top: "-100%",
                      left: "-100%",
                      transition:
                        "opacity 0.7s ease-in-out, transform 1.5s ease-in-out",
                    }}
                  ></div>

                  <Image
                    src={mix.imgthumb}
                    alt={mix.title}
                    fill
                    className="object-cover transition-all duration-10000 ease-in-out group-hover:scale-110 group-hover:rotate-1 z-0"
                    sizes="(max-width: 768px) 250px, 25vw"
                    priority
                  />

                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-80 transition-opacity duration-500"></div>

                  <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                          <FaMusic className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs text-white font-medium">
                          {mix.totalPlays.toLocaleString()} plays
                        </span>
                      </div>
                      <span className="text-xs text-white/80">
                        {new Date(mix.time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats and Info Section */}
            <div className="w-full md:w-2/3 lg:w-3/4 p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/90">
              <div className="flex flex-col h-full">
                {/* Primary Action Bar (Play & Download) */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-5 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center md:text-left w-full md:w-auto mb-6 md:mb-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Ready to listen?</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Stream or Download</h3>
                  </div>
                  
                  <div className="flex flex-row items-center justify-center sm:justify-end space-x-6 w-full md:w-auto">
                    {/* Primary Play CTA - Glass Circular */}
                    <div className="relative group bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg border border-gray-200/50 dark:border-gray-600/50 shadow-xl hover:bg-white/30 dark:hover:bg-gray-700/60 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center w-16 h-16 sm:w-16 sm:h-16 flex-shrink-0 cursor-pointer">
                      <AudioAdd id={mix.unique} iconOnly={true} className="w-full h-full group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.2)] dark:shadow-[0_0_15px_rgba(129,140,248,0.2)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    
                    {/* Primary Download CTA - Glass Circular */}
                    <div className="relative group bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg border border-gray-200/50 dark:border-gray-600/50 shadow-xl hover:bg-white/30 dark:hover:bg-gray-700/60 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center w-16 h-16 sm:w-16 sm:h-16 flex-shrink-0 cursor-pointer">
                      <DownloadBtn id={mix.unique} iconOnly={true} className="w-full h-full group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.2)] dark:shadow-[0_0_15px_rgba(74,222,128,0.2)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Release Date */}
                <div className="mb-8 flex items-center">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4">
                    <FaCalendarAlt className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Released
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {new Date(mix.time).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center transform transition-transform hover:scale-105 hover:shadow-md">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4">
                      <FaDownload className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Downloads
                      </p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {mix.totalDownloads.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <LikeCounter
                    initialCount={mix.totalLikes}
                    mixtapeId={unique}
                  />

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center transform transition-transform hover:scale-105 hover:shadow-md">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4">
                      <FaRegCirclePlay className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Plays
                      </p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {mix.totalPlays.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 sm:p-6 rounded-xl shadow-lg mt-6 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
          <div className="mb-3">
            {/* MoreHorizontal replaces the "..." dots SVG */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-1">
              <MoreHorizontal
                className="h-5 w-5 mr-2 text-indigo-500"
                strokeWidth={2}
              />
              Actions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interact with this mixtape
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Share Button */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl p-3 flex flex-col items-center transition-all duration-300 shadow-sm hover:shadow border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 h-full">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-2">
                  <Share id={unique} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Share
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Send to friends
                </span>
                {/* ArrowRight replaces the badge arrow SVG */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white text-xs">
                    <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </div>

            {/* Like Button */}
            {session && (
              <div className="relative group">
                <div
                  className={`bg-white dark:bg-gray-800/80 ${
                    liked
                      ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 shadow-md"
                      : "hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/50"
                  } rounded-xl p-3 flex flex-col items-center transition-all duration-500 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 h-full transform hover:scale-[1.02]`}
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                    <LikeBtn
                      id={unique}
                      likedparam={liked}
                      initialCount={mix.totalLikes}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {liked ? "Liked" : "Like"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {liked ? "Remove favorite" : "Add to favorites"}
                  </span>
                  {/* Heart replaces the badge heart SVG */}
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      <Heart className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-6 border border-gray-100 dark:border-gray-700">
          {/* Info replaces the "i" circle SVG */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-indigo-500" strokeWidth={2} />
            About This Mix
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {mix.desc ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: mix.desc.replace(
                      /(https?:\/\/[^\s]+)/g,
                      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline">$1</a>',
                    ),
                  }}
                />
              ) : (
                "No description available for this mixtape."
              )}
            </p>
          </div>
        </div>

        {/* DJ Profile */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href={`/dj/${mix.user.username}`}
              className="group flex items-center gap-4"
            >
              <div className="relative">
                <Image
                  src={mix.user.profilep}
                  alt={mix.djName}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-gray-200 dark:border-gray-600 group-hover:border-indigo-500 transition-colors object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {mix.djName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{mix.user.username}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                    DJ
                  </span>
                </div>
              </div>
            </Link>

            {/* ChevronRight replaces the ">" arrow SVG */}
            <Link
              href={`/dj/${mix.user.username}`}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <span>View Profile</span>
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Related Mixtapes Section */}
        {relatedMixtapes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg mt-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              {/* FaMusic replaces the music-staff SVG */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FaMusic className="h-5 w-5 mr-2 text-indigo-500" />
                More {(mix.genre || "").split(",")[0].trim()} Mixtapes
              </h3>
            </div>

            {/* Mobile scrollable row */}
            <div className="sm:hidden -mx-4 px-4 overflow-x-auto pb-4">
              <div className="flex space-x-3 w-max">
                {relatedMixtapes.map((relatedMix) => (
                  <Link
                    href={`/mix/${relatedMix.unique}`}
                    key={relatedMix.unique}
                    className="group flex-shrink-0 w-36"
                  >
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden shadow-md transition-all active:scale-95 touch-manipulation">
                      <div className="relative aspect-square w-36 h-36">
                        <Image
                          src={relatedMix.cover}
                          alt={relatedMix.title}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                          <div>
                            <h4 className="text-sm font-medium text-white truncate">
                              {relatedMix.title}
                            </h4>
                            <p className="text-xs text-gray-300 truncate">
                              {relatedMix.djName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedMixtapes.map((relatedMix) => (
                <Link
                  href={`/mix/${relatedMix.unique}`}
                  key={relatedMix.unique}
                  className="group"
                >
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden shadow-md transition-all group-hover:shadow-lg group-hover:scale-[1.02]">
                    <div className="relative aspect-square">
                      <Image
                        src={relatedMix.cover}
                        alt={relatedMix.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                        <span className="text-white text-sm font-medium">
                          View Mixtape
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {relatedMix.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {relatedMix.djName}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg mt-6 border border-gray-100 dark:border-gray-700 mb-12">
          {/* MessageSquare replaces the chat-bubble SVG */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
            <MessageSquare
              className="h-5 w-5 mr-2 text-indigo-500"
              strokeWidth={2}
            />
            Comments
          </h3>
          <CommentsPage comments={mix.comments} unique={unique} />
        </div>
      </div>
    </div>
  );
}
