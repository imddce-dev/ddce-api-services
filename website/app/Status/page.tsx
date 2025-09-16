// app/apis/page.tsx
import React from "react";
import StatusForm from "@/components/form/statusform";

export const metadata = {
  title: "ติดตามสถานะคำขอ API",
};

export default function Page() {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      {/* aura */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-cyan-700/25 via-emerald-500/15 to-transparent blur-[90px]" />

      <main className="mx-auto w-[min(1180px,96vw)] px-4 py-6 md:px-6">
        <header className="mb-4">
          <h1 className="text-xl font-semibold">ติดตามสถานะคำขอ API</h1>
          <p className="text-sm text-slate-400">ค้นหา กรอง และติดตามความคืบหน้าของคำขอทั้งหมด</p>
        </header>

        {/* ใช้งานคอมโพเนนต์ */}
        <StatusForm />
      </main>
    </div>
  );
}
