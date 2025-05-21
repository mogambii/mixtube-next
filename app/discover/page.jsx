"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Blocks } from "react-loader-spinner";
import MpNav from "../(components)/MpNav";
import MixCard from "../(components)/MixCard";
import NavMenu from "@/components/NavMenu";

const Discovermixxes = () => {
  useEffect(() => {
    document.title = "MixTube - Discover Mixtapes";
  }, []);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mixes, setMixes] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchMixes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/discover?page=${page}`);
        const data = await response.json();
        setMixes(data.mixtapes);
        setTotalRecords(data.totalmixtapes);
      } catch (error) {
        console.error("Error fetching mixes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMixes();
  }, [page]);

  const handleNextPage = () => {
    if (page * limit < totalRecords) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <h5 className="dark:text-slate-50 py-2 pl-3 font-righteous">
          DISCOVER MIXTAPES
        </h5>
        <header className="flex justify-between items-center p-0" role="banner">
          <Link
            href="/search"
            className="flex-1 mr-2"
            aria-label="Search Mixtapes"
          >
            <MpNav place="Search Mixtape" />
          </Link>
          <NavMenu />
        </header>
        <div className="grid items-center justify-center">
          {loading ? (
            <div className="grid justify-center items-center gap-3 min-h-[80vh]">
              <Blocks
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                visible={true}
              />
            </div>
          ) : (
            <div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-4">
                {mixes.map((mix) => (
                  <div className="w-full" key={mix.unique}>
                    <MixCard
                      link={`/mix/${mix.unique}/`}
                      Djname={mix.djName}
                      title={mix.title}
                      img={mix.imgthumb}
                      downloads={mix.totalDownloads}
                      plays={mix.totalPlays}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4 ring-1 ring-slate-50 p-2 rounded-lg">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg disabled:cursor-not-allowed disabled:bg-gray-400 w-24"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page * limit >= totalRecords}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg disabled:bg-gray-600 w-24"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Discovermixxes;
