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

  if(!email){
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
    if (!res.ok) throw new Error('Failed to fetch mixtape');
    return res.json();
  } catch (error) {
    console.error('Error:', error);
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
    description: `${mix?.desc} mix on mixtube | stream, play and download| by  ${mix?.djName || mix?.name}`  || `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtube.`,
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
      description: mix?.desc || `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtube.`,
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
      description: mix?.desc || `Explore ${mix?.djName || mix?.name}'s mixtape on Mixtube.`,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://mixtube.com/mixtape/${unique}`,
    },
  };
}

export default async function MixTape({ params}) {

  const session = await getServerSession();
  console.log(session)
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
      <div className="dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 space-y-8">
        {/* Mixtape Information */}
        <div className="flex flex-col md:flex-row pb-4 border-b border-gray-200 dark:border-gray-700 gap-6">
          <div className="w-full md:w-[200px]">
            <Image
              priority
              src={mix.cover}
              height={400}
              width={400}
              alt={`Cover image of ${mix.title}`}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
          <div className="grid items-center justify-center md:items-start text-center md:text-left">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-slate-100 uppercase">
              {mix.title}
            </h2>
            <Link
              href={`/dj/${mix.user.username}`}
              className="text-sm md:text-lg font-semibold text-blue-500 hover:underline"
            >
              {mix.djName}
            </Link>
            <div className="flex flex-col items-center md:items-start justify-between gap-2 md:gap-4 mt-2 md:mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(mix.time).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Genre: {mix.genre}</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 md:mt-6">
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <FaDownload />
                <span className="ml-1">{mix.totalDownloads}</span>
              </span>
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <FaHeart />
                <span className="ml-1">{mix.totalLikes}</span>
              </span>
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <FaRegCirclePlay className="dark:text-slate-50 h-5 w-5" />
                <span className="ml-2">{mix.totalPlays}</span>
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
        <div className="flex items-center justify-start gap-x-6">
          <Share id={unique} />
          {session && <LikeBtn id={unique} likedparam={liked} />}
          <AudioAdd id={unique} />
        </div>

        {/* Download Button */}
        <div>
          <DownloadBtn  id={unique} />
        </div>

        {/* Comments Section */}
        <CommentsPage comments={mix.comments} unique={unique} />
      </div>
    </div>
  );
}
