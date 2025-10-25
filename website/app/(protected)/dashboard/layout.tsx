import DashboardClientLayout from '@/components/dashboard/DashboardClientLayout';
import { cookies } from 'next/headers';
import { getUserProfile } from '@/services/authervice';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'DDCE API Request'
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); 
  const token =  cookieStore.get('accessToken')?.value;
  console.log("Token from cookie:", token ? `...${token.slice(-6)}` : null);
  console.log("User Info from API:");
  console.log("--------------------------------------");
  return (
    <DashboardClientLayout >
      {children}
    </DashboardClientLayout>
  );
}