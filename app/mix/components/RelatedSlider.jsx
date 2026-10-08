"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Headphones, Mic2 } from "lucide-react";

function formatCount(n = 0) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function RelatedSlider({ relatedMixtapes, genreTitle }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [relatedMixtapes]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!relatedMixtapes || relatedMixtapes.length === 0) return null;

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl p-5 sm:p-6 rounded-3xl border border-white/30 dark:border-white/5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Related Mixtapes
          </h3>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow Button (Desktop PC) */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="
              hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20
              h-11 w-11 rounded-full bg-gray-950/90 hover:bg-indigo-600 text-white
              border border-white/20 shadow-2xl backdrop-blur-md
              items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer
            "
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Right Arrow Button (Desktop PC) */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="
              hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20
              h-11 w-11 rounded-full bg-gray-950/90 hover:bg-indigo-600 text-white
              border border-white/20 shadow-2xl backdrop-blur-md
              items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer
            "
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="
            flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
            pb-1 pt-1 scrollbar-hide -mx-1 px-1
          "
        >
          {relatedMixtapes.map((mix) => (
            <Link
              href={`/mix/${mix.unique}`}
              key={mix.unique}
              className="
                shrink-0 w-36 sm:w-44 md:w-48 lg:w-52 snap-start group/card block
              "
            >
              <div className="
                relative bg-white/40 dark:bg-gray-900/60 border border-white/40 dark:border-white/10
                rounded-2xl overflow-hidden transition-all duration-300
                group-hover/card:border-indigo-500/40 group-hover/card:-translate-y-1
              ">
                {/* Artwork Box */}
                <div className="relative aspect-square overflow-hidden bg-gray-950">
                  <Image
                    src={mix.cover}
                    alt={mix.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity" />

                  {/* Plays Badge (Top Right) */}
                  {mix.totalPlays > 0 && (
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-gray-200 border border-white/10 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Headphones className="h-3 w-3 text-indigo-400" />
                      {formatCount(mix.totalPlays)}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-3">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate group-hover/card:text-indigo-400 transition-colors leading-tight">
                    {mix.title}
                  </h4>

                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {mix.user?.profilep ? (
                      <div className="relative w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={mix.user.profilep}
                          alt={mix.djName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Mic2 className="h-3 w-3 text-indigo-400 flex-shrink-0" />
                    )}
                    <span className="truncate font-medium">{mix.djName}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
