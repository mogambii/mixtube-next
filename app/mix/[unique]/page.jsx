import React from "react";
import { FaDownload, FaHeart, FaRegCirclePlay } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import CommentsPage from "@/app/(components)/Comments";
import DownloadBtn from "@/components/Download_btn";
import Share from "@/components/Share";
import LikeBtn, { LikeProvider } from "@/components/Like-btn";
import LikeCounter from "@/components/LikeCounter";
import AudioAdd from "@/app/(components)/AudioAdd";
import { getServerSession } from "next-auth";
import { FaCalendarAlt } from "react-icons/fa";
import dynamic from "next/dynamic";

// Dynamically import the LikeProvider with no SSR to avoid hydration issues
const DynamicLikeProvider = dynamic(
  () => import("@/components/Like-btn").then((mod) => mod.LikeProvider),
  { ssr: false }
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
      }
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
    const res = await fetch(`http://localhost:3000/api/mixtape/${unique}`, {
      cache: "no-cache",
    });
    if (!res.ok) throw new Error("Failed to fetch mixtape");
    return res.json();
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
    title: mix ? `${mix.title} | Mixtube` : "Mixtape Not Found",
    description:
      `${mix?.desc} mix on mixtapped | stream, play and download| by  ${
        mix?.djName || mix?.name
      }` || `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtube.`,
    keywords: [
      "mixtape",
      "music",
      "dj mix",
      mix?.genre || "genre",
      mix?.title || "mixtape",
      "Mixtube",
      mix?.djName || mix?.name,
    ],
    openGraph: {
      title: `${mix?.title || "Mixtape"} | Mixtube`,
      description:
        mix?.desc ||
        `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtube.`,
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
      title: `${mix?.title || "Mixtape"} | Mixtube`,
      description:
        mix?.desc ||
        `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtube.`,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://mixtapped.com/mixtape/${unique}`,
    },
  };
}

export default async function MixTape({ params }) {
  const session = await getServerSession();
  const { unique } = params;
  const liked = await checkLikeStatus(session?.user?.email, unique);
  const mix = await getMixtape(unique);

  // Fetch related mixtapes using the dedicated API endpoint
  async function getRelatedMixtapes(mixtape, currentId) {
    if (!mixtape || !mixtape.genre) return [];

    try {
      // Use our new dedicated related mixtapes API
      const res = await fetch(
        `http://localhost:3000/api/mixtape/related?genre=${encodeURIComponent(
          mixtape.genre
        )}&excludeId=${currentId}&limit=4`,
        {
          cache: "no-cache",
        }
      );

      if (!res.ok) {
        // Fallback to recent mixtapes if the related endpoint fails
        console.warn("Falling back to recent mixtapes API");
        const recentRes = await fetch(
          `http://localhost:3000/api/mixtape/recent?limit=4`,
          {
            cache: "no-cache",
          }
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
        <div className="w-24 h-24 mb-6 text-indigo-500 dark:text-indigo-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
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
          byArtist: {
            "@type": "Person",
            name: mix.djName,
          },
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
        {/* Animated gradient overlay with enhanced depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 z-10"></div>

        {/* Background image with advanced parallax effect */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm opacity-80 transform scale-110 animate-subtle-float transition-all duration-3000"
          style={{
            backgroundImage: `url(${mix.cover})`,
            animation: "subtle-float 30s ease-in-out infinite alternate",
            transformOrigin: "center",
          }}
        ></div>

        {/* Dynamic color overlay based on genre */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/50 to-purple-900/40 mix-blend-overlay transition-opacity duration-1000 group-hover:opacity-70"></div>

        {/* Animated particles effect with enhanced visibility */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.05] group-hover:opacity-[0.08] mix-blend-overlay pointer-events-none transition-opacity duration-1000"></div>

        {/* Floating music notes - decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 text-white/20 animate-float-slow pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 text-white/15 animate-float-medium pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Centered title overlay - always visible with enhanced styling */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
          <div className="max-w-3xl w-full mx-auto bg-black/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 shadow-2xl transform translate-y-0 transition-all duration-700 group-hover:scale-105">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="px-3 py-1 bg-indigo-600/80 rounded-full text-xs text-white font-medium">
                {mix.genre}
              </span>
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
            <div className="w-full md:w-1/3 lg:w-1/4 p-4 sm:p-6 md:p-8">
              <div className="relative group mx-auto max-w-[250px] md:max-w-none">
                {/* Vinyl record effect behind cover */}
                <div className="absolute inset-0 rounded-full bg-black shadow-xl transform scale-[0.85] group-hover:scale-[0.9] transition-transform duration-700 ease-out"></div>

                {/* Inner vinyl circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-900 to-gray-800 transform scale-[0.4] group-hover:scale-[0.45] transition-transform duration-700 ease-out">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-700 transform scale-[0.5]"></div>
                  <div className="absolute inset-0 rounded-full border border-gray-600 transform scale-[0.2]"></div>
                </div>

                {/* Main cover art with effects */}
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl ring-4 ring-indigo-400/20 dark:ring-white/10 transform transition-all duration-500 ease-out group-hover:shadow-indigo-500/30 group-hover:scale-[1.02] before:absolute before:inset-0 before:z-10 before:bg-gradient-to-br before:from-black/0 before:via-black/0 before:to-black/30 before:opacity-60 group-hover:before:opacity-80 before:transition-opacity">
                  {/* Shine effect */}
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
                    src={mix.cover}
                    alt={mix.title}
                    fill
                    className="object-cover transition-all duration-10000 ease-in-out group-hover:scale-110 group-hover:rotate-1 z-0"
                    sizes="(max-width: 768px) 250px, 25vw"
                    priority
                  />

                  {/* Overlay effects */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-80 transition-opacity duration-500"></div>

                  {/* Play button always visible, centered */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-600/90 shadow-xl flex items-center justify-center hover:scale-105 transition-transform duration-300 border-4 border-white/30">
                      <AudioAdd id={mix.unique} />
                    </div>
                  </div>

                  {/* Bottom info bar */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
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

              {/* Cover art bottom spacing */}
              <div className="mt-4 md:mt-0"></div>
            </div>

            {/* Stats and Info Section */}
            <div className="w-full md:w-2/3 lg:w-3/4 p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/90">
              <div className="flex flex-col h-full">
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

                {/* Stats Section - Both Mobile and Desktop */}
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

                  {/* Dynamic Like Counter Component */}
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              Actions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interact with this mixtape
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
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

                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Play Button */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800/80 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl p-3 flex flex-col items-center transition-all duration-300 shadow-sm hover:shadow border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 h-full">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                  <AudioAdd id={unique} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Play
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  stream the mixtape
                </span>

                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-800/80 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl p-3 flex flex-col items-center transition-all duration-300 shadow-sm hover:shadow border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 h-full">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                  <DownloadBtn id={unique} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Download
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Save offline
                </span>

                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            About This Mix
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {mix.desc ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: mix.desc.replace(
                      /(https?:\/\/[^\s]+)/g,
                      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline">$1</a>'
                    ),
                  }}
                />
              ) : (
                "No description available for this mixtape."
              )}
            </p>
          </div>
        </div>
        {/* DJ Profile - Horizontal Layout */}
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

            <Link
              href={`/dj/${mix.user.username}`}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <span>View Profile</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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

        {/* Related Mixtapes Section */}
        {relatedMixtapes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg mt-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-500"
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
                More {mix.genre} Mixtapes
              </h3>

              {/* <Link
                href={`/genre/${mix.genre.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
              >
                <span className="hidden sm:inline">View all</span>
                <span className="sm:hidden">All</span>
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
                    d="M9 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link> */}
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
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            Comments
          </h3>
          <CommentsPage comments={mix.comments} unique={unique} />
        </div>
      </div>
    </div>
  );
}
