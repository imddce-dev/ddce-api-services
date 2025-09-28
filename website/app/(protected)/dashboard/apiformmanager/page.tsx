// app/admin/requests/page.tsx
import React from "react";
import RequestsAdmin from "@/components/admin/RequestsAdmin";

export const metadata = {
  title: "จัดการคำขอ API (ผู้ดูแล)",
};

export default function Page() {
  return (
    // ซ่อนสกรอลแนวนอนระดับเพจได้อย่างปลอดภัย
    <div className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-slate-100">
      {/* aura */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-cyan-700/25 via-emerald-500/15 to-transparent blur-[90px]" />

      {/* หัวข้อ: กว้างตามคอนเทนเนอร์หลัก (ไม่แคบผิดปกติ) */}
      <header className="mx-auto w-[min(1400px,47vw)] px-4 sm:px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold">จัดการคำขอ API</h1>
        <p className="text-sm text-slate-400">
          ตรวจสอบ อนุมัติ/ปฏิเสธ ตั้งสถานะ และจัดการแบบหลายรายการ
        </p>
      </header>

      {/* เนื้อหา: ใช้คอนเทนเนอร์เดียวกัน และปล่อยให้ตารางภายในเลื่อน X เอง */}
      <main className="mx-auto w-[min(1400px,70vw)] px-0 pb-8 sm:px-6">
        {/* หมายเหตุ: RequestsAdmin มี wrapper overflow-x-auto รอบตารางอยู่แล้ว */}
        <RequestsAdmin />
      </main>
    </div>
  );
}
