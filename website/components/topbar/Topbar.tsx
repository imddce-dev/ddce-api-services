"use client";

import React from "react";
import { Menu } from "lucide-react";
import { usePage } from "@/contexts/PageContext"; 

interface TopbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Topbar({ setOpen }: TopbarProps) {
  const { pageInfo } = usePage(); 

  return (
    <div className="flex items-center gap-2 md:mt-3 md:ms-4">
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl p-2 text-slate-200 hover:bg-white/5 md:hidden"
        aria-label="open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 md:block md:p-4 md:rounded-2xl md:border-white/10 md:border md:bg-slate-950/95">
        <h1 className="text-xl font-semibold">{pageInfo.title}</h1>
        <p className="text-sm text-slate-400">{pageInfo.description}</p>
      </div>
    </div>
  );
}