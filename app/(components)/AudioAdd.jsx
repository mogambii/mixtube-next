"use client";
import React from 'react';
import { IoPlay } from "react-icons/io5";

const AudioAdd = ({ id }) => {
  
  const SelectMix = (id) => {
    localStorage.setItem("mixtape-id", id);
  };

  return (
    <div>
      <button
        onClick={() => SelectMix(id)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-x-2"
      >
        Play <IoPlay/>
      </button>
    </div>
  );
};

export default AudioAdd;
