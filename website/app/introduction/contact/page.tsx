"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Phone,
  Mail,
  MessageSquare,
  Copy,
  Check,
  Shield,
  MapPin,
  QrCode,
} from "lucide-react";

export default function ContactPage() {
  const [copied, setCopied] = React.useState<string | null>(null);

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    });
  }

  const PHONE_DISPLAY = "02-590-3238";
  const PHONE_TEL = "+6625903238";
  const EMAIL = "im.ddce@gmail.com";
  const LINE_NAME = "@736znvyp";
  const LINE_URL = "https://lin.ee/WqAyWNo";
  const LINE_QR =
    "https://qr-official.line.me/gs/M_736znvyp_GW.png?oat_content=qr";

  return (
    <main className="relative min-h-screen bg-[#060913] text-slate-100">
      {/* ===== Background (Aurora + Grid) ===== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(56,189,248,.18),transparent_60%),radial-gradient(40%_25%_at_10%_15%,rgba(16,185,129,.15),transparent_60%),radial-gradient(45%_30%_at_90%_10%,rgba(250,204,21,.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background:linear-gradient(to_right,transparent_48%,rgba(255,255,255,.3)_50%,transparent_52%),linear-gradient(to_bottom,transparent_48%,rgba(255,255,255,.3)_50%,transparent_52%)] [background-size:28px_28px] [mask-image:radial-gradient(80%_50%_at_50%_0%,#000_25%,transparent_70%)]" />
        <div className="absolute -top-32 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -left-32 top-40 h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* ===== Top Bar ===== */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur supports-[backdrop-filter]:bg-black/35">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5">
          <Link href="/" className="group flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-bold text-white shadow-sm ring-1 ring-white/20 transition-transform group-hover:scale-105">
              DD
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-100 md:text-base">
              DDCE API
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/docs" className="transition-colors hover:text-white">
              Docs
            </Link>
            <Link
              href="/introduction/quickstart"
              className="transition-colors hover:text-white"
            >
              Quickstart
            </Link>
            <Link href="/introduction/contact" className="text-white">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-slate-100 hover:text-white">
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20"
            >
              <Link href="/register">สมัครใช้งาน</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Hero ===== */}
      <header className="relative">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="mb-4 flex items-center gap-2">
            <Badge className="bg-cyan-600/20 text-cyan-300 ring-1 ring-cyan-400/30">
              Support
            </Badge>
            <Badge variant="outline" className="border-emerald-400/40 text-emerald-300">
              DDCE API
            </Badge>
          </div>

          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-200 via-emerald-100 to-amber-100 bg-clip-text text-transparent">
              ติดต่อทีมงาน DDCE API
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300/95">
            ช่องทางช่วยเหลือสำหรับนักพัฒนาและหน่วยงานพันธมิตร — โทรศัพท์ อีเมล และ LINE IM Helpdesk
          </p>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-cyan-500/30 via-emerald-400/30 to-amber-300/30" />
        </div>
      </header>

      {/* ===== Contact Cards ===== */}
      <section className="relative mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Phone */}
          <GlassCard>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <span className="rounded-md bg-cyan-500/15 p-1.5 ring-1 ring-cyan-400/20">
                  <Phone className="h-4 w-4" />
                </span>
                โทรศัพท์
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div className="text-2xl font-semibold tracking-tight text-slate-100">
                {PHONE_DISPLAY}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="gap-2">
                  <a href={`tel:${PHONE_TEL}`} aria-label="โทรหาเบอร์ DDCE">
                    <Phone className="h-4 w-4" /> โทรตอนนี้
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => copyToClipboard(PHONE_DISPLAY, "phone")}
                >
                  {copied === "phone" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  คัดลอก
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                เวลาทำการ: จันทร์–ศุกร์ 08:30–16:30 น. (ยกเว้นวันหยุดราชการ)
              </p>
            </CardContent>
          </GlassCard>

          {/* Email */}
          <GlassCard>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <span className="rounded-md bg-emerald-500/15 p-1.5 ring-1 ring-emerald-400/20">
                  <Mail className="h-4 w-4" />
                </span>
                อีเมล
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div className="text-xl font-semibold text-slate-100">{EMAIL}</div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild className="gap-2">
                  <a href={`mailto:${EMAIL}`} aria-label="ส่งอีเมลถึงทีม DDCE">
                    <Mail className="h-4 w-4" /> เขียนเมล
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => copyToClipboard(EMAIL, "email")}
                >
                  {copied === "email" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  คัดลอก
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                ตอบกลับภายในเวลาทำการ โดยทั่วไปไม่เกิน 1–2 วันทำการ
              </p>
            </CardContent>
          </GlassCard>

          {/* LINE – ไม่มีรูปแสดงในหน้า, กดปุ่มแล้วค่อยเด้ง QR */}
          <GlassCard>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <span className="rounded-md bg-amber-500/15 p-1.5 ring-1 ring-amber-400/20">
                  <MessageSquare className="h-4 w-4" />
                </span>
                LINE IM Helpdesk
              </CardTitle>
            </CardHeader>

            <Dialog>
              <CardContent className="space-y-4 text-slate-300">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    บัญชีทางการ
                  </div>
                  <div className="text-xl font-semibold text-slate-100">{LINE_NAME}</div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {/* ปุ่มแสดง QR (เปิด dialog) */}
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <QrCode className="h-4 w-4" />
                      แสดง QR
                    </Button>
                  </DialogTrigger>

                  {/* ปุ่มคัดลอกลิงก์ */}
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => copyToClipboard(LINE_URL, "line")}
                  >
                    {copied === "line" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    คัดลอกลิงก์
                  </Button>
                </div>

                <p className="text-xs text-slate-400">
                  กด “แสดง QR” เพื่อสแกนเพิ่มเพื่อน หรือคัดลอกลิงก์เพื่อเปิดบนมือถือ
                </p>
              </CardContent>

              {/* เนื้อหา Dialog – QR ขนาดใหญ่ */}
              <DialogContent className="max-w-md border-white/10 bg-slate-950/80 backdrop-blur">
                <DialogHeader>
                  <DialogTitle className="text-slate-100">สแกนเพื่อแอด LINE</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center p-2">
                  <img
                    src={LINE_QR}
                    alt="LINE Official QR enlarged"
                    className="h-auto w-64 rounded-md border border-white/10 bg-white/5"
                  />
                </div>
                <Separator className="my-2 bg-white/10" />
                <p className="px-2 text-center text-xs text-slate-400">
                  หรือคัดลอกลิงก์: {LINE_URL}
                </p>
              </DialogContent>
            </Dialog>
          </GlassCard>
        </div>

        {/* ===== Notes ===== */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <GlassPlain>
            <CardContent className="flex items-start gap-3 p-4 text-sm text-slate-300">
              <span className="rounded-md bg-cyan-500/15 p-1.5 ring-1 ring-cyan-400/20">
                <Shield className="h-4 w-4" />
              </span>
              <div>
                <span className="font-medium text-slate-100">หมายเหตุด้านความปลอดภัย:</span>{" "}
                หลีกเลี่ยงการส่งข้อมูลลับ (เช่น client secret หรือ access token)
                ทางช่องแชทสาธารณะ ให้ใช้ช่องทางอีเมลหรือระบบที่เข้ารหัสเท่านั้น
              </div>
            </CardContent>
          </GlassPlain>

            <GlassPlain>
              <CardContent className="flex items-start gap-3 p-4 text-sm text-slate-300">
                <span className="rounded-md bg-emerald-500/15 p-1.5 ring-1 ring-emerald-400/20">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <span className="font-medium text-slate-100">เวลาทำการ:</span>{" "}
                  จันทร์–ศุกร์ 08:30–16:30 น. (ยกเว้นวันหยุดราชการ) — นอกเวลาทำการจะตอบกลับในวันถัดไป
                </div>
              </CardContent>
            </GlassPlain>
        </div>

        {/* ===== Credits ===== */}
        <div className="mt-10">
          <Separator className="bg-white/10" />
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-cyan-600/20 text-cyan-200">ผู้จัดทำ</Badge>
              <p className="text-sm md:text-base text-slate-300">
                <span className="font-semibold text-slate-100">
                  กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน
                </span>{" "}
                — กลุ่มการจัดการข้อมูลภาวะฉุกเฉินทางสาธารณสุข
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/** ===== Small “glass” wrappers to keep code tidy ===== */
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-slate-700/60 bg-slate-900/40 shadow-xl transition-all hover:border-slate-600 hover:shadow-cyan-500/10">
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg transition-opacity group-hover:opacity-60" />
      {children}
    </Card>
  );
}

function GlassPlain({ children }: { children: React.ReactNode }) {
  return (
    <Card className="relative rounded-2xl border-slate-700/60 bg-slate-900/40">
      {children}
    </Card>
  );
}
