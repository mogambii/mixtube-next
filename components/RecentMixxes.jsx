import MixCard from "@/app/(components)/MixCard";
import React from "react";
import { FaCompactDisc } from "react-icons/fa";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const RecentMixxes = ({ username, mixtapes, totalCount }) => {

  if (!mixtapes || mixtapes.length === 0) {
    return (
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 bg-indigo-50/50 dark:bg-indigo-900/30 rounded-lg">
              <FaCompactDisc className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </span>
            Latest Mixtapes
          </h2>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-sm">
          No mixtapes yet.
        </p>
      </div>
    );
  }

  const hasMore = totalCount > 10;

  return (
    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 dark:border-white/10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
          <span className="p-2 bg-indigo-50/50 dark:bg-indigo-900/30 rounded-lg">
            <FaCompactDisc className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </span>
          Latest Mixtapes
        </h2>
      </div>

      {/* Mixtape list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-6">
        {mixtapes.map((mix) => (
          <div key={mix.unique} className="w-full">
            <MixCard
              link={`/mix/${mix.unique}`}
              title={mix.title}
              img={mix.imgthumb}
              downloads={mix.totalDownloads}
              Djname={mix.djName}
              plays={mix.totalPlays}
            />
          </div>
        ))}
      </div>

      {/* View all link — always shown */}
      <div className="px-6 py-4 border-t border-white/20 dark:border-white/10 bg-white/30 dark:bg-gray-800/30">
        <Link
          href={`/dj/${username}/mixxes`}
          className="group flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-white/40 dark:bg-gray-900/40 hover:bg-white/70 dark:hover:bg-gray-700/70 border border-white/20 dark:border-white/5 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          View all mixtapes
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default RecentMixxes;
