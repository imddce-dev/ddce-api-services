'use client';

import * as React from 'react';
import EKGs from '@/components/Ekg/Ekg'; // ถ้ามีคอมโพเนนต์ EKG ของคุณอยู่แล้ว ใช้ตัวนี้ได้
// ถ้าไม่มี ให้ลบบรรทัด import EKGs และ <EKGs .../> ทิ้งได้เลย

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-[#060913] text-slate-100"
      style={{ overscrollBehavior: 'none' }}
    >
      {/* ===== Aurora + Grid (พื้นหลังเหมือนหน้ากล่าวนำ) ===== */}
      <div className="pointer-events-none absolute inset-0 -z-30 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(56,189,248,.18),transparent_60%),radial-gradient(40%_25%_at_10%_15%,rgba(16,185,129,.15),transparent_60%),radial-gradient(45%_30%_at_90%_10%,rgba(250,204,21,.12),transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 -z-30 opacity-[0.07] [background:linear-gradient(to_right,transparent_48%,rgba(255,255,255,.25)_50%,transparent_52%),linear-gradient(to_bottom,transparent_48%,rgba(255,255,255,.25)_50%,transparent_52%)] [background-size:28px_28px] [mask-image:radial-gradient(80%_50%_at_50%_10%,#000_25%,transparent_70%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -top-32 right-[-10%] -z-30 h-[36rem] w-[36rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-40 -z-30 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />

      {/* ถ้ามีคอมโพเนนต์ EKG แบบยาว ให้แปะไว้ด้านหลังทั้งหมดได้เลย */}
      {/* <div className="absolute left-1/2 top-1/2 -z-20 w-screen -translate-x-1/2 -translate-y-1/2">
        <EKGs className="h-auto" />
      </div> */}

      {children}
    </div>
  );
}
