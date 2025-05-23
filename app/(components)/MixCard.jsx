import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaDownload, FaRegCirclePlay } from "react-icons/fa6";

const MixCard = ({ name, title, img, downloads, Djname, plays, link, loading }) => {
  return (
    <div className="p-2 w-full">
      <Link href={link} className="block transition-all duration-300 hover:translate-y-[-3px]">
        <div className="dark:bg-gray-800/90 bg-white rounded-xl flex flex-col sm:flex-row gap-3 p-3 w-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
          {/* Mixtape image with gradient overlay */}
          <div className="relative mx-auto sm:mx-0 h-36 w-36 sm:h-40 sm:w-40 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
            <Image
              priority={loading ? false : true}
              src={img ? img : "https://placehold.co/210x210"}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              alt={title}
              height={128}
              width={128}
              loading={loading ? "lazy" : "eager"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          </div>
          
          {/* Content area */}
          <div className="flex flex-col justify-between flex-1 py-1 text-center sm:text-left">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase overflow-hidden text-ellipsis line-clamp-2">
                {title ? title : "Title"}
              </h3>
              <h4 className="font-medium text-indigo-600 dark:text-indigo-400 text-xs uppercase mt-1 flex items-center justify-center sm:justify-start">
                <span className="mr-1">BY:</span> {Djname !== "null" ? Djname : name}
              </h4>
            </div>
            
            {/* Stats with improved styling */}
            <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-3 sm:mt-2">
              <div className="flex items-center gap-2 group">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-full">
                  <FaDownload className="text-indigo-600 dark:text-indigo-400 h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">{downloads}</h4>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-full">
                  <FaRegCirclePlay className="text-indigo-600 dark:text-indigo-400 h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">{plays}</h4>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MixCard;
