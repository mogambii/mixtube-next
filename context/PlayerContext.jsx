"use client";
import { createContext, useContext, useState, useRef } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentMix, setCurrentMix] = useState({
    id: null,
    audio: null,
    thumbnail: null,
  });
  const playedTracks = useRef(new Set());

  const playMix = async (id) => {
    try {
      const response = await fetch(`/api/mixdata/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch mixtape: ${response.statusText}`);
      }

      const mixData = await response.json();

      let audioUrl;
      if (mixData.hlsUrl) {
        // Best: HLS adaptive streaming
        audioUrl = mixData.hlsUrl;
      } else {
        // Fallback: CDN MP3 (compressed or raw)
        const rawUrl = mixData.compressed ? mixData.compressedUrl : mixData.audio;
        const filename = rawUrl?.split("/").pop();
        audioUrl = filename
          ? `https://files.mixtapped.com/${encodeURIComponent(filename)}`
          : rawUrl;
      }

      let waveformUrl = null;
      if (mixData.waveformUrl) {
        // If it contains a path-style structure, pass through CDN directly
        waveformUrl = mixData.waveformUrl.startsWith("https://files.mixtapped.com")
          ? mixData.waveformUrl
          : `https://files.mixtapped.com/hls/${id}/waveform.json`;
      }

      setCurrentMix({
        id:       id,
        audio:    audioUrl,
        imgthumb: mixData.imgthumb,
        title:    mixData.title,
        djName:   mixData.djName,
        genre:    mixData.genre,
        waveform: waveformUrl,
      });
    } catch (error) {
      console.error("Error loading mix:", error);
    }
  };

  const updatePlays = async (id) => {
    try {
      // Only update if this track hasn't been played in this session
      if (!playedTracks.current.has(id)) {
        const response = await fetch(`/api/mixtape/stats/play`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update plays: ${response.statusText}`);
        }

        // Mark this track as played in this session
        playedTracks.current.add(id);
      }
    } catch (error) {
      console.error("Error updating plays:", error);
    }
  };

  return (
    <PlayerContext.Provider value={{ currentMix, playMix, updatePlays }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
