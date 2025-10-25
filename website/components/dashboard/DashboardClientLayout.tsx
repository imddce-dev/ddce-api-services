"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUserStore } from '@/stores/useUserStore';
import VerticalSidebar from "@/components/sidebarVertical/VerticalSidebar";
import { Topbar } from "@/components/topbar/Topbar";
import { PageProvider } from "@/contexts/PageContext";
import ParticlesNetwork from "../ParticlesNetwork";

interface DashboardClientLayoutProps {
  children: React.ReactNode;
}

export default function DashboardClientLayout({ children }: DashboardClientLayoutProps) {
  const [open, setOpen] = React.useState(false);
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const userProfile = useUserStore((state) => state.userProfile);

  useEffect(() => {
    if (!userProfile) fetchUserProfile();
  }, [userProfile, fetchUserProfile]);

  return (
    <div className="container mx-auto h-dvh overflow-hidden relative ">
      <ParticlesNetwork/>
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/4 sticky top-0 h-full flex justify-center">
          <VerticalSidebar open={open} setOpen={setOpen} />
        </div>
        <div className="w-full md:w-3/4 h-full flex flex-col">
          <PageProvider>
            <div className="sticky top-0 z-50 shadow-md">
              <Topbar setOpen={setOpen} />
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar rounded-lg">
              {children}
            </div>
          </PageProvider>
        </div>
      </div>
    </div>
  );
}
