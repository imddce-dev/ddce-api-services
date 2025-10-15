"use client";
export const dynamic = 'force-dynamic';
import React, { useEffect } from "react";
import APIForm from "@/components/form/APIform";
import { usePage } from "@/contexts/PageContext";
export default function RequestPage() {
  const { setPageInfo } = usePage();
  useEffect(() => {
    setPageInfo({
      title: "ยื่นคำขอใช้งาน API",
      description: "เริ่มยื่นคำขอ, ตรวจสถานะ และเรียนรู้การใช้งาน API ได้จากที่นี่",
    });
  }, [setPageInfo]);

  return (
    <>
      <div className="min-h-dvh antialiased p-4 text-slate-100">
        <APIForm />
      </div>
    </>
  );
}
