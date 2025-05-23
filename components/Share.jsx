"use client";
import ShareModal from "@/app/(components)/Sharemodal";
import { useState } from "react";
import { BiShare } from "react-icons/bi";

const Share = ({ id }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div>
      <button
        onClick={() => setShow(true)}
        className="bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 p-3 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-300 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label="Share mixtape"
      >
        <BiShare className="w-5 h-5" />
      </button>
      {show && (
        <ShareModal
          show={show}
          onClose={() => setShow(false)}
          url={`https://mixtube.xyz/mix/${id}`}
        />
      )}
    </div>
  );
};

export default Share;
