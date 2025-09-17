"use client";
import React from "react";
import APIForm from "@/components/form/APIform";

export default function RequestPage() {
  return (
    <div className="dark min-h-dvh bg-background text-foreground">
      <main className="mx-auto w-[min(1100px,96vw)] px-4 py-6 md:px-6">
        <header className="mb-4">
          <h1 className="text-xl font-semibold">ยื่นคำขอใช้งาน API</h1>
          <p className="text-sm text-muted-foreground">
            กรอกข้อมูลให้ครบถ้วน ทีมงานจะตรวจสอบและแจ้งผลทางอีเมล
          </p>
        </header>

        <APIForm />
      </main>
    </div>
  );
}
