import React from "react";
import MixCard from "./MixCard";

async function getRecords() {
  try {
    const response = await fetch(`http://localhost:3000/api/home/newmixtapes`, {
      method: "GET",
      cache: "reload",
    });

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
      <div className="pb-6">
        <div className="w-full pl-4">
          <h2 className="font-bold dark:text-slate-200 py-3 text-2xl">
            NEW <span className="text-blue-700">MIXTAPES</span>
          </h2>
        </div>
        <p className="pl-4 text-gray-600 dark:text-slate-400">
          No new mixtapes available.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="w-full pl-4">
        <h2 className="font-bold dark:text-slate-200 py-3 text-2xl">
          NEW <span className="text-blue-700">MIXTAPES</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
        {newMix.map((mix) => (
          <div className="w-full" key={mix.unique}>
            <MixCard
              link={`/mix/${mix.unique}`}
              Djname={mix.djName}
              title={mix.title}
              year={new Date(mix.date).getFullYear()}
              img={mix.imgthumb}
              downloads={mix.engagement.downloads}
              plays={mix.engagement.plays || 0}
              loading={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
