import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OtpForm from "@/components/form/OtpForm";

export default async function OtpPage() {
  const cookieStore = await cookies();  
  const otpToken = cookieStore.get("__Host-OtpToken");
  if (!otpToken) {
    redirect("/auth/login");
  }
  return (
    <div>
      <div className="relative z-10 w-[min(420px,94vw)] rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl backdrop-blur">
        <OtpForm />
      </div>
    </div>
  );
}
