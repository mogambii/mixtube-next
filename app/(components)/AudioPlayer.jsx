"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { LiaStepBackwardSolid, LiaStepForwardSolid } from "react-icons/lia";
import { RiPauseLine, RiPlayFill } from "react-icons/ri";
import {
  ListMusic,
  ChevronDown,
  ChevronUp,
  X,
  Music2,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";
import { FaSpinner } from "react-icons/fa6";

// ─── Repeat modes ────────────────────────────────────────────────────────────
const REPEAT = { NONE: "none", ALL: "all", ONE: "one" };

function AudioPlayer() {
  const { currentMix, playMix, updatePlays } = usePlayerContext();

  // ── Playback state ─────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [durationDisplay, setDurationDisplay] = useState("00:00");
  const [isBuffering, setIsBuffering] = useState(true);
  const [tooltipTime, setTooltipTime] = useState(null);
  const [wasPaused, setWasPaused] = useState(false);

  // ── Layout state ───────────────────────────────────────────────────────────
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // ── Playlist state ─────────────────────────────────────────────────────────
  const [playlist, setPlaylist] = useState([]);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeat, setRepeat] = useState(REPEAT.NONE);
  const [shuffledOrder, setShuffledOrder] = useState([]);

  const audioPlayer = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);
  const playlistRef = useRef(null);
  const activeTrackRef = useRef(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  const updateProgress = useCallback(() => {
    if (!audioPlayer.current) return;
    const { currentTime, duration } = audioPlayer.current;
    if (!isNaN(duration)) {
      setProgress((currentTime / duration) * 100);
      setCurrentTimeDisplay(formatTime(currentTime));
      setDurationDisplay(formatTime(duration));
      if (dotRef.current) {
        dotRef.current.style.left = `${(currentTime / duration) * 100}%`;
      }
      setIsBuffering(false);
    }
  }, [formatTime]);

  // ── Fetch related mixtapes when currentMix changes ─────────────────────────
  useEffect(() => {
    if (!currentMix?.id) return;

    const fetchRelated = async () => {
      setIsLoadingPlaylist(true);
      try {
        // Try genre-based related first
        const res = await fetch(
          `/api/mixtape/related?genre=${encodeURIComponent(currentMix.genre || "")}&excludeId=${currentMix.id}&limit=10`,
        );

        let items = [];

        if (res.ok) {
          const data = await res.json();
          items = data.mixtapes || [];
        }

        // Fallback to recent if not enough
        if (items.length < 5) {
          const recentRes = await fetch(`/api/mixtape/recent?limit=10`);
          if (recentRes.ok) {
            const recentData = await recentRes.json();
            const existing = new Set(items.map((m) => m.unique));
            const extras = recentData.filter(
              (m) => m.unique !== currentMix.id && !existing.has(m.unique),
            );
            items = [...items, ...extras].slice(0, 10);
          }
        }

        // Put current mix at the front so the playlist is self-contained
        const full = [
          {
            id: currentMix.id,
            unique: currentMix.id,
            title: currentMix.title,
            djName: currentMix.djName,
            imgthumb: currentMix.imgthumb,
            audio: currentMix.audio,
            genre: currentMix.genre,
          },
          ...items,
        ];

        setPlaylist(full);
        setPlaylistIndex(0);

        // Build a shuffled order (excludes index 0 since that's current)
        const indices = Array.from({ length: full.length }, (_, i) => i);
        setShuffledOrder(indices.sort(() => Math.random() - 0.5));
      } catch (err) {
        console.error("Failed to fetch related mixtapes:", err);
      } finally {
        setIsLoadingPlaylist(false);
      }
    };

    fetchRelated();
  }, [currentMix?.id]);

  // ── Scroll active track into view ──────────────────────────────────────────
  useEffect(() => {
    if (showPlaylist && activeTrackRef.current && playlistRef.current) {
      activeTrackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [playlistIndex, showPlaylist]);

  // ── Audio source changes ───────────────────────────────────────────────────
  useEffect(() => {
    if (!currentMix?.audio || !audioPlayer.current) return;

    setWasPaused(false);
    setIsBuffering(true);

    const el = audioPlayer.current;
    el.src = currentMix.audio;
    el.load();

    const handleLoadedData = async () => {
      try {
        await el.play();
        setIsPlaying(true);
        if (currentMix.id) updatePlays(currentMix.id);
      } catch {
        setIsPlaying(false);
      } finally {
        setIsBuffering(false);
      }
    };

    el.addEventListener("loadeddata", handleLoadedData);
    return () => el.removeEventListener("loadeddata", handleLoadedData);
  }, [currentMix, updatePlays]);

  // ── Audio event listeners ──────────────────────────────────────────────────
  useEffect(() => {
    const el = audioPlayer.current;
    if (!el) return;

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onEnded = () => {
      setIsPlaying(false);
      handleTrackEnd();
    };
    const onMetadata = () => {
      setDurationDisplay(formatTime(el.duration));
      setIsBuffering(false);
    };

    el.addEventListener("timeupdate", updateProgress);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("ended", onEnded);
    el.addEventListener("loadedmetadata", onMetadata);

    return () => {
      el.removeEventListener("timeupdate", updateProgress);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("loadedmetadata", onMetadata);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updateProgress,
    formatTime,
    playlist,
    playlistIndex,
    repeat,
    isShuffle,
    shuffledOrder,
  ]);

  // ── Responsive layout ──────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      setIsMiniPlayer(window.innerWidth < 640);
      if (window.innerWidth >= 640) setIsExpanded(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Track end / auto-advance ───────────────────────────────────────────────
  const handleTrackEnd = useCallback(() => {
    if (repeat === REPEAT.ONE) {
      audioPlayer.current.currentTime = 0;
      audioPlayer.current.play();
      setIsPlaying(true);
      return;
    }

    const nextIdx = getNextIndex(playlistIndex);
    if (nextIdx === null) return; // end of playlist, no repeat

    playFromIndex(nextIdx);
  }, [playlistIndex, playlist, repeat, isShuffle, shuffledOrder]);

  const getNextIndex = useCallback(
    (current) => {
      if (!playlist.length) return null;

      if (isShuffle) {
        // Find current position in shuffled order and advance
        const pos = shuffledOrder.indexOf(current);
        const nextPos = pos + 1;
        if (nextPos >= shuffledOrder.length) {
          return repeat === REPEAT.ALL ? shuffledOrder[0] : null;
        }
        return shuffledOrder[nextPos];
      }

      const next = current + 1;
      if (next >= playlist.length) {
        return repeat === REPEAT.ALL ? 0 : null;
      }
      return next;
    },
    [playlist, isShuffle, shuffledOrder, repeat],
  );

  const getPrevIndex = useCallback(
    (current) => {
      if (!playlist.length) return null;

      if (isShuffle) {
        const pos = shuffledOrder.indexOf(current);
        const prevPos = pos - 1;
        if (prevPos < 0)
          return repeat === REPEAT.ALL
            ? shuffledOrder[shuffledOrder.length - 1]
            : null;
        return shuffledOrder[prevPos];
      }

      const prev = current - 1;
      if (prev < 0) return repeat === REPEAT.ALL ? playlist.length - 1 : null;
      return prev;
    },
    [playlist, isShuffle, shuffledOrder, repeat],
  );

  const playFromIndex = useCallback(
    (idx) => {
      if (!playlist[idx]) return;
      const track = playlist[idx];
      setPlaylistIndex(idx);
      playMix(track.unique);
    },
    [playlist, playMix],
  );

  // ── Controls ───────────────────────────────────────────────────────────────
  const togglePlay = useCallback(async () => {
    if (!audioPlayer.current) return;
    try {
      if (isPlaying) {
        await audioPlayer.current.pause();
        setIsPlaying(false);
        setWasPaused(true);
      } else {
        await audioPlayer.current.play();
        if (wasPaused && currentMix?.id) {
          updatePlays(currentMix.id);
          setWasPaused(false);
        }
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Playback error:", err);
    }
  }, [isPlaying, wasPaused, currentMix?.id, updatePlays]);

  const handleForward = useCallback(() => {
    if (!audioPlayer.current) return;
    audioPlayer.current.currentTime = Math.min(
      audioPlayer.current.currentTime + 10,
      audioPlayer.current.duration,
    );
  }, []);

  const handleRewind = useCallback(() => {
    if (!audioPlayer.current) return;
    // If more than 3s in, restart track; else go to previous
    if (audioPlayer.current.currentTime > 3) {
      audioPlayer.current.currentTime = 0;
    } else {
      const prev = getPrevIndex(playlistIndex);
      if (prev !== null) playFromIndex(prev);
    }
  }, [playlistIndex, getPrevIndex, playFromIndex]);

  const handleNext = useCallback(() => {
    const next = getNextIndex(playlistIndex);
    if (next !== null) playFromIndex(next);
  }, [playlistIndex, getNextIndex, playFromIndex]);

  const handleSeek = useCallback((e) => {
    if (!audioPlayer.current || !progressRef.current) return;
    const seekPosition =
      (e.nativeEvent.offsetX / progressRef.current.clientWidth) *
      audioPlayer.current.duration;
    audioPlayer.current.currentTime = seekPosition;
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (progressRef.current && audioPlayer.current?.duration) {
        const x = e.nativeEvent.offsetX;
        const time =
          (x / progressRef.current.clientWidth) * audioPlayer.current.duration;
        setTooltipTime(formatTime(time));
      }
    },
    [formatTime],
  );

  const cycleRepeat = () =>
    setRepeat((r) =>
      r === REPEAT.NONE
        ? REPEAT.ALL
        : r === REPEAT.ALL
          ? REPEAT.ONE
          : REPEAT.NONE,
    );

  const toggleShuffle = () => {
    setIsShuffle((s) => !s);
    // Re-randomise order on toggle
    const indices = Array.from({ length: playlist.length }, (_, i) => i);
    setShuffledOrder(indices.sort(() => Math.random() - 0.5));
  };

  const toggleExpanded = useCallback(() => {
    if (isMiniPlayer) setIsExpanded((p) => !p);
  }, [isMiniPlayer]);

  if (!currentMix?.audio) return null;

  return (
    <>
      {/* ── Playlist Drawer ──────────────────────────────────────────────── */}
      {showPlaylist && (
        <div className="fixed bottom-[72px] sm:bottom-[76px] right-0 sm:right-4 w-full sm:w-80 z-50 shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-700">
            <div className="flex items-center gap-2">
              <ListMusic className="h-4 w-4 text-white/80" />
              <span className="text-sm font-semibold text-white tracking-wide">
                Up Next
              </span>
              <span className="text-xs text-white/60 ml-1">
                ({playlist.length} tracks)
              </span>
            </div>
            <button
              onClick={() => setShowPlaylist(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Track list */}
          <div
            ref={playlistRef}
            className="max-h-72 overflow-y-auto bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700"
          >
            {isLoadingPlaylist ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="h-6 w-6 text-indigo-500 animate-spin" />
              </div>
            ) : playlist.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                No tracks found
              </p>
            ) : (
              playlist.map((track, idx) => {
                const isActive = idx === playlistIndex;
                return (
                  <button
                    key={track.unique || track.id || idx}
                    ref={isActive ? activeTrackRef : null}
                    onClick={() => playFromIndex(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-10 h-10 flex-shrink-0 rounded-md overflow-hidden">
                      {track.cover || track.imgthumb ? (
                        <Image
                          src={track.cover || track.imgthumb}
                          alt={track.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                          <Music2 className="h-4 w-4 text-indigo-500" />
                        </div>
                      )}
                      {/* Playing indicator overlay */}
                      {isActive && isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="flex gap-[2px] items-end h-4">
                            <span
                              className="w-[3px] bg-white rounded-full animate-music-bar1"
                              style={{ height: "60%" }}
                            />
                            <span
                              className="w-[3px] bg-white rounded-full animate-music-bar2"
                              style={{ height: "100%" }}
                            />
                            <span
                              className="w-[3px] bg-white rounded-full animate-music-bar3"
                              style={{ height: "75%" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {track.djName}
                      </p>
                    </div>

                    {/* Track number / active indicator */}
                    <span
                      className={`text-[10px] font-mono flex-shrink-0 ${
                        isActive
                          ? "text-indigo-500"
                          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      }`}
                    >
                      {isActive ? (
                        <span className="text-indigo-500">▶</span>
                      ) : (
                        String(idx + 1).padStart(2, "0")
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── Player Bar ──────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-200 shadow-xl z-50 border-t border-gray-200 dark:border-gray-800 transition-all duration-500 ${
          isExpanded ? "h-auto rounded-t-xl" : "rounded-t-xl"
        }`}
      >
        {/* ── Progress bar ──────────────────────────────────────────────── */}
        <div
          ref={progressRef}
          className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 cursor-pointer group overflow-visible rounded-t-xl"
          onClick={handleSeek}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltipTime(null)}
        >
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 bg-[length:200%_100%] animate-gradient-x" />
          )}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div
            ref={dotRef}
            className="absolute h-3.5 w-3.5 bg-white border-2 border-indigo-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              left: `${progress}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          {tooltipTime && (
            <div
              className="absolute -top-8 text-xs bg-indigo-600 text-white rounded-md px-2 py-1 transform -translate-x-1/2 shadow-lg z-10 pointer-events-none"
              style={{ left: `${progress}%` }}
            >
              {tooltipTime}
            </div>
          )}
        </div>

        {/* ── Mini Player (mobile, collapsed) ───────────────────────────── */}
        {isMiniPlayer && !isExpanded && (
          <div
            className="px-3 py-2 flex items-center gap-2"
            onClick={toggleExpanded}
          >
            {/* Thumbnail */}
            <div className="relative w-9 h-9 flex-shrink-0 rounded-md overflow-hidden">
              {currentMix.imgthumb ? (
                <Image
                  src={currentMix.imgthumb}
                  alt="Now playing"
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : (
                <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <Music2 className="h-4 w-4 text-indigo-500" />
                </div>
              )}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="flex gap-[2px] items-end h-3">
                    <span
                      className="w-[2px] bg-white rounded-full animate-music-bar1"
                      style={{ height: "60%" }}
                    />
                    <span
                      className="w-[2px] bg-white rounded-full animate-music-bar2"
                      style={{ height: "100%" }}
                    />
                    <span
                      className="w-[2px] bg-white rounded-full animate-music-bar3"
                      style={{ height: "70%" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                {currentMix.title}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {currentTimeDisplay} / {durationDisplay}
              </p>
            </div>

            {/* Mini controls */}
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleNext}
                disabled={getNextIndex(playlistIndex) === null}
                className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 disabled:opacity-30 transition-colors"
                aria-label="Next track"
              >
                <LiaStepForwardSolid size={16} />
              </button>
              <button
                onClick={togglePlay}
                className={`p-2 rounded-full ${isPlaying ? "bg-indigo-600" : "bg-purple-600"} text-white`}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isBuffering ? (
                  <FaSpinner className="h-4 w-4 animate-spin text-white" />
                ) : isPlaying ? (
                  <RiPauseLine size={14} />
                ) : (
                  <RiPlayFill size={14} />
                )}
              </button>
            </div>

            <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </div>
        )}

        {/* ── Full Player (desktop, or mobile expanded) ──────────────────── */}
        {(!isMiniPlayer || isExpanded) && (
          <div className="px-3 py-2 sm:px-4 sm:py-2.5">
            {/* Mobile drag handle */}
            {isMiniPlayer && (
              <div className="flex justify-center mb-2">
                <button
                  onClick={toggleExpanded}
                  className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Collapse player"
                />
              </div>
            )}

            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              {/* ── Track info ───────────────────────────────────────────── */}
              <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[240px] order-1">
                {currentMix.imgthumb && (
                  <Link
                    href={`/mix/${currentMix.id}`}
                    className="relative group w-12 h-12 sm:w-13 sm:h-13 flex-shrink-0 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/40 to-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <Image
                      src={currentMix.imgthumb}
                      alt="Now playing"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      width={52}
                      height={52}
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="relative w-6 h-6">
                          <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
                          <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                            <div className="flex gap-[2px] items-end h-3">
                              <span
                                className="w-[3px] bg-purple-600 rounded-full animate-music-bar1"
                                style={{ height: "60%" }}
                              />
                              <span
                                className="w-[3px] bg-indigo-600 rounded-full animate-music-bar2"
                                style={{ height: "100%" }}
                              />
                              <span
                                className="w-[3px] bg-purple-600 rounded-full animate-music-bar3"
                                style={{ height: "75%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>
                )}

                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/mix/${currentMix.id}`}
                    className="font-bold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[160px] sm:max-w-[200px] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {currentMix.title}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                      Now Playing
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {currentTimeDisplay} / {durationDisplay}
                    </span>
                  </div>
                  {/* Track position in playlist */}
                  {playlist.length > 1 && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {playlistIndex + 1} / {playlist.length}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Playback controls ─────────────────────────────────────── */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto order-2 sm:mx-auto">
                {/* Shuffle */}
                <button
                  onClick={toggleShuffle}
                  className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                    isShuffle
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30"
                      : "text-gray-400 dark:text-gray-500 hover:text-indigo-500"
                  }`}
                  aria-label="Shuffle"
                >
                  <Shuffle className="h-4 w-4" />
                </button>

                {/* Rewind / Prev */}
                <button
                  onClick={handleRewind}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-full transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:scale-110 active:scale-95"
                  aria-label="Previous / Rewind"
                >
                  <LiaStepBackwardSolid size={20} />
                </button>

                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    isPlaying
                      ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30"
                      : "bg-purple-600 hover:bg-purple-700 hover:shadow-purple-500/30"
                  } text-white shadow-md`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isBuffering ? (
                    <FaSpinner className="h-5 w-5 animate-spin text-white" />
                  ) : isPlaying ? (
                    <RiPauseLine size={22} />
                  ) : (
                    <RiPlayFill size={22} />
                  )}
                </button>

                {/* Forward / Next */}
                <button
                  onClick={handleForward}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-full transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:scale-110 active:scale-95"
                  aria-label="Forward / Next"
                >
                  <LiaStepForwardSolid size={20} />
                </button>

                {/* Repeat */}
                <button
                  onClick={cycleRepeat}
                  className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                    repeat !== REPEAT.NONE
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30"
                      : "text-gray-400 dark:text-gray-500 hover:text-indigo-500"
                  }`}
                  aria-label={`Repeat: ${repeat}`}
                >
                  {repeat === REPEAT.ONE ? (
                    <Repeat1 className="h-4 w-4" />
                  ) : (
                    <Repeat className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* ── Right: playlist toggle ─────────────────────────────────── */}
              <div className="flex items-center gap-2 sm:ml-auto order-3">
                <button
                  onClick={() => setShowPlaylist((p) => !p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    showPlaylist
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:text-indigo-500"
                  }`}
                  aria-label="Toggle playlist"
                >
                  <ListMusic className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Queue</span>
                  {playlist.length > 0 && (
                    <span
                      className={`text-[10px] rounded-full px-1 font-bold ${
                        showPlaylist
                          ? "bg-white/20 text-white"
                          : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      {playlist.length}
                    </span>
                  )}
                </button>

                {isMiniPlayer && (
                  <button
                    onClick={toggleExpanded}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Collapse"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hidden audio element */}
        <audio
          ref={audioPlayer}
          onTimeUpdate={updateProgress}
          onEnded={() => {
            setIsPlaying(false);
            handleTrackEnd();
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error("Audio error:", e);
            setIsPlaying(false);
            setIsBuffering(false);
          }}
        />
      </div>
    </>
  );
}

export default AudioPlayer;
