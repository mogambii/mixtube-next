import React from "react";
import MixCard from "./MixCard";

// Force dynamic rendering for this component
export const dynamic = "force-dynamic";

async function getRecords() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/home/newmixtapes`,
      {
        cache: "no-store", // Disable caching completely
      }
    );

    if (!response.ok) {
      console.error(`Error fetching mixtapes: ${response.statusText}`);
      return [];
    }

    const records = await response.json();
    return records.mixtapes;
  } catch (error) {
    console.error("Failed to fetch new mixtapes:", error);
    return [];
  }
}

export default async function TopMixList() {
  const newMix = await getRecords();

  if (!newMix || newMix.length === 0) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              NEW{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                MIXTAPES
              </span>
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800/90 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No new mixtapes available.
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
            NEW{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              MIXTAPES
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lgd:grid-cols-2 xl:grid-cols-3 gap-2">
          {newMix.map((mix) => (
            <div key={mix.unique}>
              <MixCard
                link={`/mix/${mix.unique}`}
                Djname={mix.djName}
                title={mix.title}
                year={new Date(mix.time).getFullYear()}
                img={mix.imgthumb}
                downloads={mix.totalDownloads || 0}
                plays={mix.totalPlays || 0}
                loading={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
