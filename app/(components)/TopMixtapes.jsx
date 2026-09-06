import React from "react";
import MixCard from "./MixCard";
import prisma from "@/lib/prismadb";
export const dynamic = "force-dynamic";

export default async function TopMixList() {
  const getRecords = async () => {
    try {
      const oneMonthsAgo = new Date();
      oneMonthsAgo.setMonth(oneMonthsAgo.getMonth() - 1);

      // Aggregate stats from the last month per mixtape
      const trendingStats = await prisma.stats.groupBy({
        by: ["mixtapeId"],
        where: {
          date: {
            gte: oneMonthsAgo,
          },
        },
        _sum: {
          plays: true,
          downloads: true,
        },
        orderBy: [
          {
            _sum: {
              plays: "desc",
            },
          },
        ],
        take: 40,
      });

      if (!trendingStats.length) return [];

      // Re-sort by weighted trending score (plays + downloads * 2)
      const sortedStats = trendingStats.sort((a, b) => {
        const scoreA = (a._sum.plays ?? 0) + (a._sum.downloads ?? 0) * 2;
        const scoreB = (b._sum.plays ?? 0) + (b._sum.downloads ?? 0) * 2;
        return scoreB - scoreA;
      });

      const topMixtapeIds = sortedStats.slice(0, 18).map((s) => s.mixtapeId);

      // Fetch full mixtape details for the top IDs
      const mixtapes = await prisma.mixtape.findMany({
        where: {
          id: { in: topMixtapeIds },
        },
        select: {
          id: true,
          title: true,
          djName: true,
          imgthumb: true,
          unique: true,
          totalPlays: true,
          totalDownloads: true,
        },
      });

      // Preserve the trending order from sortedStats
      const mixtapeMap = new Map(mixtapes.map((m) => [m.id, m]));
      return topMixtapeIds.map((id) => mixtapeMap.get(id)).filter(Boolean);
    } catch (error) {
      console.error("Failed to fetch top mixtapes:", error);
      return [];
    }
  };

  const topMix = await getRecords();

  if (!topMix || topMix.length === 0) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              TRENDING{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                MIXTAPES
              </span>
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800/90 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No mixtapes available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-3 sm:py-8 px-1 sm:px-4">
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-8 bg-indigo-600 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            TRENDING{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              MIXTAPES
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {topMix.map((mix) => (
            <div key={mix.unique}>
              <MixCard
                link={`/mix/${mix.unique}`}
                Djname={mix.djName}
                title={mix.title}
                img={mix.imgthumb}
                downloads={mix.totalDownloads || 0}
                plays={mix.totalPlays || 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
