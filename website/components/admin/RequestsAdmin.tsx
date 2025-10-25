'use client'
import { BookUser, Building2, CalendarDaysIcon, CheckCircle, ChevronUp, Clock, LockKeyhole, Send, XCircle } from "lucide-react"
import { useState } from "react"
import { ReactNode } from "react";



const RequestsAdmin = () => {
  const [isOpen, setIsOpen] = useState(false)
    const toggleDetails = () => {
      setIsOpen(!isOpen);
  };

  
  return (
     <>
    <div className="relative p-0 border-[1px] bg-slate-950 border-white/10 rounded-3xl overflow-hidden before:content-[''] before:absolute before:-left-8 before:top-0 before:h-full  before:bg-slate-900 before:rounded-full before:shadow-inner mb-5">
      <div className="absolute top-0 h-full w-2 bg-amber-300  shadow-inner"></div>
      <div className={`flex flex-row items-center text-sm py-3 transition-all ease-in-out duration-500 ${isOpen ? "border-b-[1px]":""}`}>
        <div className="basis-[15%] text-center flex flex-col items-center justify-center gap-1">
          <small className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            ID
          </small>
          <span
            className="inline-flex items-center justify-center px-2 py-1 text-sm font-semibold text-slate-100 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm hover:from-indigo-500/20 hover:to-sky-500/20 hover:border-indigo-400/40
              hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)] transition-all duration-300 ease-out scale-100 hover:scale-105 cursor-default">
            01
          </span>
        </div>
       <div className="basis-[45%]">
          <div className="font-semibold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text  ps-2"><small className="text-slate-400">โครงการ : </small>mebs</div>
          <small className=" inline-flex items-center gap-2 text-slate-300 px-2 py-1 bg-white/5 rounded-lg border border-white/10 shadow-[0_0_6px_rgba(255,255,255,0.04)]
              backdrop-blur-smhover:bg-white/10 hover:shadow-[0_0_10px_rgba(99,102,241,0.4)]transition-all duration-300">
            <Building2 className="w-4 h-4 text-indigo-400 drop-shadow-[0_0_4px_rgba(99,102,241,0.6)]" />
            <span className="tracking-wide whitespace-nowrap py-1">
              <small className="text-slate-400">หน่วยงาน : </small>สำนักงานสาธารณสุขกระบี่
            </span>
          </small>
        </div>
        <div className="basis-[15%] text-center flex flex-col items-center justify-center gap-1">
          <small className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            วันที่บันทึก
          </small>
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full
            bg-blue-500/20 text-blue-300 border border-blue-500/30 
            shadow-[0_0_10px_rgba(56,189,248,0.3)]
            backdrop-blur-sm transition-all duration-300">
            <CalendarDaysIcon className="w-5 h-5 pe-1"/> 20/10/2568
          </span>
        </div>
        <div className="basis-[15%] text-center flex flex-col items-center justify-center gap-1 py-1">
            <small className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            สถานะ
          </small>
           {StatusBadge("pending")}
        </div>
        <div className="basis-[20%] text-center flex justify-center">
         <button onClick={toggleDetails} className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 text-white text-sm font-medium
          rounded-xl px-4 py-2 shadow-lg hover:shadow-[0_0_15px_rgba(99,102,241,0.7)] transition-all duration-300 active:scale-95">
          <ChevronUp className={`w-4 h-4 transition-all ease-in-out duration-500 ${isOpen ? "rotate-180":""}`} />รายละเอียด
         </button>
        </div>
      </div>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "h-[1100px]":"h-0"}`}>
        <div className="py-3 px-4 grid gap-y-4">
          <div className="border-[1px] rounded-xl p-1 bg-white/5">
            <div className="inline-flex items-center gap-x-1 text-[14px] ps-4  w-full"><BookUser className="h-4 w-4"/>ข้อมูลระบบ/โครงการ</div>
             <div className="grid grid-cols-2 gap-x-4  relative">
                 <div className="flex justify-center items-center px-4 py-3">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          ชื่อระบบ/โครงการ
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                  <div className="flex justify-center items-center px-4">
                     <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          ฐานข้อมูลที่ต้องการเชื่อม
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                 <div className="col-span-2">
                      <div className="w-full px-4">
                          <label className="text-sm font-medium text-slate-400">คำอธิบาย/บริบทการใช้งาน </label>
                          <div className="relative">
                            <textarea
                              className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                          </div>
                      </div>
                 </div>
             </div> 
          </div>
          <div className="border-[1px] rounded-xl p-1 bg-white/5">
            <div className="inline-flex items-center gap-x-1 text-[14px] ps-4  w-full"><BookUser className="h-4 w-4"/>ขอบเขตการเข้าถึง (Scopes) และรูปแบบข้อมูล</div>
             <div className="grid grid-cols-2 gap-x-4  relative">
                 <div className="flex justify-center items-center px-4 py-3">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          Methods
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                  <div className="flex justify-center items-center px-4">
                     <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          ระยะเวลาการเก็บรักษาข้อมูล(วัน)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                 <div className="flex justify-center items-center px-4">
                     <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          รูปแบบข้อมูล (Data format) 
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                 <div className="flex justify-center items-center px-4">
                     <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          อัตราการเรียกใช้งาน (Rate limit)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                 <div className="col-span-2">
                      <div className="w-full px-4">
                          <label className="text-sm font-medium text-slate-400">วัตถุประสงค์การใช้งาน (purpose)</label>
                          <div className="relative">
                            <textarea
                              className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                          </div>
                      </div>
                 </div>
             </div> 
          </div>
          <div className="border-[1px] rounded-xl p-1 bg-white/5">
            <div className="inline-flex items-center gap-x-1 text-[14px] ps-4  w-full"><BookUser className="h-4 w-4"/>การพิสูจน์ตัวตนและการเชื่อมต่อ</div>
             <div className="grid grid-cols-2 gap-x-4  relative">
                 <div className="flex justify-center items-center px-4 py-3">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          Callback URL (ถ้ามี)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                  <div className="flex justify-center items-center px-4">
                     <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          IP / CIDR ที่อนุญาต (ถ้ามี)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                 <div className="col-span-2 mb-2">
                      <div className="w-full px-4">
                          <label className="text-sm font-medium text-slate-400">ไฟล์เอกสาร</label>
                          <div className="relative bg-[#0b0f19] p-4 rounded-lg grid gap-y-2">
                            <div><a href="#">- ไฟล์เอกสารที่ 1</a></div>
                            <div><a href="#">- ไฟล์เอกสารที่ 2</a></div>
                          </div>
                      </div>
                 </div>
             </div> 
          </div>
          <div className="border-[1px] rounded-xl p-1 bg-white/5">
            <div className="inline-flex items-center gap-x-1 text-[14px] ps-4  w-full"><BookUser className="h-4 w-4"/>ข้อมูลผู้ยื่นคำขอ</div>
             <div className="grid grid-cols-2 gap-x-4  relative">
                 <div className="flex justify-center items-center px-4 py-3">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          ชื่อ-นามสกุล
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                  <div className="flex justify-center items-center px-4">
                     <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          อีเมล
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                 <div className="flex justify-center items-center px-4">
                     <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          เบอร์โทรติดต่อ
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
                 <div className="flex justify-center items-center px-4">
                     <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-slate-400">
                          หน่วยงาน
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="text-slate-200 px-1.5 py-1.5 w-[100%]  bg-[#0b0f19] border border-[#1e2533] rounded-lg  focus:outline-none transition-all duration-300" readOnly/>
                        </div>
                      </div>
                 </div>
             </div> 
          </div>
          <div className="border-[1px] rounded-xl p-1  bg-white/5">
            <div className="inline-flex items-center gap-x-1 text-[14px] ps-4  w-full"><BookUser className="h-4 w-4"/>การจัดการ</div>
               <div className="flex justify-between p-3">
                  <div>
                    <button className="bg-blue-600 p-2 rounded-2xl inline-flex items-center gap-2 justify-center"><LockKeyhole className="w-4 h-4"/> Generate KEY</button>
                  </div>
                  <div className="grid grid-cols-3 gap-x-4">
                    <button className="bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)] p-2 rounded-2xl cursor-pointer inline-flex items-center gap-2 justify-center"><Clock className="w-4 h-4 animate-pulse" />กำลังดำเนินการ</button>
                    <button className="bg-red-400 text-amber-50 border border-slate-500/30 shadow-[0_0_10px_rgba(148,163,184,0.2)] p-2 rounded-2xl cursor-pointer inline-flex items-center gap-2 justify-center"><XCircle className="w-4 h-4" />ไม่อนุมัติ</button>
                    <button className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)] rounded-2xl p-2 cursor-pointer inline-flex items-center gap-2 justify-center"><CheckCircle className="w-4 h-4" />อนุมัคิ</button>
                  </div>
               </div>
          </div>
        </div>
      </div>
      
    </div>
  </>
  )
}

export function StatusBadge(status: string) {
  const statusConfig: Record<
    string,
    { text: string; className: string; icon: ReactNode }
  > = {
    active: {
      icon: <CheckCircle className="w-4 h-4" />,
      text: "Active",
      className:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    },
    pending: {
      icon: <Clock className="w-4 h-4 animate-pulse" />,
      text: "Pending",
      className:
        "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    },
    sending: {
      icon: <Send className="w-4 h-4 animate-bounce" />,
      text: "Sending",
      className:
        "bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-[0_0_10px_rgba(56,189,248,0.3)]",
    },
    inactive: {
      icon: <XCircle className="w-4 h-4" />,
      text: "Inactive",
      className:
        "bg-slate-500/20 text-slate-400 border border-slate-500/30 shadow-[0_0_10px_rgba(148,163,184,0.2)]",
    },
  };

  const cfg = statusConfig[status] || statusConfig["inactive"];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full
        backdrop-blur-sm transition-all duration-300
        ${cfg.className}
      `}
    >
      {cfg.icon}
      {cfg.text}
    </span>
  );
}





export default RequestsAdmin