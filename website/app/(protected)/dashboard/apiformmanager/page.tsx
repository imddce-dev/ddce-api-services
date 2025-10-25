'use client'
export const dynamic = 'force-dynamic';
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
    <div className="relative text-slate-100 mx-auto ">
      <RequestsAdmin />
    </div>
  );
}
