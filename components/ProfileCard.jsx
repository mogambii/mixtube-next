import Image from "next/image";
import React from "react";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const ProfileCard = ({ Djname, profilep, name, className = '' }) => {
  return (
    <div
      className={`group relative flex flex-col items-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 hover:border-indigo-300/50 dark:hover:border-indigo-500/50 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 h-full w-full p-4 sm:p-5 overflow-hidden ${className}`}
    >
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center mb-3 sm:mb-4">
          <Image
            src={
              optimizeCloudinaryUrl(profilep) ||
              "https://assets.practice365.co.uk/wp-content/uploads/sites/1005/2023/03/Default-Profile-Picture-Transparent.png"
            }
            className="rounded-full border-4 border-white/60 dark:border-gray-700 object-cover shadow-sm group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors duration-300"
            alt={`${Djname || name}'s profile picture`}
            width={160}
            height={160}
            priority
          />
        </div>
      </div>
      <div className="text-center z-10 w-full mt-auto">
        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-fuchsia-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 break-words line-clamp-1">
          {Djname || name}
        </h4>
      </div>
    </div>
  );
};

export default ProfileCard;
