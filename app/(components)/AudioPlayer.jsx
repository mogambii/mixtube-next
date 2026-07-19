"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { LiaStepBackwardSolid, LiaStepForwardSolid } from "react-icons/lia";
import { RiPauseLine, RiPlayFill, RiVolumeUpFill, RiVolumeMuteFill } from "react-icons/ri";
import {
  ListMusic,
  ChevronDown,
  X,
  Music2,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";
import { FaSpinner } from "react-icons/fa6";
import Waveform from "./Waveform";
import AnimatedBackground from "./AnimatedBackground";

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
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // ── Layout state ───────────────────────────────────────────────────────────
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Fullscreen API ──────────────────────────────────────────────────────────
  const expandedPlayerRef = useRef(null);

  const toggleFullscreen = useCallback(() => {
    const el = expandedPlayerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() ||
        el.webkitRequestFullscreen?.() ||
        el.mozRequestFullScreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.mozCancelFullScreen?.();
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  // ── Playlist state ─────────────────────────────────────────────────────────
  const [playlist, setPlaylist] = useState([]);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeat, setRepeat] = useState(REPEAT.NONE);
  const [shuffledOrder, setShuffledOrder] = useState([]);

  const audioPlayer = useRef(null);
  const progressRef = useRef(null);
  const expandedProgressRef = useRef(null);
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
        const res = await fetch(
          `/api/mixtape/related?genre=${encodeURIComponent(currentMix.genre || "")}&excludeId=${currentMix.id}&limit=10`,
        );

        let items = [];

        if (res.ok) {
          const data = await res.json();
          items = data.mixtapes || [];
        }

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
    el.volume = isMuted ? 0 : volume;

    let hlsInstance = null;

    const startPlayback = () => {
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
      el.addEventListener("loadeddata", handleLoadedData, { once: true });
    };

    const isHLS = currentMix.audio.includes(".m3u8");

    if (isHLS) {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hlsInstance = new Hls({
            maxBufferLength: 15,          // Buffer less ahead of time (15s) to save bandwidth and speed up start
            maxMaxBufferLength: 30,       // Max buffer memory limit (30s)
            startFragPrefetch: true,      // Download first fragment ASAP
            enableWorker: true,           // Use Web Worker for parsing (faster)
            lowLatencyMode: false,
          });
          hlsInstance.loadSource(currentMix.audio);
          hlsInstance.attachMedia(el);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => startPlayback());
          hlsInstance.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              console.error("HLS fatal error:", data);
              setIsBuffering(false);
              setIsPlaying(false);
            }
          });
        } else if (el.canPlayType("application/vnd.apple.mpegurl")) {
          // Native HLS — Safari
          el.src = currentMix.audio;
          el.load();
          startPlayback();
        } else {
          console.warn("HLS not supported on this browser");
          setIsBuffering(false);
        }
      });
    } else {
      // Plain MP3 / CDN audio
      el.src = currentMix.audio;
      el.load();
      startPlayback();
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    };
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

  // ── Close expanded on Escape ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isExpanded) setIsExpanded(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isExpanded]);

  // ── Track end / auto-advance ───────────────────────────────────────────────
  const handleTrackEnd = useCallback(() => {
    if (repeat === REPEAT.ONE) {
      audioPlayer.current.currentTime = 0;
      audioPlayer.current.play();
      setIsPlaying(true);
      return;
    }

    const nextIdx = getNextIndex(playlistIndex);
    if (nextIdx === null) return;

    playFromIndex(nextIdx);
  }, [playlistIndex, playlist, repeat, isShuffle, shuffledOrder]);

  const getNextIndex = useCallback(
    (current) => {
      if (!playlist.length) return null;

      if (isShuffle) {
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

  const handleSeek = useCallback((e, ref) => {
    if (!audioPlayer.current || !ref?.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    audioPlayer.current.currentTime = ratio * audioPlayer.current.duration;
  }, []);

  const handleMouseMove = useCallback(
    (e, ref) => {
      if (ref?.current && audioPlayer.current?.duration) {
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = (x / rect.width) * audioPlayer.current.duration;
        setTooltipTime(formatTime(time));
      }
    },
    [formatTime],
  );

  const handleVolumeChange = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (audioPlayer.current) audioPlayer.current.volume = v;
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioPlayer.current) return;
    const next = !isMuted;
    setIsMuted(next);
    audioPlayer.current.volume = next ? 0 : volume;
  }, [isMuted, volume]);

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
    const indices = Array.from({ length: playlist.length }, (_, i) => i);
    setShuffledOrder(indices.sort(() => Math.random() - 0.5));
  };

  if (!currentMix?.audio) return null;

  // Parse genres
  const genres = (currentMix.genre || "")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  // ── EQ Bars ────────────────────────────────────────────────────────────────
  const EqBars = ({ count = 5, className = "" }) => (
    <div className={`flex items-end gap-[3px] ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${isPlaying ? "bg-current" : "bg-current opacity-40"}`}
          style={{
            height: isPlaying ? undefined : "30%",
            animation: isPlaying
              ? `music-bar${(i % 3) + 1} ${0.6 + i * 0.1}s ease-in-out infinite`
              : "none",
            minHeight: "4px",
            maxHeight: "100%",
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* ── Expanded Full-Screen Player ──────────────────────────────────── */}
      <div
        ref={expandedPlayerRef}
        className={`fixed inset-0 z-[60] transition-all duration-500 ease-in-out ${
          isExpanded
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{ willChange: "transform" }}
        aria-modal="true"
        role="dialog"
        aria-label="Music player"
      >
        {/* Animated Apple Music–style background */}
        <AnimatedBackground imgSrc={currentMix.imgthumb} isPlaying={isPlaying} />

        {/* Content */}
        <div className="relative h-full flex flex-col overflow-hidden max-w-[1800px] mx-auto w-full">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 pt-6 pb-3 flex-shrink-0">
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all"
              aria-label="Collapse player"
            >
              <ChevronDown className="h-5 w-5" />
              <span className="text-xs font-medium pr-1">Now Playing</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              {/* Queue toggle */}
              <button
                onClick={() => setShowPlaylist((p) => !p)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all border backdrop-blur-md ${
                  showPlaylist
                    ? "bg-indigo-500/30 text-indigo-100 border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "bg-black/20 text-white/70 border-white/10 hover:border-white/30 hover:text-white"
                }`}
                aria-label="Toggle queue"
              >
                <ListMusic className="h-3.5 w-3.5" />
                Queue
                {playlist.length > 0 && (
                  <span className="text-[10px] bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                    {playlist.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Main area — split when playlist open */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Player panel */}
            <div
              className={`flex flex-col transition-all duration-300 h-full overflow-y-auto sm:overflow-hidden ${
                showPlaylist ? "w-full sm:flex-1" : "w-full"
              }`}
            >
              {/* Album Art */}
              <div className="flex-1 min-h-[150px] w-full flex items-center justify-center px-8 sm:px-16 pt-2 pb-4">
                <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] mx-auto">
                  {/* Dynamic glow behind cover art */}
                  {currentMix.imgthumb && (
                    <div
                      className={`absolute inset-0 rounded-2xl bg-cover bg-center transition-all duration-1000 ${isPlaying ? "opacity-40 blur-2xl scale-105" : "opacity-20 blur-xl scale-95"}`}
                      style={{ backgroundImage: `url(${currentMix.imgthumb})` }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Card */}
                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden bg-gray-900 border border-white/5 transition-all duration-700 z-10 ${
                      isPlaying
                        ? "shadow-[0_20px_60px_rgba(0,0,0,0.6)] scale-100"
                        : "shadow-[0_10px_30px_rgba(0,0,0,0.3)] scale-95"
                    }`}
                  >
                    {currentMix.imgthumb ? (
                      <Image
                        src={currentMix.imgthumb}
                        alt={currentMix.title || "Now Playing"}
                        fill
                        className={`object-cover transition-all duration-700 ${
                          isPlaying ? "scale-100" : "scale-110 brightness-75"
                        }`}
                        sizes="(max-width: 640px) 280px, 320px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center">
                        <Music2 className="h-20 w-20 text-white/30" />
                      </div>
                    )}

                    {/* Vinyl ring overlay */}
                    <div
                      className={`absolute inset-0 rounded-full m-[30%] border border-white/20 pointer-events-none transition-opacity ${isPlaying ? "opacity-100" : "opacity-0"}`}
                      style={{ animation: isPlaying ? "spin 8s linear infinite" : "none" }}
                    />

                    {/* Playing bars overlay */}
                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/10 flex items-end justify-start p-3 pointer-events-none">
                        <div className="flex items-end gap-[3px] h-6" aria-hidden="true">
                          {[1, 2, 3, 4].map((i) => (
                            <span
                              key={i}
                              className="w-[3px] rounded-full bg-white"
                              style={{
                                animation: `music-bar${(i % 3) + 1} ${0.5 + i * 0.1}s ease-in-out infinite`,
                                height: "60%",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Track info */}
              <div className="px-6 sm:px-12 pb-3 text-center flex-shrink-0">
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  {genres.length > 0 ? (
                    genres.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-0.5 bg-white/10 backdrop-blur-sm text-white/80 text-[10px] font-semibold uppercase tracking-wide rounded-full border border-white/10"
                      >
                        {g}
                      </span>
                    ))
                  ) : null}
                </div>

                <Link
                  href={`/mix/${currentMix.id}`}
                  onClick={() => setIsExpanded(false)}
                  className="block text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent truncate hover:from-indigo-200 hover:to-fuchsia-200 transition-all duration-300"
                >
                  {currentMix.title}
                </Link>

                {currentMix.djName && (
                  <p className="text-white/50 text-sm mt-1 font-medium tracking-wide">
                    {currentMix.djName}
                  </p>
                )}
              </div>

              {/* Progress bar / Waveform — expanded */}
              <div className="px-6 sm:px-12 pb-4 flex-shrink-0">
                {currentMix.waveform ? (
                  <Waveform 
                    url={currentMix.waveform} 
                    progress={progress} 
                    isPlaying={isPlaying}
                    onSeek={(seekPercent) => {
                      if (audioPlayer.current) {
                        const newTime = (seekPercent / 100) * audioPlayer.current.duration;
                        audioPlayer.current.currentTime = newTime;
                        setProgress(seekPercent);
                      }
                    }}
                  />
                ) : (
                  <div
                    ref={expandedProgressRef}
                    className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer group mt-8 mb-4"
                    onClick={(e) => handleSeek(e, expandedProgressRef)}
                    onMouseMove={(e) => handleMouseMove(e, expandedProgressRef)}
                    onMouseLeave={() => setTooltipTime(null)}
                  >
                    {/* Shimmer glow when playing */}
                    {isPlaying && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-indigo-500/30 rounded-full bg-[length:200%_100%] animate-gradient-x" />
                    )}
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                    {/* Thumb */}
                    <div
                      className="absolute h-4 w-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -mt-[5px]"
                      style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
                    />
                    {tooltipTime && (
                      <div
                        className="absolute -top-8 text-[10px] bg-indigo-600 text-white rounded px-1.5 py-0.5 pointer-events-none -translate-x-1/2 shadow"
                        style={{ left: `${progress}%` }}
                      >
                        {tooltipTime}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-between text-[10px] text-white/50 mt-1.5">
                  <span>{currentTimeDisplay}</span>
                  <span>{durationDisplay}</span>
                </div>
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-center gap-4 sm:gap-7 px-6 pb-5 flex-shrink-0">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isShuffle
                      ? "text-fuchsia-400 bg-fuchsia-500/20 shadow-[0_0_12px_rgba(217,70,239,0.3)]"
                      : "text-white/30 hover:text-white/70"
                  }`}
                  aria-label="Shuffle"
                >
                  <Shuffle className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <button
                  onClick={handleRewind}
                  className="p-2.5 text-white/60 hover:text-white transition-all duration-200 hover:scale-110 active:scale-90 rounded-full hover:bg-white/10"
                  aria-label="Previous"
                >
                  <LiaStepBackwardSolid size={28} />
                </button>

                {/* Play / Pause — large */}
                <button
                  onClick={togglePlay}
                  className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isPlaying
                      ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-600 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                      : "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                  }`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isBuffering ? (
                    <FaSpinner
                      className={`h-6 w-6 animate-spin ${isPlaying ? "text-white" : "text-indigo-600"}`}
                    />
                  ) : isPlaying ? (
                    <RiPauseLine size={28} className="text-white" />
                  ) : (
                    <RiPlayFill size={28} className="text-indigo-700 ml-1" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={getNextIndex(playlistIndex) === null}
                  className="p-2.5 text-white/60 hover:text-white transition-all duration-200 hover:scale-110 active:scale-90 rounded-full hover:bg-white/10 disabled:opacity-20"
                  aria-label="Next"
                >
                  <LiaStepForwardSolid size={28} />
                </button>

                <button
                  onClick={cycleRepeat}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    repeat !== REPEAT.NONE
                      ? "text-fuchsia-400 bg-fuchsia-500/20 shadow-[0_0_12px_rgba(217,70,239,0.3)]"
                      : "text-white/30 hover:text-white/70"
                  }`}
                  aria-label={`Repeat: ${repeat}`}
                >
                  {repeat === REPEAT.ONE ? (
                    <Repeat1 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Repeat className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>

              {/* Volume control */}
              <div className="flex items-center justify-center gap-3 pb-6 flex-shrink-0">
                <button
                  onClick={toggleMute}
                  className="text-white/40 hover:text-white transition-colors flex-shrink-0"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <div className="relative flex items-center w-28 sm:w-36">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 appearance-none rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
                    style={{
                      background: `linear-gradient(to right, rgb(139 92 246) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.12) ${(isMuted ? 0 : volume) * 100}%)`,
                    }}
                    aria-label="Volume"
                  />
                </div>
                <span className="text-[10px] text-white/30 w-7 text-right font-mono">
                  {Math.round((isMuted ? 0 : volume) * 100)}
                </span>
              </div>

              {/* Playlist position */}
              {playlist.length > 1 && (
                <p className="text-center text-[10px] text-white/30 pb-4 flex-shrink-0">
                  {playlistIndex + 1} of {playlist.length}
                </p>
              )}
            </div>

            {/* Playlist panel */}
            {showPlaylist && (
              <div className="hidden sm:flex flex-col border-l border-white/10 flex-shrink-0" style={{ width: 'clamp(280px, 35%, 480px)' }}>
                <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
                  <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <ListMusic className="h-4 w-4 text-indigo-400" />
                    Up Next
                    <span className="text-white/40 text-xs font-normal">
                      ({playlist.length} tracks)
                    </span>
                  </h3>
                </div>
                <div
                  ref={playlistRef}
                  className="flex-1 overflow-y-auto divide-y divide-white/5"
                >
                  {isLoadingPlaylist ? (
                    <div className="flex items-center justify-center py-12">
                      <FaSpinner className="h-6 w-6 text-indigo-400 animate-spin" />
                    </div>
                  ) : (
                    playlist.map((track, idx) => {
                      const isActive = idx === playlistIndex;
                      return (
                        <button
                          key={track.unique || track.id || idx}
                          ref={isActive ? activeTrackRef : null}
                          onClick={() => playFromIndex(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                            isActive
                              ? "bg-indigo-500/20"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden">
                            {track.cover || track.imgthumb ? (
                              <Image
                                src={track.cover || track.imgthumb}
                                alt={track.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full bg-indigo-900/60 flex items-center justify-center">
                                <Music2 className="h-4 w-4 text-indigo-400" />
                              </div>
                            )}
                            {isActive && isPlaying && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="flex gap-[2px] items-end h-3 text-white">
                                  {[1, 2, 3].map((i) => (
                                    <span
                                      key={i}
                                      className="w-[2px] rounded-full bg-white"
                                      style={{
                                        animation: `music-bar${i} ${0.5 + i * 0.1}s ease-in-out infinite`,
                                        height: "60%",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-semibold truncate ${
                                isActive
                                  ? "text-indigo-300"
                                  : "text-white/80"
                              }`}
                            >
                              {track.title}
                            </p>
                            <p className="text-[10px] text-white/40 truncate">
                              {track.djName}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-mono flex-shrink-0 ${
                              isActive ? "text-indigo-400" : "text-white/30"
                            }`}
                          >
                            {isActive ? "▶" : String(idx + 1).padStart(2, "0")}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile queue (below controls, scrollable) */}
          {showPlaylist && (
            <div className="sm:hidden flex-shrink-0 border-t border-white/10 max-h-[220px] overflow-y-auto">
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-xs font-semibold text-white/60 flex items-center gap-2">
                  <ListMusic className="h-3.5 w-3.5 text-indigo-400" /> Queue
                </p>
              </div>
              {isLoadingPlaylist ? (
                <div className="flex justify-center py-6">
                  <FaSpinner className="h-5 w-5 animate-spin text-indigo-400" />
                </div>
              ) : (
                playlist.map((track, idx) => {
                  const isActive = idx === playlistIndex;
                  return (
                    <button
                      key={track.unique || track.id || idx}
                      onClick={() => playFromIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left ${
                        isActive ? "bg-indigo-500/20" : "hover:bg-white/5"
                      }`}
                    >
                      <div className="relative w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                        {track.cover || track.imgthumb ? (
                          <Image
                            src={track.cover || track.imgthumb}
                            alt={track.title}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        ) : (
                          <div className="w-full h-full bg-indigo-900/60 flex items-center justify-center">
                            <Music2 className="h-3 w-3 text-indigo-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-semibold truncate ${isActive ? "text-indigo-300" : "text-white/70"}`}>
                          {track.title}
                        </p>
                        <p className="text-[9px] text-white/40 truncate">{track.djName}</p>
                      </div>
                      {isActive && <span className="text-[10px] text-indigo-400">▶</span>}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Mini Player Bar (always at bottom) ───────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 w-full z-50 transition-all duration-300 ${
          isExpanded ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Thin progress line at very top of bar */}
        <div
          ref={progressRef}
          className="relative w-full h-1 bg-white/10 cursor-pointer group"
          style={{ background: "rgba(255,255,255,0.08)" }}
          onClick={(e) => handleSeek(e, progressRef)}
          onMouseMove={(e) => handleMouseMove(e, progressRef)}
          onMouseLeave={() => setTooltipTime(null)}
        >
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 bg-[length:200%_100%] animate-gradient-x" />
          )}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div
            ref={dotRef}
            className="absolute h-3 w-3 bg-white border-2 border-indigo-500 rounded-full shadow opacity-0 group-hover:opacity-100 -mt-1 transition-opacity"
            style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
          />
          {tooltipTime && (
            <div
              className="absolute -top-7 text-[10px] bg-indigo-600 text-white rounded px-1.5 py-0.5 -translate-x-1/2 pointer-events-none shadow"
              style={{ left: `${progress}%` }}
            >
              {tooltipTime}
            </div>
          )}
        </div>

        {/* Bar body */}
        <div className="bg-gray-950/90 backdrop-blur-2xl border-t border-white/8 px-3 sm:px-5 py-2.5 sm:py-3 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            {/* Album art — click to expand */}
            <button
              onClick={() => setIsExpanded(true)}
              className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform group"
              aria-label="Open full player"
            >
              {currentMix.imgthumb ? (
                <Image
                  src={currentMix.imgthumb}
                  alt="Now playing"
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              ) : (
                <div className="w-full h-full bg-indigo-900/60 flex items-center justify-center">
                  <Music2 className="h-4 w-4 text-indigo-400" />
                </div>
              )}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-[2px] items-end h-3">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="w-[2px] rounded-full bg-white"
                        style={{
                          animation: `music-bar${i} ${0.5 + i * 0.1}s ease-in-out infinite`,
                          height: "60%",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </button>

            {/* Track info — click to expand */}
            <button
              onClick={() => setIsExpanded(true)}
              className="flex-1 min-w-0 text-left"
              aria-label="Open full player"
            >
              <p className="text-xs sm:text-sm font-semibold text-white truncate leading-tight">
                {currentMix.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {isPlaying && !isBuffering && (
                  <div className="flex items-end gap-[2px] h-3 text-indigo-400" aria-hidden="true">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="w-[2px] rounded-full bg-indigo-400"
                        style={{
                          animation: `music-bar${i} ${0.6 + i * 0.1}s ease-in-out infinite`,
                          height: "60%",
                        }}
                      />
                    ))}
                  </div>
                )}
                <span className="text-[10px] text-white/40">
                  {currentTimeDisplay} / {durationDisplay}
                </span>
              </div>
            </button>

            {/* Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Prev — hidden on very small screens */}
              <button
                onClick={handleRewind}
                className="hidden xs:flex p-1.5 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Previous"
              >
                <LiaStepBackwardSolid size={18} />
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg ${
                  isPlaying
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                    : "bg-white"
                }`}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isBuffering ? (
                  <FaSpinner
                    className={`h-4 w-4 animate-spin ${isPlaying ? "text-white" : "text-indigo-600"}`}
                  />
                ) : isPlaying ? (
                  <RiPauseLine size={16} className="text-white" />
                ) : (
                  <RiPlayFill size={16} className="text-indigo-700 ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={getNextIndex(playlistIndex) === null}
                className="p-1.5 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10 disabled:opacity-30"
                aria-label="Next"
              >
                <LiaStepForwardSolid size={18} />
              </button>

              {/* Queue toggle — desktop only */}
              <button
                onClick={() => {
                  setIsExpanded(true);
                  setShowPlaylist(true);
                }}
                className="hidden sm:flex p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-full hover:bg-white/10"
                aria-label="Open queue"
              >
                <ListMusic className="h-4 w-4" />
              </button>

              {/* Expand arrow */}
              <button
                onClick={() => setIsExpanded(true)}
                className="hidden sm:flex p-1.5 text-white/30 hover:text-white/70 transition-colors"
                aria-label="Expand player"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

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

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type='range'] {
          accent-color: rgb(99 102 241);
        }
        input[type='range']::-webkit-slider-runnable-track {
          background: transparent;
        }
      `}</style>
    </>
  );
}

export default AudioPlayer;
