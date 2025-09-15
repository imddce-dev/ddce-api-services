"use client";

import React, { useEffect, useRef } from "react";

type PrivacyDialogProps = {
  open: boolean;
  onClose: () => void;
  contactPhone?: string; // ← เบอร์ติดต่อ (override ได้)
  contactEmail?: string; // ← อีเมลติดต่อ (override ได้)
};

export default function PrivacyDialog({
  open,
  onClose,
  contactPhone = "02-123-4567", // ← ตั้งค่าพื้นฐาน (ปรับได้)
  contactEmail = "privacy@ddce.go.th",
}: PrivacyDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // ปิดด้วย ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // โฟกัสปุ่มเมื่อเปิด
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstFocusRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      aria-describedby="privacy-desc"
      className="fixed inset-0 z-[100]"
      onMouseDown={(e) => {
        // คลิกพื้นหลังเพื่อปิด (ยกเว้นคลิกในกล่อง)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <div
          ref={panelRef}
          className="w-[min(820px,96vw)] rounded-2xl border border-white/10 bg-slate-900 text-slate-100 shadow-2xl ring-1 ring-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
            <h2 id="privacy-title" className="text-base font-semibold">
              นโยบายความเป็นส่วนตัว (Privacy Policy)
            </h2>
            <button
              ref={firstFocusRef}
              onClick={onClose}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            >
              ปิด
            </button>
          </div>

          {/* Body */}
          <div id="privacy-desc" className="max-h-[70vh] overflow-y-auto px-5 py-4 text-sm leading-6">
            <p className="text-slate-300">
              มีผลบังคับใช้: <span className="text-slate-200 font-medium">15 กันยายน 2568</span>
            </p>

            <section className="mt-4 space-y-2">
              <h3 className="text-[15px] font-semibold">1) ขอบเขตการเก็บและประมวลผลข้อมูล</h3>
              <p className="text-slate-300">
                เมื่อคุณสมัครใช้งาน ระบบจะเก็บข้อมูลที่จำเป็นต่อการสร้างบัญชีและให้บริการ ได้แก่
                ชื่อ–สกุล, อีเมล, ประเภทหน่วยงาน, ข้อมูลเทคนิคพื้นฐาน (เช่น ไอพี/เวลาที่ร้องขอ),
                และบันทึกกิจกรรมเพื่อความปลอดภัยของระบบ
              </p>
            </section>

            <section className="mt-4 space-y-2">
              <h3 className="text-[15px] font-semibold">2) วัตถุประสงค์การใช้ข้อมูล</h3>
              <ul className="list-disc pl-5 text-slate-300">
                <li>สร้างและบริหารจัดการบัญชีผู้ใช้</li>
                <li>ยืนยันตัวตนและรักษาความปลอดภัยของระบบ</li>
                <li>ติดต่อสื่อสารเกี่ยวกับการใช้งาน/การสนับสนุน</li>
                <li>ปรับปรุงคุณภาพบริการและการปฏิบัติตามกฎหมายที่เกี่ยวข้อง</li>
              </ul>
            </section>

            <section className="mt-4 space-y-2">
              <h3 className="text-[15px] font-semibold">3) การเก็บรักษาและระยะเวลา</h3>
              <p className="text-slate-300">
                เราจะเก็บรักษาข้อมูลเท่าที่จำเป็นต่อวัตถุประสงค์ที่ระบุไว้
                และลบ/ทำให้ไม่สามารถระบุตัวตนได้เมื่อพ้นความจำเป็นหรือเมื่อกฎหมายกำหนด
              </p>
            </section>

            <section className="mt-4 space-y-2">
              <h3 className="text-[15px] font-semibold">4) การเปิดเผยข้อมูล</h3>
              <p className="text-slate-300">
                เราไม่ขายข้อมูลส่วนบุคคล และจะเปิดเผยต่อบุคคลที่สามเฉพาะเมื่อจำเป็น
                เช่น ผู้ประมวลผลข้อมูลตามสัญญา หรือเมื่อมีกฎหมาย/คำสั่งหน่วยงานของรัฐ
              </p>
            </section>

            <section className="mt-4 space-y-2">
              <h3 className="text-[15px] font-semibold">5) สิทธิของเจ้าของข้อมูล</h3>
              <ul className="list-disc pl-5 text-slate-300">
                <li>สิทธิขอเข้าถึง/รับสำเนาข้อมูล</li>
                <li>สิทธิขอแก้ไขให้ถูกต้องครบถ้วน</li>
                <li>สิทธิขอให้ลบ/ระงับการใช้ข้อมูลเมื่อมีเหตุสมควร</li>
                <li>สิทธิคัดค้าน/เพิกถอนความยินยอมตามที่กฎหมายกำหนด</li>
              </ul>
            </section>

            <section className="mt-4 space-y-2">
              <h3 className="text-[15px] font-semibold">6) มาตรการความปลอดภัย</h3>
              <p className="text-slate-300">
                เราใช้มาตรการทั้งทางเทคนิคและองค์กร เช่น การเข้ารหัส, การควบคุมสิทธิ์,
                การบันทึกเหตุการณ์ และการทบทวนความปลอดภัยเป็นระยะ
              </p>
            </section>

            <section className="mt-4 space-y-2">
              <h3 className="text-[15px] font-semibold">7) ติดต่อเรา</h3>
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-slate-200">
                  ฝ่ายคุ้มครองข้อมูลส่วนบุคคล (DPO)
                </p>
                <p className="text-slate-300">
                  โทร: <span className="font-medium">{contactPhone}</span>
                </p>
                <p className="text-slate-300">
                  อีเมล:{" "}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="underline decoration-dotted hover:text-cyan-300"
                  >
                    {contactEmail}
                  </a>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  โปรดระบุรายละเอียดคำขอ/หมายเลขอ้างอิง (ถ้ามี) เพื่อความรวดเร็ว
                </p>
              </div>
            </section>

            <p className="mt-5 text-xs text-slate-400">
              เราอาจปรับปรุงเอกสารฉบับนี้เป็นครั้งคราว และจะแจ้งให้ทราบเมื่อมีสาระสำคัญเปลี่ยนแปลง
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">
            <button
              onClick={onClose}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
