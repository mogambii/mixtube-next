import MixCard from "@/app/(components)/MixCard";
import prisma from "@/lib/prismadb";
import React from "react";
import { FaCompactDisc } from "react-icons/fa";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const RecentMixxes = async ({ username }) => {
  const [data, totalCount] = await Promise.all([
    prisma.user.findUnique({
      where: { username },
      include: {
        mixtapes: {
          orderBy: { time: "desc" },
          take: 10,
        },
      },
    }),
    prisma.mixtape.count({
      where: {
        user: { username },
      },
    }),
  ]);

  if (!data || !data.mixtapes?.length) {
    return (
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <FaCompactDisc className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
          <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <FaCompactDisc className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </span>
          Latest Mixtapes
        </h2>
        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/40">
          {totalCount} {totalCount === 1 ? "mixtape" : "mixtapes"}
        </span>
      </div>

      {/* Mixtape list */}
      <div className="divide-y divide-gray-50 dark:divide-gray-700/40 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 p-6">
        {data.mixtapes.map((mix) => (
          <MixCard
            key={mix.id}
            link={`/mix/${mix.unique}`}
            title={mix.title}
            year={mix.time}
            img={mix.imgthumb}
            downloads={mix.totalDownloads}
            Djname={mix.djName}
            plays={mix.totalPlays}
          />
        ))}
      </div>

      {/* View all link — only shown when there are more than 10 */}
      {hasMore && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/40">
          <Link
            href={`/dj/${username}/mixxes`}
            className="group flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200"
          >
            View all {totalCount} mixtapes
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentMixxes;
