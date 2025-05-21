import React from "react";
import { FaDownload, FaHeart, FaRegCirclePlay } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import CommentsPage from "@/app/(components)/Comments";
import DownloadBtn from "@/components/Download_btn";
import Share from "@/components/Share";
import LikeBtn from "@/components/Like-btn";
import AudioAdd from "@/app/(components)/AudioAdd";
import { getServerSession } from "next-auth";

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
      `${mix?.desc} mix on mixtube | stream, play and download| by  ${
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
      canonical: `https://mixtube.com/mixtape/${unique}`,
    },
  };
}

export default async function MixTape({ params }) {
  const session = await getServerSession();
  const { unique } = params;
  const liked = await checkLikeStatus(session?.user?.email, unique);
  const mix = await getMixtape(unique);

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
          "@id": `https://mixtube.com/mixtape/${unique}`,
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

      <div className="max-w-6xl mx-auto dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 space-y-6">
        {/* Mixtape Information */}
        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
          {/* Cover Image */}
          <div className="w-full">
            <Image
              priority
              src={mix.cover}
              height={500}
              width={500}
              alt={`Cover image of ${mix.title}`}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>

          {/* Mixtape Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-slate-100 uppercase mb-3">
                {mix.title}
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  Genre:{" "}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {mix.genre}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Released:{" "}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {new Date(mix.time).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <FaDownload className="h-4 w-4" />
                <span>{mix.totalDownloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <FaHeart className="h-4 w-4" />
                <span>{mix.totalLikes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <FaRegCirclePlay className="h-4 w-4" />
                <span>{mix.totalPlays.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DJ Profile - Horizontal Layout */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <Link href={`/dj/${mix.user.username}`} className="group">
            <div className="flex items-center gap-4">
              <Image
                src={mix.user.profilep}
                alt={mix.djName}
                width={60}
                height={60}
                className="rounded-full border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition-colors"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors">
                  {mix.djName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{mix.user.username}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-700 p-4 md:p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
            About This Mix
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {mix.desc ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: mix.desc.replace(
                      /(https?:\/\/[^\s]+)/g,
                      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
                    ),
                  }}
                />
              ) : (
                "No description available for this mixtape."
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Share id={unique} />
              {session && <LikeBtn id={unique} likedparam={liked} />}
              <AudioAdd id={unique} />
            </div>
            <DownloadBtn url={mix.downloadUrl} />
          </div>
        </div>

        {/* Comments Section */}
        <CommentsPage comments={mix.comments} unique={unique} />
      </div>
    </div>
  );
}
