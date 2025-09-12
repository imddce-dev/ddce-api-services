"use client";
import React from "react";

export default function IntroAurora({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-20 ${className}`}>
      <div className="absolute inset-0 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(56,189,248,.18),transparent_60%),radial-gradient(40%_25%_at_10%_15%,rgba(16,185,129,.15),transparent_60%),radial-gradient(45%_30%_at_90%_10%,rgba(250,204,21,.12),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.07] [background:linear-gradient(to_right,transparent_48%,rgba(255,255,255,.25)_50%,transparent_52%),linear-gradient(to_bottom,transparent_48%,rgba(255,255,255,.25)_50%,transparent_52%)] [background-size:28px_28px] [mask-image:radial-gradient(80%_50%_at_50%_10%,#000_25%,transparent_70%)]"
        aria-hidden
      />
      <div className="absolute -top-32 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -left-32 top-40 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
    </div>
  );
}
