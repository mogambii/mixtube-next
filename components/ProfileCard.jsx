import Image from "next/image";
import React from "react";

const ProfileCard = ({ Djname, profilep, name, className = '' }) => {
  return (
    <div
      className={`group relative flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full w-full p-3 sm:p-4 overflow-hidden border border-gray-100 dark:border-gray-700 ${className}`}
    >
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-indigo-500/10 dark:from-indigo-400/5 dark:to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center mb-3 sm:mb-4">
          <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-400/20 transition-colors duration-300" />
          <Image
            src={
              profilep ||
              "https://assets.practice365.co.uk/wp-content/uploads/sites/1005/2023/03/Default-Profile-Picture-Transparent.png"
            }
            className="rounded-full border-4 border-white dark:border-gray-700 object-cover shadow-md group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors duration-300"
            alt={`${Djname || name}'s profile picture`}
            width={160}
            height={160}
            priority
          />
        </div>
      </div>
      <div className="text-center z-10 w-full">
        <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 break-words line-clamp-1">
          {Djname || name}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 truncate w-full">
          View Profile
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
