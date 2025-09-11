"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Copy, Check, KeyRound, BookOpenCheck, TerminalSquare, Server,
  Shield, Globe, Rocket, LockKeyhole, Boxes, PlugZap
} from "lucide-react";

export default function QuickStartPage() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const curl = String.raw`curl -X GET \
  https://sandbox.ddce.go.th/v1/events?limit=5 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"`;

  const node = String.raw`// npm i cross-fetch
import fetch from "cross-fetch";
async function main(){
  const res = await fetch("https://sandbox.ddce.go.th/v1/events?limit=5",{
    headers: { Authorization: 'Bearer ${'$'}{process.env.ACCESS_TOKEN}' },
  });
  console.log(await res.json());
}
main();`;

  const go = String.raw`package main
import ("net/http"; "io"; "os")
func main(){
  req, _ := http.NewRequest("GET","https://sandbox.ddce.go.th/v1/events?limit=5", nil)
  req.Header.Set("Authorization", "Bearer "+os.Getenv("ACCESS_TOKEN"))
  res, _ := http.DefaultClient.Do(req)
  defer res.Body.Close(); b,_ := io.ReadAll(res.Body)
  println(string(b))
}`;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <main className="relative min-h-screen bg-[#060913] text-slate-100">
      {/* ===== Background ===== */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(56,189,248,.18),transparent_60%),radial-gradient(40%_25%_at_10%_15%,rgba(16,185,129,.15),transparent_60%),radial-gradient(45%_30%_at_90%_10%,rgba(250,204,21,.12),transparent_60%)]" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-40 h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-3xl" />

      {/* ===== Top bar (with menu) ===== */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-bold text-white">DD</span>
            <span className="text-sm font-semibold">DDCE API</span>
          </Link>

          {/* Menu (md+) */}
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/docs" className="transition-colors hover:text-white">Docs</Link>
            <Link href="/introduction/quickstart" className="transition-colors hover:text-white">Quickstart</Link>
            <Link href="/introduction/Contact" className="transition-colors hover:text-white">Contact</Link>
          </nav>

          {/* Auth actions */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-slate-100 hover:text-white">
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
              <Link href="/register">สมัครใช้งาน</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Hero ===== */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-300 ring-1 ring-cyan-400/30">Quickstart</Badge>
            <Badge variant="outline" className="border-emerald-400/40 text-emerald-300">อ่าน 3–5 นาที</Badge>
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
            เริ่มใช้งาน DDCE API (ฉบับอ่านอย่างเดียว)
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300/90">
            ภาพรวมขั้นตอนแบบย่อ + ตัวอย่างโค้ดพร้อมคัดลอก ใช้เป็นไกด์ก่อนเชื่อมระบบจริง
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
              <Link href="/register"><KeyRound className="h-4 w-4" /> สมัครใช้งาน</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="gap-2 bg-white/10 text-slate-100 hover:bg-white/20 border border-white/10">
              <Link href="/docs"><BookOpenCheck className="h-4 w-4" /> ไปที่เอกสารทั้งหมด</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== 5 ขั้นตอนแบบอ่าน ===== */}
      <section className="relative mx-auto max-w-7xl px-6 pb-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* 1 */}
          <Card className="relative overflow-hidden border-slate-700/60 bg-slate-900/40">
            <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <Boxes className="h-5 w-5" />
                <span className="font-semibold text-slate-100">1) เตรียมความพร้อม</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              <ul className="list-inside list-disc space-y-1">
                <li>สร้างบัญชีนักพัฒนา DDCE</li>
                <li>ขอสิทธิ์ใช้งาน Sandbox</li>
                <li>เตรียมเครื่องมือ: cURL / Postman / Node / Go</li>
              </ul>
            </CardContent>
          </Card>
          {/* 2 */}
          <Card className="relative overflow-hidden border-slate-700/60 bg-slate-900/40">
            <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <KeyRound className="h-5 w-5" />
                <span className="font-semibold text-slate-100">2) รับ Client & Scopes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              <ul className="list-inside list-disc space-y-1">
                <li>ลงทะเบียนระบบของคุณและรับ Client ID/Secret</li>
                <li>เริ่มจากสิทธิ์อ่าน: <code className="rounded bg-white/10 px-1 text-cyan-200">events.read</code>, <code className="rounded bg-white/10 px-1 text-cyan-200">notify.read</code></li>
              </ul>
            </CardContent>
          </Card>
          {/* 3 */}
          <Card className="relative overflow-hidden border-slate-700/60 bg-slate-900/40">
            <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <Shield className="h-5 w-5" />
                <span className="font-semibold text-slate-100">3) รับโทเคน (OAuth2 + PKCE)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              <ul className="list-inside list-disc space-y-1">
                <li>ทำ Authorization Code + PKCE → แลกโค้ดที่ <code className="rounded bg-white/10 px-1 text-cyan-200">/oauth/token</code></li>
                <li>ใช้ <code className="rounded bg-white/10 px-1 text-cyan-200">access_token</code> กับทุกคำขอ</li>
              </ul>
            </CardContent>
          </Card>
          {/* 4 */}
          <Card className="relative overflow-hidden border-slate-700/60 bg-slate-900/40">
            <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <TerminalSquare className="h-5 w-5" />
                <span className="font-semibold text-slate-100">4) ยิงคำขอแรก (Sandbox)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              ลองที่ <code className="rounded bg-white/10 px-1 text-cyan-200">/v1/events</code> ตามตัวอย่างด้านล่าง จากนั้นตรวจผลลัพธ์
            </CardContent>
          </Card>
          {/* 5 */}
          <Card className="relative overflow-hidden border-slate-700/60 bg-slate-900/40">
            <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <Globe className="h-5 w-5" />
                <span className="font-semibold text-slate-100">5) Promote ไป Production</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              <ul className="list-inside list-disc space-y-1">
                <li>ส่งแบบคำขอ Promote + IP whitelist และผู้รับผิดชอบ</li>
                <li>เปลี่ยนฐาน URL: <code className="rounded bg-white/10 px-1 text-cyan-200">sandbox.ddce.go.th</code> → <code className="rounded bg-white/10 px-1 text-cyan-200">api.ddce.go.th</code></li>
              </ul>
            </CardContent>
          </Card>
          {/* Best Practices */}
          <Card className="relative overflow-hidden border-slate-700/60 bg-slate-900/40">
            <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-amber-300/20 opacity-40 blur-lg" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <LockKeyhole className="h-5 w-5" />
                <span className="inline-flex items-center gap-2">
                  <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-xs text-cyan-200">Best Practices</span>
                  <span className="font-semibold text-slate-100">ความปลอดภัย</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              <ul className="list-inside list-disc space-y-1">
                <li>เก็บโทเคนใน Secret Manager/ENV เท่านั้น</li>
                <li>จำกัด Scopes ตามบทบาทจริง และหมุนเวียน secret</li>
                <li>เปิด mTLS สำหรับข้อมูลอ่อนไหวสูง</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== Code examples ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">ตัวอย่างโค้ด</h2>
          <Badge variant="outline" className="border-cyan-400/40 text-cyan-300">Sandbox</Badge>
        </div>
        <Card className="rounded-2xl border-slate-700/70 bg-slate-900/40 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-200">
              <Server className="h-4 w-4" /> เรียก <code className="rounded bg-white/10 px-1 text-cyan-200">/v1/events</code>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-lg border border-slate-700/60 bg-slate-800/30 p-1">
                <TabsTrigger value="curl" className="text-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-sm">cURL</TabsTrigger>
                <TabsTrigger value="node" className="text-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-sm">Node</TabsTrigger>
                <TabsTrigger value="go" className="text-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-sm">Go</TabsTrigger>
              </TabsList>

              <TabsContent value="curl">
                <CodeBlock text={curl} onCopy={() => copy(curl, "curl")} copied={copied === "curl"} />
              </TabsContent>
              <TabsContent value="node">
                <CodeBlock text={node} onCopy={() => copy(node, "node")} copied={copied === "node"} />
              </TabsContent>
              <TabsContent value="go">
                <CodeBlock text={go} onCopy={() => copy(go, "go")} copied={copied === "go"} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notes */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Auth", text: "ทุกคำขอต้องส่ง Header Authorization: Bearer <ACCESS_TOKEN>", icon: <Shield className="h-4 w-4" /> },
            { label: "Rate limit", text: "ระบบกำหนด quota ตาม client/บทบาท หาก 429 ให้หน่วงและ retry", icon: <PlugZap className="h-4 w-4" /> },
            { label: "เอกสารเต็ม", text: "สคีมา, ตัวอย่าง response และ error codes อยู่ในหน้า Docs", icon: <BookOpenCheck className="h-4 w-4" /> },
          ].map((n) => (
            <Card key={n.label} className="border-slate-700/60 bg-slate-900/40">
              <CardContent className="flex items-center gap-3 p-4 text-sm text-slate-300">
                {n.icon}
                <div>
                  <span className="font-medium text-slate-100">{n.label}:</span> {n.text}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative mx-auto max-w-7xl px-6 pb-16">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
            <Link href="/register"><KeyRound className="h-5 w-5" /> สมัครใช้งาน</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="gap-2 bg-white/10 text-slate-100 hover:bg-white/20 border border-white/10">
            <Link href="/docs"><BookOpenCheck className="h-5 w-5" /> อ่านเอกสารเต็ม</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function CodeBlock({ text, onCopy, copied }: { text: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-cyan-500/60 via-emerald-400/60 to-amber-300/60" />
      <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-700/60 bg-[#0a0f1e] p-4 text-sm leading-relaxed text-slate-200 shadow-inner">
        {text}
      </pre>
      <Button size="sm" variant="secondary" className="absolute right-3 top-3" onClick={onCopy}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
