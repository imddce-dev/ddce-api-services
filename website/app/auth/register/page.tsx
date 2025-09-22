import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Registerform } from "@/components/form/Registerform";
import { Metadata } from "next";
export const metadata: Metadata ={
  title: 'สมัครสมาชิก | DDCE API Request'
}
export default function RegisterPage() {
  return (
    <main className="relative min-h-dvh flex justify-center items-start py-4 sm:py-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6 md:px-8">
        <div className="relative w-[min(1040px,96vw)] justify-self-center">
          <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-emerald-400/30 to-amber-300/30 opacity-40 blur-xl" />
          <Card className="rounded-2xl border-slate-700/70 bg-slate-900/50 backdrop-blur-2xl">
            <div className="flex justify-center pt-3">
              <Image src="/ddce-ct.png" alt="Logo" width={250} height={200} />
            </div>
            <CardHeader className="pb-1 px-6 md:px-8">
              <CardTitle className="font-semibold text-slate-100 text-center text-2xl">
                DDCE Application Program Interface
              </CardTitle>
              <CardTitle className="text-white text-center text-[16px]">
                ระบบบริการข้อมูล การจัดการข้อมูลภาวะฉุกเฉินทางสาธารณสุข
              </CardTitle>
            </CardHeader>
            <div className="px-6 md:px-8 pb-5">
              <Registerform />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
