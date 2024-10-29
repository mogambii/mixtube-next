"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { LiaStepBackwardSolid, LiaStepForwardSolid } from "react-icons/lia";
import { RiPauseLine, RiPlayFill } from "react-icons/ri";
import { Bars } from "react-loader-spinner";

function AudioPlayer() {
  const [id, setId] = useState(null);
  const [audio, setAudio] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [durationDisplay, setDurationDisplay] = useState("00:00");
  const [isBuffering, setIsBuffering] = useState(false);
  const [tooltipTime, setTooltipTime] = useState(null);

  const audioPlayer = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);

  const fetchMixData = async (id) => {
    if (!id) return null;
    try {
      const response = await fetch(`https://server-nezz.vercel.app/api/mixtape/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Failed to fetch mixtape: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch mixtape error:", error);
      return null;
    }
  };

  const loadAudio = async (id) => {
    const mixData = await fetchMixData(id);
    if (mixData) {
      setAudio(mixData.audio);
      setThumbnail(mixData.imgthumb);
    }
  };

  useEffect(() => {
    const idFromStorage = localStorage.getItem("mixtape-id");
    setId(idFromStorage);
    if (idFromStorage) loadAudio(idFromStorage);

    const handleStorageChange = () => {
      const newId = localStorage.getItem("mixtape-id");
      if (newId !== id) setId(newId);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (id) loadAudio(id);
  }, [id]);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.src = audio;
      audioPlayer.current.load();
      setIsPlaying(false);
    }
  }, [audio]);

  const togglePlay = () => {
    if (isPlaying) audioPlayer.current.pause();
    else audioPlayer.current.play();
    setIsPlaying((prev) => !prev);
  };

  const handleForward = () => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = Math.min(
        audioPlayer.current.currentTime + 10,
        audioPlayer.current.duration
      );
    }
  };

  const handleRewind = () => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = Math.max(audioPlayer.current.currentTime - 10, 0);
    }
  };

  const handleSeek = (e) => {
    const seekPosition = (e.nativeEvent.offsetX / e.target.clientWidth) * audioPlayer.current.duration;
    audioPlayer.current.currentTime = seekPosition;
  };

  const updateProgress = () => {
    if (audioPlayer.current) {
      const currentTime = audioPlayer.current.currentTime;
      const duration = audioPlayer.current.duration;

      setProgress((currentTime / duration) * 100);
      setCurrentTimeDisplay(formatTime(currentTime));
      setDurationDisplay(formatTime(duration));

      if (dotRef.current) {
        dotRef.current.style.left = `${(currentTime / duration) * 100}%`;
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const audioElement = audioPlayer.current;
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    if (audioElement) {
      audioElement.addEventListener("waiting", handleWaiting);
      audioElement.addEventListener("playing", handlePlaying);
      return () => {
        audioElement.removeEventListener("waiting", handleWaiting);
        audioElement.removeEventListener("playing", handlePlaying);
      };
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [audio]);

  const handleMouseMove = (e) => {
    if (progressRef.current && audioPlayer.current.duration) {
      const x = e.nativeEvent.offsetX;
      const time = (x / progressRef.current.clientWidth) * audioPlayer.current.duration;
      setTooltipTime(formatTime(time));
    }
  };

  if (!id) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-100 dark:bg-gray-900 text-gray-200 p-2 shadow-lg z-50 rounded-t-lg flex items-center justify-between">
      {thumbnail && (
        <Link href={`/mix/${id}`} className="w-16 h-16">
          <Image src={thumbnail} alt="Album Thumbnail" className="w-full h-full rounded-md object-cover" width={64} height={64} />
        </Link>
      )}

      <audio ref={audioPlayer} onTimeUpdate={updateProgress} onEnded={() => setIsPlaying(false)} />

      <div className="flex-1 mx-2">
        <div ref={progressRef} className="relative w-full h-1 bg-gray-600 rounded cursor-pointer" onClick={handleSeek} onMouseMove={handleMouseMove} onMouseLeave={() => setTooltipTime(null)}>
          <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `${progress}%` }} />
          <div ref={dotRef} className="absolute h-3 w-3 bg-blue-500 rounded-full" style={{ left: `${progress}%`, top: "50%", transform: "translate(-50%, -50%)" }} />
          {tooltipTime && (
            <div className="absolute top-0 left-0 mt-1 text-xs bg-gray-900 text-white rounded px-1 py-0.5">{tooltipTime}</div>
          )}
        </div>

        <div className="flex justify-between text-xs text-blue-500 mt-1">
          <div>{currentTimeDisplay}</div>
          <div>{durationDisplay}</div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button onClick={handleRewind} aria-label="Rewind 10 seconds" className="hover:text-blue-500">
          <LiaStepBackwardSolid className="h-5 w-5" />
        </button>
        <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="h-10 w-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
          {isBuffering ? <Bars height="20" width="20" color="#ffffff" /> : isPlaying ? <RiPauseLine className="h-6 w-6" /> : <RiPlayFill className="h-6 w-6" />}
        </button>
        <button onClick={handleForward} aria-label="Forward 10 seconds" className="hover:text-blue-500">
          <LiaStepForwardSolid className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default AudioPlayer;
