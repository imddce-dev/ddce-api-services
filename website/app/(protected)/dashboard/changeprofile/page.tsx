'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import Changeprofile from "@/components/form/Changeprofile";
import { usePage } from '@/contexts/PageContext';

export default function RequestPage() {
  const { setPageInfo } = usePage();

  useEffect(() => {
    setPageInfo({
      title: 'แก้ไขโปรไฟล์',
      description: 'แก้ไขได้เฉพาะ ชื่อ-สกุล, อีเมล และเบอร์โทร เท่านั้น',
    });
  }, [setPageInfo]);

  return (
    <div className="min-h-dvh antialiased p-4 text-slate-100">
      <Changeprofile/> 
    </div>
  );
}
