import React from "react";
import MixCard from "./MixCard";

// Force dynamic rendering for this component
export const dynamic = "force-dynamic";

export default async function TopMixList() {
  const getRecords = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home/topmixtapes`,
        {
          cache: "no-store", // Disable caching completely
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const records = await response.json();
      return records.mixtapes;
    } catch (error) {
      console.error("Failed to fetch top mixtapes:", error);
      return []; // Return empty array on error
    }
  };

  const topMix = await getRecords();

  // Handle case where topMix is undefined or null
  if (!topMix || topMix.length === 0) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              TOP{" "}
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
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-8 bg-indigo-600 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            TOP{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              MIXTAPES
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
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
