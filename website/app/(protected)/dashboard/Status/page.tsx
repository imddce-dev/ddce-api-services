// app/apis/page.tsx
import React from "react";
import StatusForm from "@/components/form/statusform";

export const metadata = {
  title: "ติดตามสถานะคำขอ API",
};

export default function Page() {
  return (

    <div className="min-h-dvh bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-cyan-700/25 via-emerald-500/15 to-transparent blur-[90px]" />

      {/* คอนเทนเนอร์กลางของหน้า */}
      <main className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 py-6">
        <header className="mb-4">
          <h1 className="text-xl font-semibold">ติดตามสถานะคำขอ API</h1>
          <p className="text-sm text-slate-400">
            ค้นหา กรอง และติดตามความคืบหน้าของคำขอทั้งหมด
          </p>
        </header>

  
        <StatusForm />
      </main>
    </div>
  );
}
