
"use client";

import React, { useEffect, useRef } from "react";
import { useUserStore } from '@/stores/useUserStore';
import VerticalSidebar from "@/components/sidebarVertical/VerticalSidebar";
import { Topbar } from "@/components/topbar/Topbar";
import Lenis from "@studio-freight/lenis";
import { PageProvider } from "@/contexts/PageContext";
import { AnimatePresence } from "framer-motion";

interface DashboardClientLayoutProps {
  children: React.ReactNode;
}

export default function DashboardClientLayout({  children }: DashboardClientLayoutProps) {
  const [open, setOpen] = React.useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // ดึง Action และ State จาก Store
    const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
    const userProfile = useUserStore((state) => state.userProfile);

    useEffect(() => {
        // ถ้ายังไม่มีข้อมูล user ใน store ให้ทำการ fetch
        if (!userProfile) {
            fetchUserProfile();
        }
    }, [userProfile, fetchUserProfile]);
  
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      smoothWheel: true,
      lerp: 0.1,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute ..."/>
      <div className="mx-auto flex h-screen max-w-[1280px] gap-5 px-4 py-5 md:px-6">
        <VerticalSidebar open={open} setOpen={setOpen} />
        
        <PageProvider>
          <AnimatePresence mode="wait">
            <main className="relative flex flex-1 flex-col overflow-hidden">
              <Topbar setOpen={setOpen} />
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-4 md:p-6">
                  {children}
                </div>
              </div>
            </main>
          </AnimatePresence>
        </PageProvider>
      </div>
    </div>
  );
}