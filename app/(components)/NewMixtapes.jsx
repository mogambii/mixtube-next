import React from "react";
import MixCard from "./MixCard";

export default async function TopMixList() {
  async function getRecords() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/newmixtapes`,
        {
          method: "GET",
          cache :"reload"
        }
      );
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      return records;
    } catch (error) {
      console.error("Failed to fetch new mixtapes:", error);
    }
  }
  const newMix = await getRecords();
  const renderMixCards = () => {
    return newMix.map((mix) => (
      <div className="w-full" key={mix._id}>
        <MixCard
          link={`/mix/${mix.unique}`}
          Djname={mix.Djname}
          title={mix.title}
          year={mix.date}
          name={mix.name}
          img={mix.imgthumb}
          downloads={mix.downloads}
          likes={mix.likes}
        />
      </div>
    ));
  };

  return (
    <div className="pb-6">
      <div className="w-full pl-4">
        <h2 className="font-bold dark:text-slate-200 py-3 text-2xl">
          NEW <span className="text-blue-700">MIXTAPES</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
        {renderMixCards()}
      </div>
    </div>
  );
}
