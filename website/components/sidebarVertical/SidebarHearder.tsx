import React from 'react';
import { PlugZap, X } from 'lucide-react';

interface SidebarHeaderProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; 
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ setOpen }) => {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PlugZap className=" w-5 text-cyan-300" />
        <span className=" font-semibold">IM - DDCE • Emergency API</span>
      </div>
      <button
        onClick={() => setOpen(false)}
        className="rounded-lg p-1 text-slate-300 hover:bg-white/5 md:hidden"
        aria-label="close menu"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SidebarHeader;