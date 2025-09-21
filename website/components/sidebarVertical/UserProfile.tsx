"use client";

import React, { useState, useRef } from 'react';
import { LogOut, ChevronDown, User, KeyRound, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/useUserStore';
import { CustomAlertError } from '@/lib/alerts';
import { logout } from '@/services/authervice';
import { useRouter } from "next/navigation";


function useOnClickOutside(ref: React.RefObject<HTMLDivElement | null>, handler: () => void) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
interface UserInfo {
  fullname?: string; 
  org?: string;      
}


const UserProfile: React.FC<UserInfo> = ({fullname, org}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userProfile = useUserStore((state) => state.userProfile);
  useOnClickOutside(dropdownRef, () => setIsOpen(false));
  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 }, 
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } } 
  } as const;


 const handleedit =async () =>{
     CustomAlertError("","ยังไม่เปิดใช้บริการ")
 }

 const handlepassword =async () =>{
     CustomAlertError("","ยังไม่เปิดใช้บริการ")
 }

  const handleLogout = async () => {
     const id = userProfile?.id || 0
     const result = await logout(id)
     if(result.success){
        router.push("/auth/login");
        return
     }else{
        CustomAlertError("เกิดความผิดพลาด","ไม่สามารถออกจากระบบได้")
     }
  }

  return (
    <div ref={dropdownRef} className="relative mt-auto border-t border-white/10 pt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-slate-300 transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-900 ring-1 ring-cyan-400/30">
            <User className="h-5 w-5 text-cyan-300"/>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{userProfile?.name}</p>
            <p className="text-xs text-slate-400">{userProfile?.organizerName}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4 opacity-60" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-full mb-2 w-full origin-bottom rounded-2xl border border-white/10 bg-slate-800 p-2 shadow-2xl ring-1 ring-white/5"
          >
            <ul className="space-y-1 text-sm text-slate-300">
              <li>
                <a href="#" onClick={handleedit} className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5">
                  <Edit className="h-4 w-4 text-slate-400" /> แก้ไขโปรไฟล์
                </a>
              </li>
              <li>
                <a href="#" onClick={handlepassword} className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5">
                  <KeyRound className="h-4 w-4 text-slate-400" /> เปลี่ยนรหัสผ่าน
                </a>
              </li>
              <li className="border-t border-white/10 pt-1 mt-1">
                <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-400 hover:bg-rose-500/10 cursor-pointer">
                  <LogOut className="h-4 w-4" /> ออกจากระบบ
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;