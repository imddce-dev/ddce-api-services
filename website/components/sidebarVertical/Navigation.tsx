import React from 'react';
import SideLink from './SideLink';
import { LayoutDashboard, FileText, Library, BookOpen, Inbox, Settings } from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard/Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, label: "หน้าหลัก" },
  { href: "/dashboard/Request", icon: <FileText className="h-4 w-4" />, label: "ยื่นคำขอใช้งาน API" },
  { href: "/dashboard/Status", icon: <Library className="h-4 w-4" />, label: "รายการ API ทั้งหมด" },
  // { href: "/dashboard/searchapi", icon: <BookOpen className="h-4 w-4" />, label: "การค้นหา API" },
  // { href: "/inbox", icon: <Inbox className="h-4 w-4" />, label: "กล่องคำขอ/แจ้งเตือน" },
  // { href: "/settings", icon: <Settings className="h-4 w-4" />, label: "การตั้งค่า" },
];

const Navigation: React.FC = () => {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <SideLink key={item.href} href={item.href} icon={item.icon}>
          {item.label}
        </SideLink>
      ))}
    </nav>
  );
};

export default Navigation;