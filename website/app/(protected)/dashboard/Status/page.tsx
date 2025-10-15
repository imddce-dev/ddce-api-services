'use client'
export const dynamic = 'force-dynamic';
import React, { useEffect } from "react";
import StatusForm from "@/components/form/statusform";
import { usePage } from "@/contexts/PageContext";

export default function Page() {
  const { setPageInfo } = usePage();
      useEffect(() => {
          setPageInfo({
            title: "ติดตามสถานะคำขอ API",
            description: "ค้นหา กรอง และติดตามความคืบหน้าของคำขอทั้งหมด",
          });
        }, [setPageInfo]);
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 antialiased no-scrollbar">
      <StatusForm />
    </div>
  );
}
