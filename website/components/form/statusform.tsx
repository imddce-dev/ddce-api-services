'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { FetchApiReqById, type ApiReqData } from '@/services/apiService'
import { useUserStore } from '@/stores/useUserStore'
import apiClient from '@/services/apiConfig'
import {
  KeyRound, Copy, Check, Eye, EyeOff, ShieldCheck, Clock, XCircle,
  Sparkles, Info, Mail, User as UserIcon, Send,
} from 'lucide-react'

/* ============================== helpers ============================== */
function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
function mask(s: string) {
  if (!s) return '—'
  if (s.startsWith('[')) return s
  const head = s.slice(0, 4)
  const tail = s.slice(-4)
  const mid = '•'.repeat(Math.max(6, s.length - 8))
  return `${head}${mid}${tail}`
}
const norm = (s?: string) =>
  (s ?? '').toLowerCase().trim().replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '')

/** แปลง status → step/denied/label/tone */
function parseStatus(status?: string): {
  step: 1|2|3
  denied: boolean
  label: string
  tone: 'slate'|'amber'|'emerald'|'rose'
} {
  const n = norm(status)

  // pipeline หลัก
  if (n.includes('sending'))  return { step: 1, denied: false, label: 'ส่งคำขอ',       tone: 'slate' }
  if (n.includes('pending'))  return { step: 2, denied: false, label: 'กำลังดำเนินการ', tone: 'amber' }
  if (n.includes('active'))   return { step: 3, denied: false, label: 'อนุมัติ',        tone: 'emerald' }

  // ไทย
  if (n.includes('กำลังดำเนินการ')) return { step: 2, denied: false, label: 'กำลังดำเนินการ', tone: 'amber' }
  if (n.includes('อนุมัติ'))        return { step: 3, denied: false, label: 'อนุมัติ',        tone: 'emerald' }
  if (['ปฏิเสธ','ปฏิสธ','ปัฏิสธ'].some(x => n.includes(norm(x))))
    return { step: 3, denied: true, label: 'ปฏิเสธ', tone: 'rose' }

  // อังกฤษ
  if (['approved','success'].some(k => n.includes(k))) return { step: 3, denied: false, label: 'อนุมัติ', tone: 'emerald' }
  if (['rejected','denied','failed'].some(k => n.includes(k))) return { step: 3, denied: true, label: 'ปฏิเสธ', tone: 'rose' }
  if (['inprogress','processing'].some(k => n.includes(k)))  return { step: 2, denied: false, label: 'กำลังดำเนินการ', tone: 'amber' }

  return { step: 1, denied: false, label: status || 'ส่งคำขอ', tone: 'slate' }
}

/* tone → คลาสที่ใช้ซ้ำ */
const tone = {
  badge(t: 'slate'|'amber'|'emerald'|'rose') {
    if (t === 'emerald') return 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
    if (t === 'amber')   return 'bg-amber-500/15 text-amber-300 ring-amber-500/30'
    if (t === 'rose')    return 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
    return 'bg-slate-600/20 text-slate-300 ring-slate-600/40'
  },
  leftEdge(t: 'slate'|'amber'|'emerald'|'rose') {
    if (t === 'emerald') return 'from-emerald-400/70 via-teal-400/60 to-emerald-400/70'
    if (t === 'amber')   return 'from-amber-400/70 via-yellow-400/60 to-amber-400/70'
    if (t === 'rose')    return 'from-rose-500/70 via-pink-400/60 to-rose-500/70'
    return 'from-slate-500/60 via-slate-400/50 to-slate-500/60'
  },
  stepDot(active?: boolean, denied?: boolean, t?: 'slate'|'amber'|'emerald'|'rose') {
    if (!active) return 'bg-slate-700'
    if (denied)  return 'bg-rose-500'
    if (t === 'amber') return 'bg-amber-400'
    if (t === 'emerald') return 'bg-emerald-500'
    return 'bg-slate-500'
  },
  stepText(active?: boolean, denied?: boolean, t?: 'slate'|'amber'|'emerald'|'rose') {
    if (!active) return 'text-slate-500'
    if (denied)  return 'text-rose-300'
    if (t === 'amber') return 'text-amber-300'
    if (t === 'emerald') return 'text-emerald-300'
    return 'text-slate-300'
  },
  stepLine(active?: boolean, t?: 'slate'|'amber'|'emerald'|'rose') {
    if (!active) return 'bg-slate-700'
    if (t === 'amber')   return 'bg-gradient-to-r from-slate-600 via-amber-400/60 to-slate-600'
    if (t === 'rose')    return 'bg-gradient-to-r from-slate-600 via-rose-500/60 to-slate-600'
    if (t === 'emerald') return 'bg-gradient-to-r from-slate-600 via-emerald-500/60 to-slate-600'
    return 'bg-gradient-to-r from-slate-600 via-slate-400/60 to-slate-600'
  },
  chipBg(t:'slate'|'amber'|'emerald'|'rose') {
    if (t === 'emerald') return 'from-emerald-400/20 via-emerald-300/10 to-emerald-400/20'
    if (t === 'amber')   return 'from-amber-400/20 via-amber-300/10 to-amber-400/20'
    if (t === 'rose')    return 'from-rose-400/20 via-rose-300/10 to-rose-400/20'
    return 'from-slate-400/20 via-slate-300/10 to-slate-400/20'
  },
}

/* ============================== Page ============================== */
export default function StatusForm() {
  const [items, setItems] = useState<ApiReqData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API Key dialog
  const [openKeyForId, setOpenKeyForId] = useState<number | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [copyOk, setCopyOk] = useState(false)
  const [keyLoading, setKeyLoading] = useState(false)

  const userProfile = useUserStore((s) => s.userProfile)
  const currentId = userProfile?.id ?? null

  useEffect(() => {
    const load = async () => {
      if (!currentId) { setError('ยังไม่ได้เข้าสู่ระบบ'); setLoading(false); return }
      try {
        const res = await FetchApiReqById(currentId)
        if (res.success && res.data?.length) { setItems(res.data); setError(null) }
        else { setItems([]); setError('ไม่พบข้อมูล') }
      } catch (e) {
        console.error('โหลดข้อมูลล้มเหลว:', e); setItems([]); setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally { setLoading(false) }
    }
    load()
  }, [currentId])

  const hasItems = items.length > 0

  // summary
  const summary = useMemo(() => {
    const m = new Map<string, number>()
    for (const it of items) {
      const label = parseStatus(it.status).label
      m.set(label, (m.get(label) ?? 0) + 1)
    }
    const get = (k: string) => m.get(k) ?? 0
    return {
      sending: get('ส่งคำขอ'),
      pending: get('กำลังดำเนินการ'),
      active:  get('อนุมัติ'),
      denied:  get('ปฏิเสธ'),
    }
  }, [items])

  const handleOpenKey = async (req: ApiReqData) => {
    const st = parseStatus(req.status)
    if (!(st.step === 3 && !st.denied)) return
    setKeyLoading(true); setOpenKeyForId(req.id); setApiKey(null); setRevealed(false); setCopyOk(false)
    try {
      const resp = await apiClient.get<{ success: boolean; data?: { apiKey: string } }>(
        `/options/api-request/${req.id}/apikey`, { headers: { 'Cache-Control': 'no-store' } }
      )
      if (resp.data?.success && resp.data?.data?.apiKey) setApiKey(resp.data.data.apiKey)
      else setApiKey('[ไม่พบ API Key]')
    } catch (e) {
      console.error('ดึง API Key ล้มเหลว:', e)
      setApiKey('[เกิดข้อผิดพลาดในการดึง API Key]')
    } finally { setKeyLoading(false) }
  }

  const handleCopy = async () => {
    if (!apiKey || apiKey.startsWith('[')) return
    await navigator.clipboard.writeText(apiKey)
    setCopyOk(true); setTimeout(() => setCopyOk(false), 1200)
  }

  return (
    <main className="relative">
      {/* BG */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_70%_10%,rgba(16,185,129,0.17),rgba(2,6,23,0))]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(38%_28%_at_20%_18%,rgba(34,211,238,0.14),rgba(2,6,23,0))]" />
      <div className="pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light [background:repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0_2px,transparent_2px_6px)]" />

      {/* Summary chips */}
      {!loading && !error && (
        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <ChipStat title="ส่งคำขอ"        value={summary.sending} tone="slate"   icon={Send} />
          <ChipStat title="กำลังดำเนินการ" value={summary.pending} tone="amber"  icon={Clock} />
          <ChipStat title="อนุมัติ"        value={summary.active}  tone="emerald" icon={ShieldCheck} />
          <ChipStat title="ปฏิเสธ"         value={summary.denied}  tone="rose"    icon={XCircle} />
        </section>
      )}

      {/* States */}
      {loading && <ListSkeleton />}

      {!loading && error && (
        <EmptyState title={error} subtitle="โปรดลองใหม่ภายหลัง หรือเข้าสู่ระบบอีกครั้ง" />
      )}

      {!loading && !error && !hasItems && (
        <EmptyState title="ไม่พบข้อมูล" subtitle="ยังไม่มีคำขอของคุณในระบบ" />
      )}

      {!loading && !error && hasItems && (
        <div className="space-y-4">
          {items.map((ev) => {
            const st = parseStatus(ev.status)
            const approveEnabled = st.step === 3 && !st.denied
            return (
              <article
                key={ev.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl ring-1 ring-white/5 transition"
              >
                {/* ขอบซ้าย: ปรับสีตามสถานะ */}
                <div className={`pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${tone.leftEdge(st.tone)}`} />

                <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400">ID</span>
                      <span className="rounded-lg bg-slate-800/70 px-2 py-0.5 text-xs text-slate-200 ring-1 ring-inset ring-slate-700/60">{ev.id}</span>
                      <StatusBadge status={ev.status} />
                    </div>
                    <h3 className="mt-1 line-clamp-1 text-base font-medium text-slate-100">{ev.project_name || '—'}</h3>
                    <p className="mt-0.5 line-clamp-2 text-sm text-slate-400">
                      ผู้ยื่น: {ev.requester_name || '—'} · อีเมล: {ev.requester_email || '—'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-400">
                      สร้างเมื่อ: <span className="text-slate-300">{formatDate(ev.created_at)}</span>
                    </div>
                    <div className="hidden h-5 w-px bg-slate-700 md:block" />
                    <button
                      onClick={() => handleOpenKey(ev)}
                      disabled={!approveEnabled}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                      title={approveEnabled ? 'ดู API Key' : 'ต้องรออนุมัติก่อน'}
                    >
                      <KeyRound className="h-4 w-4" />
                      ดู API Key
                    </button>
                  </div>
                </div>

                {/* Stepper: สีตามสถานะ */}
                <div className="mt-4">
                  <Stepper status={ev.status} />
                </div>

                {/* meta */}
                <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-300 md:grid-cols-2 lg:grid-cols-3">
                  <Meta label="ระบบ/โครงการ" value={ev.project_name} />
                  <Meta label="แหล่งข้อมูล" value={ev.data_source} />
                  <Meta label="รูปแบบข้อมูล" value={ev.data_format} />
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* API Key Dialog */}
      {openKeyForId !== null && (
        <div
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 p-4"
          onKeyDown={(e) => e.key === 'Escape' && closeDialog()}
          onClick={(e) => { if (e.target === e.currentTarget) closeDialog() }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-[0_8px_60px_-12px_rgba(16,185,129,0.35)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
                  <KeyRound className="h-5 w-5 text-emerald-300" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-100">API Key</h2>
                  <p className="text-xs text-slate-400">สำหรับคำขอ #{openKeyForId}</p>
                </div>
              </div>
              <button
                className="rounded-lg bg-slate-800/70 px-2.5 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
                onClick={closeDialog}
              >
                ปิด
              </button>
            </div>

            <div className="px-5 py-4">
              {keyLoading ? (
                <div className="h-5 w-40 animate-pulse rounded bg-slate-700/40" />
              ) : (
                <>
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-700/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-200">
                    <Info className="h-4 w-4" />
                    เก็บรักษา API Key อย่างปลอดภัย หลีกเลี่ยงการแชร์สาธารณะ และควรหมุนคีย์ตามนโยบายหน่วยงาน
                  </div>

                  <div className="group relative">
                    <code className="block w-full truncate rounded-xl bg-slate-950/70 px-3 py-3 text-sm tracking-wide ring-1 ring-inset ring-slate-700">
                      {revealed ? apiKey ?? '—' : mask(apiKey ?? '')}
                    </code>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => setRevealed(v => !v)} disabled={!apiKey}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 disabled:opacity-40"
                      >
                        {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {revealed ? 'ซ่อน' : 'แสดง'}
                      </button>
                      <button
                        onClick={handleCopy} disabled={!apiKey || apiKey.startsWith('[')}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-700/40 bg-emerald-600/20 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-600/30 disabled:opacity-40"
                      >
                        {copyOk ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copyOk ? 'คัดลอกแล้ว' : 'คัดลอก'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )

  function closeDialog() {
    setOpenKeyForId(null); setApiKey(null); setRevealed(false); setCopyOk(false)
  }
}

/* ============================== Subcomponents ============================== */
function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-700/40" />
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((__, j) => (
              <div key={j} className="h-4 w-full animate-pulse rounded bg-slate-700/40" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-inset ring-slate-700">
        <Info className="h-5 w-5 text-slate-300" />
      </span>
      <div>
        <div className="text-slate-100">{title}</div>
        {subtitle ? <div className="text-sm text-slate-400">{subtitle}</div> : null}
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="truncate text-slate-200">{value || '—'}</div>
    </div>
  )
}

function ChipStat({
  title, value, tone: tn, icon: Icon,
}: {
  title: string
  value: number
  tone: 'slate'|'amber'|'emerald'|'rose'
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 ring-1 ring-white/5">
      <div className="flex items-center gap-2">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${tone.chipBg(tn)}`}>
          <Icon className="h-4 w-4 text-slate-100/90" />
        </span>
        <span className="text-sm text-slate-300">{title}</span>
      </div>
      <span className="text-base font-semibold text-slate-100">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const st = parseStatus(status)
  const cls = tone.badge(st.tone)
  const Icon = st.denied ? XCircle : st.tone === 'emerald' ? ShieldCheck : st.tone === 'amber' ? Clock : Clock
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {st.label}
    </span>
  )
}

function Stepper({ status }: { status: string }) {
  const st = parseStatus(status)
  return (
    <div className="flex items-center gap-2">
      <Dot active label="ส่งคำขอ" tone={st.tone} />
      <Line active={st.step >= 2} tone={st.tone} />
      <Dot active={st.step >= 2} label="กำลังดำเนินการ" tone={st.tone} />
      <Line active={st.step >= 3} tone={st.tone} />
      <Dot active={st.step >= 3} label={st.denied ? 'ปฏิเสธ' : 'อนุมัติ'} denied={st.denied} tone={st.tone} />
    </div>
  )
}
function Dot({ active, denied, label, tone: tn }: { active?: boolean; denied?: boolean; label: string; tone: 'slate'|'amber'|'emerald'|'rose' }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`grid h-3.5 w-3.5 place-items-center rounded-full ${tone.stepDot(active, denied, tn)}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
      </span>
      <span className={`text-xs ${tone.stepText(active, denied, tn)}`}>{label}</span>
    </div>
  )
}
function Line({ active, tone: tn }: { active?: boolean; tone: 'slate'|'amber'|'emerald'|'rose' }) {
  return <span className={`h-px w-10 ${tone.stepLine(active, tn)}`} />
}
