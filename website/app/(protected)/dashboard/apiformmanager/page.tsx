// app/(protected)/dashboard/apiformmanager/page.tsx
import React from "react";
import RequestsAdmin from "@/components/admin/RequestsAdmin"; // <- import ปกติ

export const metadata = {
  title: "จัดการผู้ใช้งาน",
};

export default function Page() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-slate-100">
      {/* aura */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-cyan-700/25 via-emerald-500/15 to-transparent blur-[90px]" />

      <header className="mx-auto max-w-[1320px] w-full px-4 sm:px-6 lg:px-2 pt-2 pb-4">
      </header>
<main className="mx-auto max-w-[1320px] w-full px-4 sm:px-6 lg:px-8 pb-10">
        <RequestsAdmin />
      </main>
    </div>
  );
}
