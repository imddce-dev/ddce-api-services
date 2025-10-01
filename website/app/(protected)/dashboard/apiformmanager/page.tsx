'use client'
import React, { useEffect } from "react";
import RequestsAdmin from "@/components/admin/RequestsAdmin";
import { usePage } from "@/contexts/PageContext";

export default function Page() {
  const { setPageInfo } = usePage();
    useEffect(() => {
      setPageInfo({
        title: "จัดการคำขอ API",
        description: "ตรวจสอบ อนุมัติ/ปฏิเสธ ตั้งสถานะ และจัดการแบบหลายรายการ",
      });
    }, [setPageInfo]);
  return (
    <div className="min-h-dvh  bg-slate-950 text-slate-100">
      <RequestsAdmin />
    </div>
  );
}
