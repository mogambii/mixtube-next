import React from "react";
import { FaDownload, FaHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import AudioPlayer from "@/app/(components)/audioplayer";
import CommentsPage from "@/app/(components)/Comments";
import Download_btn from "@/components/Download_btn";
import Share from "@/components/Share";
import Likebtn from "@/components/Like-btn";
import { cookies } from "next/headers";

async function fetchMixData(id) {
  if (!id) return null;
  
  try {
    const response = await fetch(
      `https://server-nezz.vercel.app/api/mixtape/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    
    if (!response.ok)
      throw new Error(`Failed to fetch mixtape: ${response.statusText}`);

    const record = await response.json();
    return record;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function generateMetadata({ params: { id } }) {
  const mix = await fetchMixData(id);
  
  if (!mix) {
    return {
      title: "Mixtape Not Found",
      description: "The mixtape you are looking for does not exist.",
    };
  }
  
  const imageUrl = mix.imgthumb || 'https://default-image-url.com/default.jpg';

  return {
    title: `${mix.title} | Mixtube`,
    description: mix.desc || `Explore ${mix.Djname || mix.name}'s mixtape on Mixtube.`,
    openGraph: {
      title: `${mix.title} | Mixtube`,
      description: mix.desc || `Explore ${mix.Djname || mix.name}'s mixtape on Mixtube.`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${mix.Djname || mix.name}'s mixtape cover`,
        },
      ],
      type: 'music.song',
    },
    twitter: {
      card: 'summary_large_image', // Enables the large image preview
      title: `${mix.title} | Mixtube`,
      description: mix.desc || `Explore ${mix.Djname || mix.name}'s mixtape on Mixtube.`,
      images: [imageUrl],
    },
  };
}

export default async function MixTape({ params: { id } }) {
  let liked;
  const token = cookies().get("mixtube-token")?.value
  const username = cookies().get("mixtube-tokenname")?.value

  const mix = await fetchMixData(id);
  async function checkLiked() {
    try {
      const results = await fetch(
        `https://server-nezz.vercel.app/api/checkliked?post=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await results.json();
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  
  if(token){
    liked = await checkLiked();
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
      <div className="dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row pb-4 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div className="w-full md:w-[200px]">
            <Image
              src={mix.imgthumb}
              height={300}
              width={300}
              alt={mix.title}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
          <div className="grid items-center justify-center md:items-start text-center md:text-left">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-slate-100 uppercase">
              {mix.title}
            </h2>
            <Link
              href={`/dj/${mix.name}`}
              className="text-sm md:text-lg font-semibold text-blue-500 hover:underline"
            >
              {mix.Djname ? mix.Djname : mix.name}
            </Link>
            <div className="flex flex-col items-center md:items-start justify-between gap-2 md:gap-4 mt-2 md:mt-4">
              <p className="text-gray-600 dark:text-gray-400">Year: {mix.date}</p>
              <p className="text-gray-600 dark:text-gray-400">Genre: {mix.genre}</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 md:mt-6">
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <FaDownload />
                <span className="ml-1">{mix.downloads}</span>
              </span>
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <FaHeart />
                <span className="ml-1">{mix.likes}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4 gap-x-4">
          <Share id={id} />
         {
          token &&  <Likebtn likedparam={liked.liked} id={id}  />
         }
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
          <h4 className="text-lg font-semibold dark:text-slate-50 text-slate-950">
            Listen Now
          </h4>
          <AudioPlayer audio={mix.audio} />
        </div>
        <div>
          <Download_btn url={mix.audio} id={id} />
        </div>

      <CommentsPage comment={mix.comments} id={id} token={token}  username={username}/>
      </div>
    </div>
  );
}
