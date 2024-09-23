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
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300 flex items-center justify-center gap-x-1 ring-1"
      >
        Share <BiShare />
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
