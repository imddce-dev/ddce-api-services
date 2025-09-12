"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Copy, Check, Shield, KeyRound, Activity, Database, Cloud, Lock, Globe, Rocket, BookOpenCheck, Code, Server, PlugZap, Mail, ArrowRight, Link2 } from "lucide-react";

export default function IntroductionPage() {
  const [copied, setCopied] = React.useState(false);

  const curl = `curl -X GET \
  https://api.ddce.go.th/v1/events?from=2025-08-01&to=2025-09-01 \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "X-Org: your-org-code"`;

  const tsFetch = String.raw`import type { EventItem } from "./types";

async function fetchEvents(token: string): Promise<EventItem[]> {
  const res = await fetch("https://api.ddce.go.th/v1/events?limit=20", {
    headers: { Authorization: 'Bearer \${token}' },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}`;

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#060913] text-slate-100">
      {/* ===== Background (Aurora + Grid + Orbs) ===== */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(56,189,248,.18),transparent_60%),radial-gradient(40%_25%_at_10%_15%,rgba(16,185,129,.15),transparent_60%),radial-gradient(45%_30%_at_90%_10%,rgba(250,204,21,.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background:linear-gradient(to_right,transparent_48%,rgba(255,255,255,.25)_50%,transparent_52%),linear-gradient(to_bottom,transparent_48%,rgba(255,255,255,.25)_50%,transparent_52%)] [background-size:28px_28px] [mask-image:radial-gradient(80%_50%_at_50%_10%,#000_25%,transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-40 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />

      {/* ===== HERO ===== */}
      {/* ===== Top Bar ===== */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/35">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-bold text-white shadow-sm">DD</span>
            <span className="text-sm font-semibold tracking-tight text-slate-100 md:text-base">DDCE API</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/docs" className="transition-colors hover:text-white">Docs</Link>
            <Link href="/introduction/quickstart" className="transition-colors hover:text-white">Quickstart</Link>
            <Link href="/introduction/contact" className="transition-colors hover:text-white">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-slate-200 hover:text-white">
              <Link href="/auth/login">เข้าสู่ระบบ</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
              <Link href="/register">สมัครใช้งาน</Link>
            </Button>
          </div>
        </div>
      </div>

      <header className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 md:pt-28">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
            <div className="flex-1">
              <div className="mb-5 flex items-center gap-2">
                <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                  DDCE API
                </Badge>
                <Badge variant="outline" className="border-emerald-400/40 text-emerald-300">
                  v1 • Public Beta
                </Badge>
              </div>
              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                เชื่อมต่อข้อมูล <span className="bg-gradient-to-r from-cyan-300 via-emerald-200 to-amber-200 bg-clip-text text-transparent">เหตุการณ์โรคและภัยสุขภาพ</span>
                <br className="hidden md:block" /> อย่างปลอดภัย มาตรฐาน และตรวจสอบได้
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-slate-300/90">
                ข้อมูล API ของกองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน กรมควบคุมโรค (DDCE) สำหรับระบบ M‑EBS / EBS / EBS Province <span className="whitespace-nowrap">/ผลัก</span>ข้อมูลเหตุการณ์ และสถานการณ์
                แบบ near real‑time พร้อมมาตรการความปลอดภัยครบถ้วน
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20">
                  <Link href="/introduction/quickstart">
                    <Rocket className="h-4 w-4" /> เริ่มใช้งานอย่างรวดเร็ว
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="gap-2 bg-white/10 text-slate-100 hover:bg-white/20 border border-white/10 backdrop-blur">
                  <Link href="/docs">
                    <BookOpenCheck className="h-4 w-4" /> คู่มือและสคีมา
                  </Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" />OAuth2 • OpenID Connect</div>
                <div className="hidden items-center gap-2 md:flex"><Lock className="h-4 w-4" />TLS 1.3 • mTLS (partner)</div>
                <div className="hidden items-center gap-2 md:flex"><Globe className="h-4 w-4" />SLA 99.9%*</div>
              </div>
            </div>

            {/* Code Demo Card with glow border */}
            <div className="relative w-full max-w-xl flex-1">
              <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/40 via-emerald-400/40 to-amber-300/40 opacity-40 blur-xl" />
              <Card className="rounded-2xl border-slate-700/70 bg-slate-900/40 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-200">
                    <Server className="h-4 w-4" /> ตัวอย่างเรียกใช้งาน API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="curl" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-lg border border-slate-700/60 bg-slate-800/30 p-1">
                      <TabsTrigger value="curl" className="text-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-sm">cURL</TabsTrigger>
                      <TabsTrigger value="node" className="text-slate-200/90 hover:text-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-sm">Node/TS</TabsTrigger>
                      <TabsTrigger value="go" className="text-slate-200/90 hover:text-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-sm">Go</TabsTrigger>
                    </TabsList>
                    <TabsContent value="curl">
                      <div className="relative">
                        <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-700/60 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
                          {curl}
                        </pre>
                        <Button size="sm" variant="secondary" className="absolute right-3 top-3" onClick={() => copy(curl)}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="node">
                      <div className="relative">
                        <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-700/60 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
                          {tsFetch}
                        </pre>
                        <Button size="sm" variant="secondary" className="absolute right-3 top-3" onClick={() => copy(tsFetch)}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="go">
                      <div className="relative">
                        <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-700/60 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
                          {`package main
import (
  "net/http"
  "io"
)
func main(){
  req, _ := http.NewRequest("GET", "https://api.ddce.go.th/v1/events", nil)
  req.Header.Set("Authorization", "Bearer <TOKEN>")
  res, _ := http.DefaultClient.Do(req)
  defer res.Body.Close()
  body, _ := io.ReadAll(res.Body)
  println(string(body))
}`}
                        </pre>
                        <Button size="sm" variant="secondary" className="absolute right-3 top-3" onClick={() => copy("Go example copied")}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-10 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Avg. Latency", value: "180 ms" },
              { label: "Uptime (30d)", value: "99.97%" },
              { label: "Req/min (peak)", value: "12k" },
            ].map((s) => (
              <Card key={s.label} className="border-slate-700/70 bg-slate-900/40">
                <CardContent className="flex items-center justify-between p-4">
                  <span className="text-sm text-slate-400">{s.label}</span>
                  <span className="text-lg font-semibold text-slate-100">{s.value}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </header>

      {/* ===== Highlights ===== */}
      <section className="relative mx-auto max-w-7xl px-6 pb-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: <KeyRound className="h-5 w-5" />, title: "มาตรฐานสากล", desc: "OAuth2/OIDC, JWT, RBAC, Scopes ตามบทบาทและหน่วยงาน" },
            { icon: <Database className="h-5 w-5" />, title: "ข้อมูลคุณภาพ", desc: "สคีมาข้อมูล EBS สอดคล้องมาตรฐาน และมีร่องรอยการแก้ไข" },
            { icon: <Cloud className="h-5 w-5" />, title: "พร้อมใช้งาน", desc: "โครงสร้างพื้นฐาน Cloud‑native, autoscaling, log & audit ครบ" },
          ].map((f, i) => (
            <Card key={i} className="border-slate-700/60 bg-gradient-to-b from-slate-900/60 to-slate-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  {f.icon} <span className="text-base font-semibold">{f.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== Endpoints Glance ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">จุดเชื่อมต่อหลัก (API Endpoints)</h2>
          <Button asChild variant="link" className="gap-2 text-cyan-300">
            <Link href="/docs">ดูทั้งหมด <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              name: "เหตุการณ์ (Events)",
              path: "/v1/events",
              note: "ดึงเหตุการณ์ที่ผ่านการคัดกรอง/จัดหมวด พร้อม metadata และสถานะ",
              tags: ["GET", "JSON", "paginated"],
            },
            {
              name: "การแจ้งเตือน (Notifications)",
              path: "/v1/notifications",
              note: "รับ feed แจ้งเตือนแบบ near real‑time และ webhook",
              tags: ["GET", "webhook", "SSE"],
            },
            {
              name: "รายงานสถานการณ์ (Situation)",
              path: "/v1/situation",
              note: "ข้อมูลสรุปรายวัน/รายสัปดาห์สำหรับแดชบอร์ด",
              tags: ["GET", "charts"],
            },
            {
              name: "ส่งข้อมูลกลับ (Ingest)",
              path: "/v1/ingest",
              note: "ช่องทางส่งข้อมูลจากจังหวัด/หน่วยงานกลับเข้าสู่ศูนย์",
              tags: ["POST", "mTLS"],
            },
          ].map((e, i) => (
            <Card key={i} className="relative overflow-hidden border-slate-700/60 bg-slate-900/40">
              <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg" />
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2"><PlugZap className="h-4 w-4" /> {e.name}</span>
                  <Badge variant="outline" className="border-cyan-400/40 text-cyan-300">{e.path}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300">
                <div className="mb-3 text-slate-300/90">{e.note}</div>
                <div className="flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="bg-slate-700 text-slate-200">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-xl font-semibold md:text-2xl">วิธีเริ่มต้นใช้งาน</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { step: 1, title: "ลงทะเบียนผู้พัฒนา", desc: "ยืนยันตัวตน, สมัคร Client, ขอ scopes ตามบทบาท" },
            { step: 2, title: "ขอสิทธิ์และทดสอบ", desc: "รับ Client ID/Secret, ทดลองกับ Sandbox และ Postman" },
            { step: 3, title: "เชื่อมต่อจริง", desc: "โยกไป Production, ตั้งค่า IP whitelist, webhook และ monitoring" },
          ].map((s) => (
            <Card key={s.step} className="border-slate-700/60 bg-slate-900/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-sm font-semibold text-slate-200">
                    {s.step}
                  </span>
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300">{s.desc}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild className="gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
            <Link href="/register"><KeyRound className="h-4 w-4" /> สมัครใช้งาน API</Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 border-slate-700/80 bg-slate-900/40">
            <Link href="/contact"><Mail className="h-4 w-4" /> ติดต่อทีม API</Link>
          </Button>
        </div>
      </section>

      {/* ===== Try playground ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-700/60 bg-slate-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base"><Code className="h-4 w-4" /> ลองยิง API (Sandbox)</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Endpoint</label>
                  <Input defaultValue="https://sandbox.ddce.go.th/v1/events?limit=5" className="bg-slate-900/60 text-slate-100 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-300">Bearer Token</label>
                  <Input type="password" placeholder="ใส่ token เพื่อทดสอบ" className="bg-slate-900/60 text-slate-100 placeholder:text-slate-400" />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="gap-2"><PlugZap className="h-4 w-4" /> ส่งคำขอ</Button>
                  <Button type="button" variant="outline" className="gap-2"><Link2 className="h-4 w-4" /> เปิดด้วย Postman</Button>
                </div>
                <p className="text-xs text-slate-400">ตัวอย่างสำหรับเดโม UI เท่านั้น — เชื่อม logic ภายหลังได้</p>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-700/60 bg-slate-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4" /> หลักการความปลอดภัย</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              <ul className="list-inside list-disc space-y-2">
                <li>ยืนยันตัวตนผ่าน OAuth2/OIDC (Authorization Code + PKCE)</li>
                <li>กำหนดขอบเขตการเข้าถึงด้วย Scopes และ RBAC ตามหน่วยงาน</li>
                <li>เข้ารหัสข้อมูลระหว่างทางด้วย TLS 1.3 และบังคับ mTLS สำหรับ partner สำคัญ</li>
                <li>บันทึกการเข้าถึง (Audit Log) และมีระบบแจ้งเตือนเมื่อผิดปกติ</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-4 text-xl font-semibold md:text-2xl">คำถามที่พบบ่อย</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>รองรับระบบอะไรบ้าง (M‑EBS / EBS / EBS Province)?</AccordionTrigger>
            <AccordionContent>
              API ถูกออกแบบให้ทำงานร่วมกับหลายระบบของ DDCE โดยใช้สคีมามาตรฐานเดียวกัน และมีตัวแปลง (adapter) สำหรับแหล่งข้อมูลเดิม
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>ขอสิทธิ์ใช้งาน Production ต้องทำอย่างไร?</AccordionTrigger>
            <AccordionContent>
              ลงทะเบียนผู้พัฒนา สร้าง Client และส่งแบบคำขอระบุขอบเขตการเข้าถึง ข้อมูลการติดต่อผู้รับผิดชอบ และรายการ IP ที่จะเชื่อมต่อ
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>มี SDK หรือไม่?</AccordionTrigger>
            <AccordionContent>
              เรามีตัวอย่างโค้ดและไฟล์ Postman ให้เริ่มต้นได้ทันที SDK ทางการสำหรับ TypeScript และ Go อยู่ระหว่างพัฒนา
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ===== CTA ===== */}
      <footer className="relative border-t border-slate-800/60 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold">พร้อมเชื่อมต่อหรือยัง?</h3>
              <p className="mt-1 text-slate-300">สมัครใช้งาน ใช้ Sandbox ทดสอบ และย้ายสู่ Production ได้เมื่อพร้อม</p>
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
                <Link href="/register"><KeyRound className="h-5 w-5" /> สมัครใช้งาน</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="gap-2 bg-white/10 text-slate-100 hover:bg-white/20 border border-white/10">
                <Link href="/introduction/quickstart"><Rocket className="h-5 w-5" /> Quickstart</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
