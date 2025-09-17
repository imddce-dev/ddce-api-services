import React from 'react';
import Link from 'next/link';
import { Shield, ChevronRight } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  color: 'green' | 'yellow' | 'red'; 
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, color }) => {
    const colorClasses = {
        green: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
        yellow: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
        red: "bg-red-500/15 text-red-300 ring-red-400/20"
    };
    return (
        <span className={`rounded-full px-2 py-0.5 ring-1 ${colorClasses[color]}`}>
            {status}
        </span>
    );
};

const ApiStatus: React.FC = () => {
    return (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs">
            <div className="mb-1 flex items-center gap-2 font-medium">
                <Shield className="h-4 w-4 text-cyan-300" /> สถานะระบบ API
            </div>
            <ul className="space-y-1">
                <li className="flex items-center justify-between">
                    <span>Gateway</span>
                    <StatusBadge status="ปกติ" color="green" />
                </li>
                <li className="flex items-center justify-between">
                    <span>Events</span>
                    <StatusBadge status="ปกติ" color="green" />
                </li>
                <li className="flex items-center justify-between">
                    <span>Lab</span>
                    <StatusBadge status="ชะลอตัว" color="yellow" />
                </li>
            </ul>
            <Link href="/status" className="mt-2 inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200">
                รายงานสถานะทั้งหมด <ChevronRight className="h-4 w-4" />
            </Link>
        </div>
    );
};

export default ApiStatus;