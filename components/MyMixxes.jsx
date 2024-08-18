"use client";

import MixCard from "@/app/(components)/MixCard";
import { useEffect, useState } from "react";
import { Blocks } from "react-loader-spinner";

const MyMixxes = ({ username }) => {
  const [mixes, setMixes] = useState([]);
  const [loadingMixes, setLoadingMixes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 4;
  useEffect(() => {
    async function getMixes() {
      setLoadingMixes(true);
      try {
        const mixResponse = await fetch(
          `https://server-nezz.vercel.app/api/search/mixtapes?search=${username}&page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!mixResponse.ok)
          throw new Error(`Error: ${mixResponse.statusText}`);

        const mixData = await mixResponse.json();

        setMixes(mixData.results);
        setPageCount(Math.ceil(mixData.totalmixtapes / itemsPerPage));
      } catch (error) {
        console.error(error);
        setLoadingMixes(false);
      } finally {
        setLoadingMixes(false);
      }
    }

    getMixes();
  }, [username, currentPage, itemsPerPage]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const createPaginationControls = () => {
    const controls = [];
    for (let i = 1; i <= pageCount; i++) {
      controls.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`border px-3 py-1 rounded-md mx-1 ${
            currentPage === i ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return controls;
  };
  return (
    <div>
      {loadingMixes ? (
        <div className="h-[390px] flex justify-center items-center">
          <Blocks
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="blocks-loading"
            wrapperClass="blocks-wrapper"
            visible={true}
          />
        </div>
      ) : mixes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mixes.map((mix) => (
              <MixCard
                link={`/mix/${mix.unique}`}
                key={mix.unique}
                Djname={mix.Djname}
                title={mix.title}
                year={mix.date}
                name={mix.name}
                img={mix.imgthumb}
                downloads={mix.downloads}
                likes={mix.likes}
              />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {createPaginationControls()}
          </div>
        </>
      ) : (
        <div className="h-[370px] flex items-center justify-center">
          <h4 className="dark:text-slate-50 text-center font-righteous font-thin text-xs">
            No mixes
          </h4>
        </div>
      )}
    </div>
  );
};

export default MyMixxes;
