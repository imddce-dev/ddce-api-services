"use client";
import React from "react";
import { Menu } from "lucide-react";
import { usePage } from "@/contexts/PageContext";
import { motion, AnimatePresence } from "framer-motion"; // 1. Import motion and AnimatePresence
interface TopbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function Topbar({ setOpen }: TopbarProps) {
  const { pageInfo } = usePage();
  const textVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className="flex items-center gap-2 md:mt-3 md:mb-2 shdow-5">
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl p-2 text-slate-200 hover:bg-white/5 md:hidden"
        aria-label="open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="relative hidden flex-1 items-center overflow-hidden md:flex md:rounded-2xl md:border md:border-white/10 md:bg-slate-950/95 md:p-4">
        <div className="relative flex flex-col">
          <AnimatePresence mode="wait">
            <motion.h1
              key={pageInfo.title} 
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-xl font-semibold"
            >
              {pageInfo.title}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={pageInfo.description} 
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-sm text-slate-400"
            >
              {pageInfo.description}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}