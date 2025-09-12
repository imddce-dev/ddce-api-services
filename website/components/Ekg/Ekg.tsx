"use client";
import React from "react";

type Props = {
  className?: string;
  strokeWidth?: number;
  opacityClass?: string;
};

export default function EKGLine({
  className = "",
  strokeWidth = 2.6,
  opacityClass = "opacity-35",
}: Props) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 2000 160"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 w-[200vw] max-w-none h-[120px] md:h-[140px] ${className}`}
    >
      <defs>
        <linearGradient id="ekg-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      <path
        d="M0,80 L120,80 170,30 210,130 250,80 420,80 460,28 500,132 540,80 820,80 860,30 900,130 940,80 1180,80 1220,28 1260,132 1300,80 1600,80 1640,28 1680,132 1720,80 1860,80 1900,30 1940,130 2000,80"
        fill="none"
        stroke="url(#ekg-g)"
        strokeWidth={strokeWidth}
        className={`[stroke-dasharray:12_18] motion-safe:[animation:ekgDash_6s_linear_infinite] ${opacityClass} [filter:drop-shadow(0_0_6px_rgba(34,211,238,.28))]`}
      />
      <style>{`@keyframes ekgDash{to{stroke-dashoffset:-400}}`}</style>
    </svg>
  );
}
