"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Extracts N dominant colors from an image using a tiny canvas sample.
 * Returns an array of "r,g,b" strings.
 */
function extractColors(imgEl, count = 4) {
  try {
    const SIZE = 64; // sample at 64×64
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgEl, 0, 0, SIZE, SIZE);
    const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

    // Sample at evenly-spaced grid points
    const colors = [];
    const step = Math.floor(SIZE / count);
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const px = (i * step * SIZE + j * step) * 4;
        const r = data[px];
        const g = data[px + 1];
        const b = data[px + 2];
        // Skip near-black and near-white
        const brightness = (r + g + b) / 3;
        if (brightness > 20 && brightness < 235) {
          colors.push([r, g, b]);
        }
      }
    }

    // k-means–lite: cluster into `count` groups
    if (colors.length < count) {
      return colors.slice(0, count).map(([r, g, b]) => `${r},${g},${b}`);
    }

    // Pick evenly-spaced colours as initial centroids
    const interval = Math.floor(colors.length / count);
    const centroids = Array.from({ length: count }, (_, i) => [...colors[i * interval]]);

    for (let iter = 0; iter < 4; iter++) {
      const clusters = Array.from({ length: count }, () => []);
      for (const c of colors) {
        let best = 0, bestDist = Infinity;
        centroids.forEach(([cr, cg, cb], ci) => {
          const d = (c[0] - cr) ** 2 + (c[1] - cg) ** 2 + (c[2] - cb) ** 2;
          if (d < bestDist) { bestDist = d; best = ci; }
        });
        clusters[best].push(c);
      }
      centroids.forEach((_, ci) => {
        if (clusters[ci].length === 0) return;
        centroids[ci] = clusters[ci]
          .reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]])
          .map(v => Math.round(v / clusters[ci].length));
      });
    }

    return centroids.map(([r, g, b]) => `${r},${g},${b}`);
  } catch {
    return ["99,102,241", "217,70,239", "59,130,246", "16,185,129"];
  }
}

/**
 * Apple Music–style animated blob background.
 * Extracts colors from the album art and animates them as drifting blobs.
 */
export default function AnimatedBackground({ imgSrc, isPlaying }) {
  const [colors, setColors] = useState(["99,102,241", "217,70,239", "139,92,246", "59,130,246"]);
  const imgRef = useRef(null);
  const prevSrc = useRef(null);

  const extractAndSet = useCallback((imgEl) => {
    const extracted = extractColors(imgEl, 4);
    setColors(extracted);
  }, []);

  // When imgSrc changes, load it and extract colors
  useEffect(() => {
    if (!imgSrc || imgSrc === prevSrc.current) return;
    prevSrc.current = imgSrc;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => extractAndSet(img);
    img.onerror = () => {}; // keep previous colors on error
    img.src = imgSrc;
    imgRef.current = img;
  }, [imgSrc, extractAndSet]);

  const [c0, c1, c2, c3] = colors;

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-950" aria-hidden="true">
      {/* Animated blobs */}
      <div className="absolute inset-0">
        {/* Blob 0 — top-left */}
        <div
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: "70%",
            height: "70%",
            top: "-20%",
            left: "-15%",
            background: `radial-gradient(circle, rgba(${c0},0.55) 0%, transparent 70%)`,
            filter: "blur(60px)",
            animation: "blob-drift-0 12s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        {/* Blob 1 — top-right */}
        <div
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: "65%",
            height: "65%",
            top: "-10%",
            right: "-15%",
            background: `radial-gradient(circle, rgba(${c1},0.5) 0%, transparent 70%)`,
            filter: "blur(70px)",
            animation: "blob-drift-1 15s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        {/* Blob 2 — bottom-left */}
        <div
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: "60%",
            height: "60%",
            bottom: "-15%",
            left: "10%",
            background: `radial-gradient(circle, rgba(${c2},0.45) 0%, transparent 70%)`,
            filter: "blur(80px)",
            animation: "blob-drift-2 18s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        {/* Blob 3 — bottom-right */}
        <div
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: "55%",
            height: "55%",
            bottom: "-10%",
            right: "5%",
            background: `radial-gradient(circle, rgba(${c3},0.4) 0%, transparent 70%)`,
            filter: "blur(65px)",
            animation: "blob-drift-3 20s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        {/* Centre accent — pulses when playing */}
        <div
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: "40%",
            height: "40%",
            top: "30%",
            left: "30%",
            background: `radial-gradient(circle, rgba(${c0},0.25) 0%, transparent 70%)`,
            filter: "blur(50px)",
            animation: isPlaying
              ? "blob-pulse 4s ease-in-out infinite"
              : "blob-drift-0 18s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />
      </div>

      {/* Heavy dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      {/* Bottom fade to near-black */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />

      {/* Keyframe definitions injected inline */}
      <style>{`
        @keyframes blob-drift-0 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -20px) scale(1.05); }
          66%  { transform: translate(-20px, 30px) scale(0.96); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-drift-1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(-25px, 25px) scale(0.97); }
          66%  { transform: translate(20px, -30px) scale(1.06); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-drift-2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          40%  { transform: translate(20px, 20px) scale(1.04); }
          70%  { transform: translate(-30px, -10px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-drift-3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          30%  { transform: translate(-15px, -25px) scale(1.07); }
          65%  { transform: translate(25px, 15px) scale(0.94); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
