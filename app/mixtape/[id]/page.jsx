import React from "react";
import Head from "next/head";
import { FaDownload, FaHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import AudioPlayer from "@/app/(components)/audioplayer";
import CommentsPage from "@/app/(components)/Comments";
import Download_btn from "@/components/Download_btn";
import Share from "@/components/Share";
import Likebtn from "@/components/Like-btn";

const MixTape = async ({ params: { id } }) => {
  const fetchMixData = async () => {
    if (!id) return;

    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/mixtape/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "reload",
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch mixtape: ${response.statusText}`);

      const record = await response.json();
      return record;
    } catch (error) {
      console.error(error.message);
    }
  };

  const mix = await fetchMixData();
  if (!mix) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h3 className="text-gray-700 dark:text-gray-300">An error occurred</h3>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{mix.title} | Mixtape by {mix.Djname ? mix.Djname : mix.name}</title>
        <meta name="description" content={`${mix.title} by ${mix.Djname ? mix.Djname : mix.name} - Listen and download.`} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${mix.title} | Mixtape by ${mix.Djname ? mix.Djname : mix.name}`} />
        <meta property="og:description" content={`${mix.title} by ${mix.Djname ? mix.Djname : mix.name} - Listen and download.`} />
        <meta property="og:image" content={mix.imgthumb} />
        <meta property="og:url" content={`https://mixtube-next.vercel.app/mixtape/${mix._id}`} />
        <meta property="og:type" content="music.song" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${mix.title} | Mixtape by ${mix.Djname ? mix.Djname : mix.name}`} />
        <meta name="twitter:description" content={`${mix.title} by ${mix.Djname ? mix.Djname : mix.name} - Listen and download.`} />
        <meta name="twitter:image" content={mix.imgthumb} />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
        <div className="dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 space-y-6">
          <div className="flex flex-col xx:flex-row pb-4 border-b border-gray-200 dark:border-gray-700 gap-4">
            <div className="w-full xx:w-[200px]">
              <Image
                src={mix.imgthumb}
                height={300}
                width={300}
                alt={mix.title}
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            </div>
            <div className="grid items-center justify-center xx:items-start text-center xx:text-left">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-slate-100 uppercase">
                {mix.title}
              </h2>
              <Link
                href={`/dj/${mix.name}`}
                className="text-sm md:text-lg font-semibold text-blue-500 hover:underline"
                suppressHydrationWarning
              >
                {mix.Djname ? mix.Djname : mix.name}
              </Link>
              <div className="flex flex-col items-center xx:items-start justify-between gap-2 xx:gap-4 mt-2 xx:mt-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Year: {mix.date}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Genre: {mix.genre}
                </p>
              </div>
              <div className="flex items-center justify-center xx:justify-start gap-4 mt-4 xx:mt-6">
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
            <Share id={mix._id} />
            <Likebtn id={mix._id} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
            <h4 className="text-lg font-semibold dark:text-slate-50 text-slate-950">
              Listen Now
            </h4>
            <AudioPlayer audio={mix.audio} />
          </div>
          <div>
            <Download_btn url={mix.audio} />
          </div>

          {<CommentsPage comment={mix.comments} id={mix._id} />}
        </div>
      </div>
    </>
  );
};

export default MixTape;
