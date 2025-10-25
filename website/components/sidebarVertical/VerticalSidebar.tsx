import React from 'react';
import SidebarHeader from './SidebarHearder';
import Navigation from './Navigation';
import ApiStatus from './ApiStatus';
import UserProfile from './UserProfile';
import { useUserStore } from '@/stores/useUserStore';
interface UserProfileData {
  id: number,
  fullname: string,
  username: string,
  email: string,
  phone: string,
  organizerId: string,
  organizerName: string ; 
}
interface UserResponse {
  data: UserProfileData;
}
interface VerticalSidebarProps {
  open: boolean;
  // user: UserResponse | null; 
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const VerticalSidebar: React.FC<VerticalSidebarProps> = ({ open, setOpen }) => {
  const userProfile = useUserStore((state) => state.userProfile);
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-70 min-w-[85%] h-screen transform border-r border-white/10 bg-slate-950/95 p-3 ring-1 ring-white/5 transition-transform md:static md:h-[95%] md:mt-4 md:translate-x-0 md:rounded-2xl 
      flex flex-col justify-between shdow-5 ${ 
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <SidebarHeader setOpen={setOpen} />
        <Navigation />
      </div>

      <div>
        <div className='mb-3'>
          <ApiStatus />
        </div>
        <div>
          <UserProfile/>
        </div>
      </div>
    </aside>
  );
};
export default VerticalSidebar;