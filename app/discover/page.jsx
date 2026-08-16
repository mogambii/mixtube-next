import React from "react";
import prisma from "@/lib/prismadb";
import SearchInputTrigger from "../(components)/SearchInputTrigger";
import DiscoverClient from "./DiscoverClient";

export const metadata = {
  title: "MixTapped - Discover Mixtapes",
  description: "Explore the latest mixtapes from top DJs",
};

// Force dynamic so we get the latest mixtapes on every request
export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  // Fetch initial mixtapes directly on the server
  const mixtapes = await prisma.mixtape.findMany({
    orderBy: {
      totalDownloads: "desc",
    },
    select: {
      id: true,
      title: true,
      imgthumb: true,
      unique: true,
      djName: true,
      totalPlays: true,
      totalDownloads: true,
    },
    take: 12,
  });

  // Serialize to ensure it can be passed to the Client Component
  const initialMixes = mixtapes.map((mix) => ({
    ...mix,
    totalPlays: Number(mix.totalPlays),
    totalDownloads: Number(mix.totalDownloads),
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 rounded-3xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent font-righteous tracking-wide">
              Discover
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
              Explore the latest mixtapes from top DJs
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-80">
              <SearchInputTrigger place="Search mixtapes..." />
            </div>
          </div>
        </div>

        {/* Client Component for Grid and Infinite Scroll */}
        <DiscoverClient initialMixes={initialMixes} />
        
      </div>
    </div>
  );
}
