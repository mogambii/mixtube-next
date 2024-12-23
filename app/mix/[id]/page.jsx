import React from "react";
import { FaDownload, FaHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import CommentsPage from "@/app/(components)/Comments";
import DownloadBtn from "@/components/Download_btn";
import Share from "@/components/Share";
import LikeBtn from "@/components/Like-btn";
import { cookies } from "next/headers";
import AudioAdd from "@/app/(components)/AudioAdd";

// Fetch mixtape data by ID
async function fetchMixData(id) {
  if (!id) return null;

  try {
    const response = await fetch(
      `https://server-nezz.vercel.app/api/mixtape/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok)
      throw new Error(`Failed to fetch mixtape: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("Fetch mixtape error:", error);
    return null;
  }
}

// Metadata generation for SEO
export async function generateMetadata({ params }) {
  const {id} = await params
  const mix = await fetchMixData(id);

  const defaultImageUrl = "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png";
  const imageUrl = mix?.imgthumb || defaultImageUrl;

  return {
    title: mix ? `${mix.title} | Mixtube` : "Mixtape Not Found",
    description: `${mix?.desc} mix on mixtube | stream, play and download| by  ${mix?.Djname || mix?.name}`  || `Explore ${mix?.Djname || mix?.name}'s mixtape on Mixtube.`,
    keywords: [
      "mixtape",
      "music",
      "dj mix",
      mix?.genre || "genre",
      mix?.title || "mixtape",
      "Mixtube",
      mix?.Djname || mix?.name,
    ],
    openGraph: {
      title: `${mix?.title || "Mixtape"} | Mixtube`,
      description: mix?.desc || `Explore ${mix?.Djname || mix?.name}'s mixtape on Mixtube.`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${mix?.Djname || mix?.name}'s mixtape cover`,
        },
      ],
      type: "music.song",
    },
    twitter: {
      card: "summary_large_image",
      title: `${mix?.title || "Mixtape"} | Mixtube`,
      description: mix?.desc || `Explore ${mix?.Djname || mix?.name}'s mixtape on Mixtube.`,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://mixtube.com/mixtape/${id}`,
    },
  };
}

export default async function MixTape({ params}) {
  const {id} = await params
  const cookieStore = await cookies();
  const token = cookieStore.get("mixtube-token")?.value;
  const username = cookieStore.get("mixtube-tokenname")?.value;

  const mix = await fetchMixData(id);
  let liked = null;

  if (token) {
    try {
      const results = await fetch(
        `https://server-nezz.vercel.app/api/checkliked?post=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      liked = await results.json();
    } catch (error) {
      console.log("Error checking liked status:", error);
    }
  }

  if (!mix) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h3 className="text-gray-700 dark:text-gray-300">An error occurred</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicAlbum",
          "@id": `https://mixtube.com/mixtape/${id}`,
          name: mix.title || "Mixtape",
          description: mix.desc || `Explore ${mix.Djname || mix.name}'s mixtape on Mixtube.`,
          byArtist: {
            "@type": "Person",
            name: mix.Djname || mix.name || "Unknown Artist",
          },
          genre: mix.genre || "N/A",
          image: mix.imgthumb || defaultImageUrl,
          datePublished: mix.date,
          track: {
            "@type": "MusicRecording",
            name: mix.title || "Track",
            duration: mix.duration || "N/A",
            inAlbum: mix.title || "Album",
          },
        })}
      </script>
      <div className="dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 space-y-8">
        {/* Mixtape Information */}
        <div className="flex flex-col md:flex-row pb-4 border-b border-gray-200 dark:border-gray-700 gap-6">
          <div className="w-full md:w-[200px]">
            <Image
              priority
              src={mix.imgthumb || defaultImageUrl}
              height={400}
              width={400}
              alt={`Cover image of ${mix.title || "Mixtape"}`}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
          <div className="grid items-center justify-center md:items-start text-center md:text-left">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-slate-100 uppercase">
              {mix.title || "Unknown Title"}
            </h2>
            <Link
              href={`/dj/${mix.name}`}
              className="text-sm md:text-lg font-semibold text-blue-500 hover:underline"
            >
              {mix.Djname || mix.name || "Unknown Artist"}
            </Link>
            <div className="flex flex-col items-center md:items-start justify-between gap-2 md:gap-4 mt-2 md:mt-4">
              <p className="text-gray-600 dark:text-gray-400">Year: {mix.date || "N/A"}</p>
              <p className="text-gray-600 dark:text-gray-400">Genre: {mix.genre || "N/A"}</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 md:mt-6">
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <FaDownload />
                <span className="ml-1">{mix.downloads || 0}</span>
              </span>
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <FaHeart />
                <span className="ml-1">{mix.likes || 0}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="ring-1 ring-gray-200 p-4 md:p-6 rounded-lg shadow-sm">
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2">
            Description
          </h3>
          <p className="text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap">
            {mix.desc ? (
              <span dangerouslySetInnerHTML={{
                __html: mix.desc.replace(
                  /(https?:\/\/[^\s]+)/g,
                  '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
                )
              }} />
            ) : (
              "No description available for this mixtape."
            )}
          </p>
        </div>

        {/* Share and Like Buttons */}
        <div className="flex items-center mt-4 gap-x-4">
          <Share id={id} />
          {token && <LikeBtn likedparam={liked?.liked} id={id} />}
          <AudioAdd id={id} />
        </div>

        {/* Download Button */}
        <div>
          <DownloadBtn url={mix.audio} id={id} />
        </div>

        {/* Comments Section */}
        <CommentsPage comment={mix.comments} id={id} token={token} username={username} />
      </div>
    </div>
  );
}
