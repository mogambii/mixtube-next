"use client";
import React from "react";
import MpNav from "./MpNav";

export default function SearchInputTrigger({ place = "Search Mixtapes", className = "" }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("openSearch"))}
      className={`text-left ${className}`}
      aria-label={place}
    >
      <div className="w-full pointer-events-none">
        <MpNav place={place} />
      </div>
    </button>
  );
}
