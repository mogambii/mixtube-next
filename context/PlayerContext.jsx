"use client";
import { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentMix, setCurrentMix] = useState({
    id: null,
    audio: null,
    thumbnail: null
  });

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
      setCurrentMix({
        id,
        audio: mixData.audio,
        imgthumb: mixData.imgthumb,
        title: mixData.title
      });
    } catch (error) {
      console.error("Error loading mix:", error);
    }
  };

  const updatePlays = async (id) => {
    try {
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
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
