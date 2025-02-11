import React from "react";
import MixCard from "./MixCard";

export default async function TopMixList() {
  const getRecords = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/home/topmixtapes",
        {
          cache: "no-cache",
        }
      );
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      return records.mixtapes;
    } catch (error) {
      console.error("Failed to fetch top mixtapes:", error);
    }
  };
  const topMix = await getRecords();
  const topMixes = topMix.map((mix) => (
    <div className="w-full" key={mix.unique}>
      <MixCard
        link={`/mix/${mix.unique}`}
        Djname={mix.djName}
        title={mix.title}
        img={mix.imgthumb}
        downloads={mix.engagement.downloads}
        plays={mix.engagement.plays}
      />
    </div>
  ));

  return (
    <div className="p-0">
      <h2 className="font-bold ml-3 dark:text-sky-50 text-2xl mb-4">
        TOP <span className="text-blue-700">MIXTAPES</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
        {topMixes}
      </div>
    </div>
  );
}
