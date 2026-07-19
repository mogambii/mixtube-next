import React, { useEffect, useRef, useState, useCallback } from "react";

const BAR_GAP = 2; // px gap between bars

export default function Waveform({ url, progress, onSeek, isPlaying }) {
  const [peaks, setPeaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoverX, setHoverX] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const peaksRef = useRef([]);
  const progressRef = useRef(progress);
  const hoverXRef = useRef(hoverX);

  // Keep refs in sync for use inside draw (avoids stale closures)
  useEffect(() => { peaksRef.current = peaks; }, [peaks]);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { hoverXRef.current = hoverX; }, [hoverX]);

  // ── Core draw function ─────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const currentPeaks = peaksRef.current;
    if (!canvas || !container || currentPeaks.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const W = container.getBoundingClientRect().width;
    const H = container.getBoundingClientRect().height;

    if (W === 0 || H === 0) return;

    // Set canvas resolution
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const totalBars = currentPeaks.length;
    // Compute bar width so bars fill the full container width
    const barW = Math.max(1, (W - (totalBars - 1) * BAR_GAP) / totalBars);
    const centerY = H / 2;
    const currentProgress = progressRef.current;
    const currentHoverX = hoverXRef.current;

    currentPeaks.forEach((val, i) => {
      const x = i * (barW + BAR_GAP);
      const barH = Math.max(3, val * H * 0.88);
      const y = centerY - barH / 2;
      const barProgress = (i / totalBars) * 100;
      const played = barProgress <= currentProgress;
      const hovered = currentHoverX !== null && barProgress <= currentHoverX;

      ctx.beginPath();
      const radius = Math.min(barW / 2, barH / 2);
      ctx.roundRect(x, y, barW, barH, radius);

      if (played) {
        const grad = ctx.createLinearGradient(x, y + barH, x, y);
        grad.addColorStop(0, "#6366f1");
        grad.addColorStop(1, "#d946ef");
        ctx.fillStyle = grad;
        ctx.shadowColor = "rgba(99, 102, 241, 0.4)";
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = hovered ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.15)";
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, []); // no deps — always reads from refs

  // ── Fetch & normalize waveform data ────────────────────────────────────────
  useEffect(() => {
    if (!url) { setPeaks([]); return; }
    let isMounted = true;
    setLoading(true);

    fetch(url)
      .then((r) => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
      .then((json) => {
        if (!isMounted) return;
        const raw = json.data || [];

        // Determine bar count from container width for pixel-perfect fit
        const containerW = containerRef.current?.getBoundingClientRect().width || 300;
        const TARGET_BARS = Math.min(150, Math.max(60, Math.floor(containerW / 4)));

        // 1. Trim trailing zeros from audiowaveform to fix "flat near the end"
        let validLength = raw.length;
        while (validLength > 0 && raw[validLength - 1] === 0) {
          validLength--;
        }

        const bars = [];
        let maxVal = 0;

        // 2. Simple Decimation (Sampling) instead of Bucketing
        // Bucketing (taking the max or average of a large window) artificially flattens compressed DJ mixes 
        // because every large window is guaranteed to contain a 100% peak.
        // Sampling just picks one point per window, preserving the chaotic, jagged look of a natural waveform.
        
        // audiowaveform outputs [min1, max1, min2, max2, ...]
        // We only care about the max values (odd indices)
        const totalPairs = Math.floor(validLength / 2);
        const step = Math.max(1, Math.floor(totalPairs / TARGET_BARS));
        
        for (let i = 0; i < TARGET_BARS; i++) {
          const pairIndex = i * step;
          const maxIndex = pairIndex * 2 + 1; // odd index is the max value
          
          if (maxIndex < validLength) {
            const val = Math.abs(raw[maxIndex]);
            if (val > maxVal) maxVal = val;
            bars.push(val);
          } else {
            bars.push(0);
          }
        }

        let normalized = bars.map((b) => Math.max(0.06, maxVal ? b / maxVal : 0.06));

        peaksRef.current = normalized;
        setPeaks(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => { isMounted = false; };
  }, [url]);

  // ── Redraw whenever peaks, progress or hoverX change ──────────────────────
  useEffect(() => { draw(); }, [peaks, progress, hoverX, draw]);

  // ── ResizeObserver: redraw on container size change ────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [draw]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setHoverX(((e.clientX - rect.left) / rect.width) * 100);
  };

  const handleClick = (e) => {
    if (!containerRef.current || !onSeek) return;
    const rect = containerRef.current.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
  };

  if (!url) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-14 sm:h-18 cursor-pointer transition-opacity duration-500 ${loading ? "opacity-30 animate-pulse" : "opacity-100"}`}
      style={{ height: "clamp(48px, 5vw, 72px)" }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverX(null)}
    >
      {/* Glow when playing */}
      {isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-indigo-500/10 blur-2xl rounded-full pointer-events-none" />
      )}

      {/* Canvas fills container exactly */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Hover scrubber line */}
      {hoverX !== null && (
        <div
          className="absolute top-0 bottom-0 w-px bg-white/50 z-10 pointer-events-none shadow-[0_0_6px_rgba(255,255,255,0.6)]"
          style={{ left: `${hoverX}%` }}
        />
      )}
    </div>
  );
}
