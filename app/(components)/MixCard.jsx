import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaDownload, FaRegCirclePlay } from "react-icons/fa6";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const MixCard = ({
  name,
  title,
  img,
  downloads,
  Djname,
  plays,
  link,
  loading,
}) => {
  return (
    <div className="p-1 sm:p-2 w-full">
      <Link
        href={link}
        className="block transition-all duration-300 group"
      >
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl rounded-2xl flex flex-row items-center gap-3 sm:gap-4 p-2.5 sm:p-4 w-full shadow-md hover:shadow-lg transition-all duration-500 border border-white/40 dark:border-white/5 overflow-hidden relative">
          
          {/* Mixtape image with gradient overlay */}
          <div className="relative w-24 h-24 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden rounded-xl shadow-sm z-10">
            <Image
              priority={loading ? false : true}
              src={img ? optimizeCloudinaryUrl(img) : "https://placehold.co/210x210"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              alt={title}
              height={280}
              width={280}
              loading={loading ? "lazy" : "eager"}
            />
            {/* Darker bottom gradient for text contrast if needed, plus a subtle colored tint on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            
          </div>

          {/* Content area */}
          <div className="flex flex-col justify-between flex-1 py-1 text-start w-full min-w-0 z-10">
            <div className="w-full min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-base uppercase overflow-hidden text-ellipsis line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title ? title : "Title"}
              </h3>
              <div className="flex items-center justify-start mt-2 w-full min-w-0">
                <span className="font-semibold text-indigo-500 dark:text-indigo-400 text-xs uppercase mr-1.5 flex-shrink-0 tracking-wider">
                  BY:
                </span>
                <div className="min-w-0 max-w-full overflow-hidden">
                  <span className="font-bold text-gray-600 dark:text-gray-300 text-xs uppercase truncate block whitespace-nowrap">
                    {Djname !== "null" ? Djname : name}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats with glow styling */}
            <div className="flex items-center justify-start gap-4 sm:gap-6 mt-2">
              <div className="flex items-center gap-2 group/stat">
                <div className="bg-indigo-100/50 dark:bg-indigo-900/30 p-2 rounded-full border border-indigo-200/50 dark:border-indigo-800/30 shadow-sm group-hover/stat:bg-indigo-500 group-hover/stat:shadow-indigo-500/40 transition-all duration-300">
                  <FaDownload className="text-indigo-600 dark:text-indigo-400 h-3 w-3 sm:h-4 sm:w-4 group-hover/stat:text-white transition-colors" />
                </div>
                <h4 className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-bold">
                  {downloads}
                </h4>
              </div>
              <div className="flex items-center gap-2 group/stat">
                <div className="bg-fuchsia-100/50 dark:bg-fuchsia-900/30 p-2 rounded-full border border-fuchsia-200/50 dark:border-fuchsia-800/30 shadow-sm group-hover/stat:bg-fuchsia-500 group-hover/stat:shadow-fuchsia-500/40 transition-all duration-300">
                  <FaRegCirclePlay className="text-fuchsia-600 dark:text-fuchsia-400 h-3 w-3 sm:h-4 sm:w-4 group-hover/stat:text-white transition-colors" />
                </div>
                <h4 className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-bold">
                  {plays}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MixCard;
