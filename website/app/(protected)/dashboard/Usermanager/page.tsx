"use client";
export const dynamic = 'force-dynamic';
import { usePage } from "@/contexts/PageContext";
import React, { useEffect } from "react";
import UserManager from "@/components/admin/Usermanager"; 

export default function Page() {
   const { setPageInfo } = usePage();
      useEffect(() => {
        setPageInfo({
          title: "จัดการผู้ใช้งาน (User Manager)",
          description: "ค้นหา • กรอง • แก้ไขผ่าน Dialog • ลบ • ส่งออก CSV",
        });
      }, [setPageInfo]);
  return (
      <div className="ralative w-full">
          <UserManager />
      </div>
  );

}