
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import  LoginForm  from '@/components/form/LoginForm';

export default function LoginPage() {
  return (
    <main className="relative h-dvh flex justify-center items-center">
      <div className="mx-auto grid w-[min(650px)] place-items-center px-4">
        <div className="relative w-[min(560px,94vw)] justify-self-center lg:col-span-3 lg:w-auto lg:justify-self-stretch">
          <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/40 via-emerald-400/40 to-amber-300/40 opacity-40 blur-xl" />
          <Card className="rounded-2xl border-slate-700/70 bg-slate-900/50 backdrop-blur-2xl">
            <div className='flex justify-center m-0 p-0'>
              <Image src='/ddce-ct.png' alt='Logo' width={250} height={200} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="font-semibold text-slate-100 text-center text-2xl">Application Program Interface(API)</CardTitle>
               <CardTitle className='text-white text-center text-[16px]'> บริการเชื่อโยงข้อมูล กลุ่มงานการจัดการข้อมูลภาวะฉุกเฉินทางสาธารณสุข</CardTitle>
            </CardHeader>
              <div className='px-5 text-white'>
              <LoginForm/>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
