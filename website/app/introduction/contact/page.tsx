"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Network } from "lucide-react";
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

/* ---------- BG: รูป + overlay (เหมือน intro) ---------- */
function BGWithImage() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShow(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* รูปพื้นหลัง */}
      <div
        className={[
          "absolute inset-0 bg-fixed bg-cover bg-center transition-opacity duration-700 ease-out will-change-[opacity]",
          show ? "opacity-90" : "opacity-0",
        ].join(" ")}
        style={{ backgroundImage: "url('/bgintroduction1.jpg')" }}
      />
      {/* overlays + grid + noise (จาง ๆ) */}
      <div
        className={[
          "absolute inset-0 transition-opacity duration-700 ease-out will-change-[opacity]",
          show ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_10%,rgba(34,211,238,.22),transparent_70%),radial-gradient(60%_40%_at_90%_0%,rgba(16,185,129,.18),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.08]
          [background:linear-gradient(to_right,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.28)_1px,transparent_1px)]
          bg-[size:28px_28px]
          [mask-image:radial-gradient(70%_70%_at_50%_35%,black,transparent)]
          animate-[grid-move_22s_linear_infinite]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay animate-[grain_1.8s_steps(6)_infinite]
          [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22 opacity=%220.5%22 /></svg>')]" />
      </div>
    </div>
  );
}

/* ---------- FadeIn (stagger) ---------- */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={[
        "transform-gpu transition-all duration-700 ease-out will-change-[opacity,transform]",
        on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ---------- แถบบน/ล่าง: เหมือนหน้า Introduction ---------- */
function FixedHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        {/* โลโก้ชิดซ้ายอยู่ข้างข้อความ */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 min-w-0"
          aria-label="DDCE API – Home"
        >
          {/* <LogoMark size={80} /> */}
          <span className="text-sm font-medium text-white text-center">
            DDCE API Request
          </span>
        </Link>
        <nav className="hidden items-center gap-4 sm:flex">
          <Link className="text-slate-300 transition-colors duration-200 hover:text-white" href="/introduction/docs">
            Docs
          </Link>
          <Link className="text-slate-300 transition-colors duration-200 hover:text-white" href="/introduction/contact">
            Contact
          </Link>
          <Link
            href="/auth/register"
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
          >
            สมัครใช้งาน
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition-transform duration-200 active:scale-[0.98]"
          >
            Login
          </Link>
        </nav>
      </div>
    </div>
  );
}

function FixedBottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/50 transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <p className="hidden text-sm text-slate-300 md:block">
          Powered by <b>IM-DDCE Team</b>
        </p>
        {/* <div className="ml-auto flex gap-2">
          <Link
            href="/auth/register"
            className="rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100 transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
          >
            สมัครใช้งาน
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-transform duration-200 active:scale-[0.98]"
          >
            Login
          </Link>
        </div> */}
      </div>
    </div>
  );
}
export default function ContactPage() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    });
  };

  const PHONE_DISPLAY = "02-590-3238";
  const PHONE_TEL = "+6625903238";
  const EMAIL = "im.ddce@gmail.com";
  const LINE_NAME = "@736znvyp";
  const LINE_URL = "https://lin.ee/WqAyWNo";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060913] text-slate-100">
      <BGWithImage />
      <FixedHeader />
      <FixedBottomBar />

      <div className="relative z-10 pt-16 pb-[72px] md:pb-[68px]">
        {/* Hero */}
        <header className="relative">
          <FadeIn delay={70}>
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
              <div className="mb-4 flex items-center gap-2">
                <Badge className="bg-cyan-600/20 text-cyan-200 ring-1 ring-cyan-400/30">Support</Badge>
                <Badge variant="outline" className="border-emerald-400/40 text-emerald-200">DDCE API</Badge>
              </div>

              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                <span className="bg-gradient-to-r from-cyan-200 via-emerald-100 to-amber-100 bg-clip-text text-transparent">
                  ติดต่อทีมงาน IM-DDCE API
                </span>
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-100/95">
                ช่องทางการติดต่อ — โทรศัพท์ อีเมล และ LINE IM Helpdesk
              </p>

              <div className="mt-6 h-px w-full bg-gradient-to-r from-cyan-500/30 via-emerald-400/30 to-amber-300/30" />
            </div>
          </FadeIn>
        </header>

        {/* Cards */}
        <section className="relative mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Phone */}
            <FadeIn delay={120}>
              <GlassCard>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <span className="rounded-md bg-cyan-500/15 p-1.5 ring-1 ring-cyan-400/20"><Phone className="h-4 w-4" /></span>
                    โทรศัพท์
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-200">
                  <div className="text-2xl font-semibold tracking-tight text-slate-100"> {PHONE_DISPLAY} </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button asChild className="gap-2 transition-transform duration-200 active:scale-[0.98]">
                      <a href={`tel:${PHONE_TEL}`} aria-label="โทรหาเบอร์ DDCE">
                        <Phone className="h-4 w-4" /> โทรตอนนี้
                      </a>
                    </Button>
                    <CopyButton
                      isCopied={copied === "phone"}
                      onClick={() => copyToClipboard(PHONE_DISPLAY, "phone")}
                    />
                  </div>
                  <p className="text-xs text-slate-300/90">เวลาทำการ: จันทร์–ศุกร์ 08:30–16:30 น. (ยกเว้นวันหยุดราชการ)</p>
                </CardContent>
              </GlassCard>
            </FadeIn>

            {/* Email */}
            <FadeIn delay={200}>
              <GlassCard>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <span className="rounded-md bg-emerald-500/15 p-1.5 ring-1 ring-emerald-400/20"><Mail className="h-4 w-4" /></span>
                    อีเมล
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-200">
                  <div className="text-xl font-semibold text-slate-100">{EMAIL}</div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button asChild className="gap-2 transition-transform duration-200 active:scale-[0.98]">
                      <a href={`mailto:${EMAIL}`} aria-label="ส่งอีเมลถึงทีม DDCE">
                        <Mail className="h-4 w-4" /> เขียนเมล
                      </a>
                    </Button>
                    <CopyButton
                      isCopied={copied === "email"}
                      onClick={() => copyToClipboard(EMAIL, "email")}
                    />
                  </div>
                  <p className="text-xs text-slate-300/90">ตอบกลับภายในเวลาทำการ โดยทั่วไปไม่เกิน 1–2 วันทำการ</p>
                </CardContent>
              </GlassCard>
            </FadeIn>

            {/* LINE */}
            <FadeIn delay={280}>
              <GlassCard>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                    <span className="rounded-md bg-amber-500/15 p-1.5 ring-1 ring-amber-400/20"><MessageSquare className="h-4 w-4" /></span>
                    LINE IM Helpdesk
                  </CardTitle>
                </CardHeader>

                <Dialog>
                  <CardContent className="space-y-4 text-slate-200">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-300">บัญชีทางการ</div>
                      <div className="text-xl font-semibold text-slate-100">@{LINE_NAME.replace("@", "")}</div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <DialogTrigger asChild>
                        <Button className="gap-2 transition-transform duration-200 active:scale-[0.98]"><QrCode className="h-4 w-4" /> แสดง QR</Button>
                      </DialogTrigger>
                      <CopyButton
                        label="คัดลอกลิงก์"
                        isCopied={copied === "line"}
                        onClick={() => copyToClipboard("https://lin.ee/WqAyWNo", "line")}
                      />
                    </div>

                    <p className="text-xs text-slate-300/90">กด “แสดง QR” เพื่อสแกนเพิ่มเพื่อน หรือคัดลอกลิงก์เพื่อเปิดบนมือถือ</p>
                  </CardContent>

                  <DialogContent className="max-w-md border-white/10 bg-slate-950/80 backdrop-blur">
                    <DialogHeader><DialogTitle className="text-slate-100">สแกนเพื่อแอด LINE</DialogTitle></DialogHeader>
                    <div className="flex items-center justify-center p-2">
                      <img src="https://qr-official.line.me/gs/M_736znvyp_GW.png?oat_content=qr" alt="LINE Official QR" className="h-auto w-64 rounded-md border border-white/10 bg-white/5" />
                    </div>
                    <Separator className="my-2 bg-white/10" />
                    <p className="px-2 text-center text-xs text-slate-300/90">หรือคัดลอกลิงก์: https://lin.ee/WqAyWNo</p>
                  </DialogContent>
                </Dialog>
              </GlassCard>
            </FadeIn>
          </div>

          {/* Notes */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <FadeIn delay={340}>
              <GlassPlain>
                <CardContent className="flex items-start gap-3 p-4 text-sm text-slate-200">
                  <span className="rounded-md bg-cyan-500/15 p-1.5 ring-1 ring-cyan-400/20"><Shield className="h-4 w-4" /></span>
                  <div><span className="font-medium text-slate-100">หมายเหตุด้านความปลอดภัย:</span> หลีกเลี่ยงการส่งข้อมูลลับ (เช่น client secret หรือ access token) ทางช่องแชทสาธารณะ ให้ใช้ช่องทางอีเมลหรือระบบที่เข้ารหัสเท่านั้น</div>
                </CardContent>
              </GlassPlain>
            </FadeIn>

            <FadeIn delay={420}>
              <GlassPlain>
                <CardContent className="flex items-start gap-3 p-4 text-sm text-slate-200">
                  <span className="rounded-md bg-emerald-500/15 p-1.5 ring-1 ring-emerald-400/20"><MapPin className="h-4 w-4" /></span>
                  <div><span className="font-medium text-slate-100">เวลาทำการ:</span> จันทร์–ศุกร์ 08:30–16:30 น. (ยกเว้นวันหยุดราชการ) — นอกเวลาทำการจะตอบกลับในวันถัดไป</div>
                </CardContent>
              </GlassPlain>
            </FadeIn>
          </div>
        </section>
      </div>

      {/* keyframes + smooth scroll */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes grid-move {
          from { background-position: 0px 0px, 0px 0px; }
          to   { background-position: 28px 28px, 28px 28px; }
        }
        @keyframes grain {
          0% { transform: translate(0,0); }
          10% { transform: translate(-5%,-10%); }
          20% { transform: translate(-15%,5%); }
          30% { transform: translate(7%,-25%); }
          40% { transform: translate(-5%,25%); }
          50% { transform: translate(-15%,10%); }
          60% { transform: translate(15%,0%); }
          70% { transform: translate(0%,15%); }
          80% { transform: translate(3%,35%); }
          90% { transform: translate(-10%,10%); }
          100% { transform: translate(0,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .transition-all, .transition-colors, .transition-transform, .transition-opacity {
            transition: none !important;
          }
          .animate-\[grid-move_22s_linear_infinite\],
          .animate-\[grain_1\.8s_steps\(6\)_infinite] {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}

/* ปุ่มคัดลอกแบบย่อ */
function CopyButton({
  onClick,
  isCopied,
  label = "คัดลอก",
  copiedLabel = "คัดลอกแล้ว",
}: {
  onClick: () => void;
  isCopied: boolean;
  label?: string;
  copiedLabel?: string;
}) {
  return (
    <Button
      variant="secondary"
      className="gap-2 transition-all duration-150 active:scale-95"
      onClick={onClick}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {isCopied ? copiedLabel : label}
    </Button>
  );
}

/* ===== glass wrappers ===== */
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-slate-700/60 bg-slate-900/50 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-600 hover:shadow-cyan-500/10">
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg transition-opacity duration-300 group-hover:opacity-60" />
      {children}
    </Card>
  );
}
function GlassPlain({ children }: { children: React.ReactNode }) {
  return <Card className="relative rounded-2xl border-slate-700/60 bg-slate-900/50 transition-colors duration-300">{children}</Card>;
}
