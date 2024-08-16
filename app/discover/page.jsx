"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { Blocks } from "react-loader-spinner";
import MpNav from "../(components)/MpNav";
import MixCard from "../(components)/MixCard";

const Discovermixxes = () => {
  useEffect(() => {
    document.title = "MixTube - Discover Mixtapes";
  }, []);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mixes, setMixes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchMixes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://server-nezz.vercel.app/api/discover?page=${page}&limit=${limit}`
        );
        const data = await response.json();
        setMixes(data.results);
        setTotalRecords(data.totalmixtapes);
      } catch (error) {
        console.error("Error fetching mixes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMixes();
  }, [page, limit]);

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

  const renderMenu = () => (
    <div className="w-auto">
      <div className="hidden md:flex gap-x-5">
        <Link href="/discoverdjs">
          <button
            className="rounded-3xl px-3 py-1 font-righteous dark:text-slate-50 border-2 text-xs h-10"
            aria-label="Discover DJs"
          >
            Discover DJs
          </button>
        </Link>
        <Link href="/discover">
          <button
            className="rounded-3xl px-3 py-1 font-righteous dark:text-slate-50 border-2 text-xs h-10"
            aria-label="Discover Mixxes"
          >
            Discover Mixxes
          </button>
        </Link>
      </div>
      <div className="md:hidden">
        <button
          className="relative"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          onBlur={() => setOpen(false)}
        >
          <div className="ring-1 rounded-full p-3">
            {open ? (
              <IoClose className="h-4 w-4 dark:text-slate-50" />
            ) : (
              <CiMenuFries className="h-4 w-4 dark:text-slate-50" />
            )}
          </div>
        </button>
        {open && (
          <div className="shadow-1 absolute right-16 top-40 border-4 p-4 rounded-lg dark:border-slate-200 bg-slate-900 text-slate-50">
            <div className="grid gap-2 w-full">
              <Link href="/discoverdjs">
                <button
                  className="w-full rounded-3xl px-3 py-1 font-righteous dark:text-slate-50 border-2 text-xs h-10"
                  aria-label="Discover DJs"
                >
                  Discover DJs
                </button>
              </Link>
              <Link href="/discover">
                <button
                  className="w-full rounded-3xl px-3 py-1 font-righteous dark:text-slate-50 border-2 text-xs h-10"
                  aria-label="Discover Mixxes"
                >
                  Discover Mixxes
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen">
        <h5 className="dark:text-slate-50 py-2 pl-3 font-righteous">
          DISCOVER MIXTAPES
        </h5>
        <div className="flex justify-between gap-x-2">
          <Link href="/search" className="w-full">
            <MpNav place="search mixtape" />
          </Link>
          {renderMenu()}
        </div>
        <div className="grid items-center justify-center">
          {loading ? (
            <div className="grid justify-center items-center gap-3 min-h-screen">
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
                      link={`/mixtape/${mix.unique}/`}
                      Djname={mix.Djname}
                      title={mix.title}
                      name={mix.name}
                      img={mix.imgthumb}
                      downloads={mix.downloads}
                      likes={mix.likes}
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
