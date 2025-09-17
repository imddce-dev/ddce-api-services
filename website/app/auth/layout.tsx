import * as React from 'react';

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-[#000] text-slate-100 "
      style={{ overscrollBehavior: 'none' }}
    >
      <video
        className="absolute inset-0 w-full  object-cover" // ทำให้วิดีโอคลุมพื้นที่ทั้งหมด
        src="/vdobg.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
        preload="auto" 
      ></video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}