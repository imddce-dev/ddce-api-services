"use client"; 
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import React from 'react';

interface SideLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
const SideLink: React.FC<SideLinkProps> = ({ href, icon, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-cyan-400/10 text-cyan-300' 
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200' 
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default SideLink;