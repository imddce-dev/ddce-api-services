'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { FetchApiReqById, type ApiReqData ,generateOtp, type otpVertifyStruct, verifyOtp, getTempAuthToken , type tempAuthStruct, RemoveTempAuthToken} from '@/services/apiService'
import { useUserStore } from '@/stores/useUserStore'
import {
  KeyRound, Copy, Check, Eye, EyeOff, ShieldCheck, Clock, XCircle,
  Sparkles, Info, Mail, User as UserIcon, Send, Link as LinkIcon, Globe, Network,
  ChevronDown, ChevronUp, FileText
} from 'lucide-react'
import { set } from 'react-hook-form'
import { get } from 'http'

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
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpref, setOtpref] = useState<string>("ABC123");
  const [timeLeft, setTimeLeft] = useState(300);
  const [apiUrl, setApiUrl] = useState<string>('-');
  const [clientId, setClientId] = useState<string>('-');
  const [secretKey, setsecretKey] = useState<string>('-');
  const [showSecret, setShowSecret] = useState(false);
  const [errorOtp, setErrorOtp] = useState<string | null>(null)

  // ดู/คัดลอก API Key
  const [openKeyForId, setOpenKeyForId] = useState<number | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [copyOk, setCopyOk] = useState(false)
  const [keyLoading, setKeyLoading] = useState(false)

  // กางรายละเอียดในการ์ด
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

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

  useEffect(()=> {
    if (timeLeft <= 0) return; 
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  },[timeLeft])

  useEffect(() => {
  if (apiKey !== null) {
    setTimeLeft(180);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          closeDialogApikey();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }
}, [apiKey]);



  const countdownText = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
    timeLeft % 60
  ).padStart(2, "0")}`;

 
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const val = e.target.value.replace(/\D/g, ""); 
  const newOtp = [...otp];
  newOtp[index] = val;
  setOtp(newOtp);
  if (val && e.target.nextElementSibling) {
    (e.target.nextElementSibling as HTMLInputElement).focus();
  }
  };

  const handleSubmitOtp = async () => {
    const code = otp.join("");
    const eventId = openKeyForId
    const ref = otpref
    if(code.length !== 6 || !eventId || !ref) return;
    try{
        const payload = { code , ref, eventId}
        const resp = await verifyOtp(payload as any)
        if(resp?.success){
          closeDialog()
          await new Promise(res => setTimeout(res, 500));
          setApiKey("Successfully fetched API Key!")
          const resToken = await getTempAuthToken()
          if(resToken?.success){
            setApiKey("Successfully fetched API Key!")
             setApiUrl(resToken.data.url)
             setClientId(resToken.data.clientId)
             setsecretKey(resToken.data.secretKey)
          }else{
            alert("ไม่สามารถขอ Token ชั่วคราวได้")
          }
        }else{
          setErrorOtp(resp?.message || "ไม่สามารถยืนยันรหัส OTP ได้")
        }
    }catch (error : any){
      setErrorOtp(error.response?.data?.message || "ไม่สามารถยืนยันรหัส OTP ได้")
    }
  };
  const resetOtpForm = () => {
  setOtp(Array(6).fill(""));  // เคลียร์ช่องกรอก
  setTimeLeft(300);           // รีเซ็ตตัวนับเวลา
  setOtpref(""); 
  setErrorOtp(null);      // รีเซ็ต Ref (ในที่นี้ตั้งค่าเป็นคงที่)
};
 const hasItems = items.length > 0

 const closeDialogApikey = async () => {
  try {
    await RemoveTempAuthToken();
    await new Promise(res => setTimeout(res, 300)); 
  } catch (err) {
    console.error("Failed to remove temp token:", err);
  } finally {
    setApiKey(null);
    setRevealed(false);
    setCopyOk(false);
    setApiUrl("")
    setClientId("")
    setsecretKey("")
  }
};
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
    resetOtpForm();
    if (!(st.step === 3 && !st.denied)) return
    if (openKeyForId === req.id) { closeDialog(); return } // คลิกซ้ำปิด
    setOpenKeyForId(req.id); 
    try {
      await new Promise(res => setTimeout(res, 500));
      const res = await generateOtp(req.id);
      if(res?.success){
        setErrorOtp(null); 
        setOtpref(res.data.ref);
        setTimeLeft(300); 
        setOtp(Array(6).fill(""));
      }else{
        throw new Error(res?.message || "ไม่สามารถสร้างรหัส OTP ได้");
      }
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

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
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
        <EmptyState title={error} subtitle="ยังไม่มีคำขอของคุณในระบบ" />
      )}

      {!loading && !error && !hasItems && (
        <EmptyState title="ไม่พบข้อมูล" subtitle="ยังไม่มีคำขอของคุณในระบบ" />
      )}

      {!loading && !error && hasItems && (
        <div className="space-y-4">
          {items.map((ev) => {
            const st = parseStatus(ev.status)
            const approveEnabled = st.step === 3 && !st.denied
            const isOpen = expanded.has(ev.id)
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

                    {/* ปุ่มดู API Key (เฉพาะอนุมัติ) */}
                    <button
                      onClick={() => handleOpenKey(ev)}
                      disabled={!approveEnabled}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 ring-1 ring-inset ring-emerald-500/30 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                      title={approveEnabled ? 'ดู API Key' : 'ต้องรออนุมัติก่อน'}
                    >
                      <KeyRound className="h-4 w-4" />
                      ดู API Key
                    </button>

                    {/* ปุ่มกางรายละเอียดข้อมูลที่กรอก */}
                    <button
                      onClick={() => toggleExpand(ev.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
                      title={isOpen ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดคำขอ'}
                    >
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {isOpen ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
                    </button>
                  </div>
                </div>

                {/* Stepper */}
                <div className="mt-4">
                  <Stepper status={ev.status} />
                </div>

                {/* รายละเอียดที่กรอก: กาง/พับได้ */}
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden ${isOpen ? 'max-h-[1000px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
                  aria-hidden={!isOpen}
                >
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4">
                    <div className="mb-2 text-sm font-medium text-slate-300">รายละเอียดคำขอ</div>

                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-300 md:grid-cols-2 lg:grid-cols-3">
                      <Meta label="ระบบ/โครงการ" value={ev.project_name} />
                      <Meta label="แหล่งข้อมูล" value={ev.data_source} />
                      <Meta label="รูปแบบข้อมูล" value={ev.data_format} />
                      <Meta label="Rate limit (req/min)" value={String(ev.rate_limit_per_minute ?? '—')} />
                      <Meta label="Retention (days)" value={String(ev.retention_days ?? '—')} />
                      <Meta label="Allowed IPs" value={ev.allowed_ips} />
                      <MetaLink label="Callback URL" value={ev.callback_url} />
                    </div>

                    <div className="mt-3">
                      <div className="text-[11px] uppercase tracking-wide text-slate-500">คำอธิบาย</div>
                      <div className="mt-1 max-h-52 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900/60 p-3 text-sm text-slate-200">
                        {ev.description || '—'}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-[11px] uppercase tracking-wide text-slate-500">ไฟล์แนบ/เอกสาร</div>
                      {ev.attachments?.length ? (
                        <ul className="mt-1 space-y-2 text-sm">
                          {ev.attachments.map((a) => (
                            <li key={`${ev.id}-${a.path}`} className="break-words">
                              <a
                                href={a.path}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition"
                              >
                                <LinkIcon className="h-4 w-4" />
                                <span className="truncate">{a.name || a.path}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-slate-400">— ไม่มีไฟล์แนบ —</div>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">ผู้ยื่นคำขอ</div>
                        <div className="mt-1 flex items-center gap-2 text-slate-200">
                          <Mail className="h-4 w-4" />
                          <a className="hover:underline" href={`mailto:${ev.requester_email}`}>
                            {ev.requester_name || '—'} ({ev.requester_email || '—'})
                          </a>
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">หน่วยงาน/องค์กร</div>
                        <div className="mt-1 flex items-center gap-2 text-slate-200">
                          <FileText className="h-4 w-4" />
                          <span>{ev.organizer_name || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* API KEY Dialog */}
      {openKeyForId !== null && (
        <div
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 p-4"
          onKeyDown={(e) => e.key === "Escape" && closeDialog()} // ปิดด้วย ESC ได้
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-[0_8px_60px_-12px_rgba(16,185,129,0.35)] backdrop-blur transition-all duration-200"
            onClick={(e) => e.stopPropagation()} // ป้องกันไม่ให้คลิกพื้นหลังแล้วปิด
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
              <div>
                <h2 className="text-base font-semibold text-slate-100">OTP Verification</h2>
              </div>
              <button
                className="rounded-lg bg-slate-800/70 px-2.5 py-1.5 text-sm text-slate-300 hover:bg-slate-700 transition"
                onClick={closeDialog}
              >
                ปิด
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <img src="/otp.png" alt="otp" width={120} height={120}/>
                <p className='font-medium text-xl'>Verification Code</p>
                <p className="text-sm text-slate-300 text-center">กรุณากรอกรหัสผ่าน 6 หลักที่ได้รับทางอีเมล เพื่อยืนยันสิทธิ์การเข้าดู API Key ของท่าน</p>
              </div>
              <div className="flex gap-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    className="h-11 w-11 text-center text-lg font-semibold text-slate-100 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:outline-none"
                    value={otp[i] ?? ""}
                    onChange={(e) => handleOtpChange(e, i)}
                  />
                ))}
              </div>
              <div className='text-sm text-slate-400 flex justify-between w-full px-5'>
                <p>Ref: <span className="text-slate-400">{otpref ?? "—"}</span></p>
                <p>เวลา{" "}
                  <span className={timeLeft <= 60 ? "text-red-400 font-semibold" : "text-slate-300"}>
                    {countdownText}
                  </span>
                </p>
              </div>
              {errorOtp && <p className="text-sm text-red-400 transition-opacity duration-200 ease-in-out">{errorOtp}</p>}
               <button
                onClick={handleSubmitOtp}
                disabled={otp.join("").length !== 6 || timeLeft <= 0}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white font-medium hover:bg-emerald-500 transition disabled:opacity-40"
              >
                ยืนยันรหัส OTP
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End API KEY Dialog */}

      {/*View API KEY Dialog */}
      {apiKey !== null && (
        <div
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 p-4"
          onKeyDown={(e) => e.key === "Escape" && closeDialogApikey()}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-900/95 shadow-[0_8px_60px_-12px_rgba(16,185,129,0.35)] backdrop-blur-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
              <h2 className="text-base font-semibold text-emerald-300">API Credentials</h2>
              <button
                onClick={closeDialogApikey}
                className="rounded-lg bg-slate-800/70 px-2.5 py-1.5 text-sm text-slate-300 hover:bg-slate-700 transition"
              >
                ปิด
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className='flex justify-center'>
                <img src="/api.png" alt="api_logo" width={120} height={120} />
              </div>

              {/* API URL */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-1">API URL</label>
                <div className="flex items-center bg-slate-800/60 border border-slate-600 rounded-lg px-3 py-2">
                  <div className="flex-1 text-slate-200 break-all">{apiUrl}</div>
                  <button onClick={() => navigator.clipboard.writeText(apiUrl)} className="ml-2 text-emerald-400 hover:text-emerald-200 transition">
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              {/* Client ID */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-1">Client KEY</label>
                <div className="flex items-center bg-slate-800/60 border border-slate-600 rounded-lg px-3 py-2">
                  <div className="flex-1 text-slate-200 break-all">{clientId}</div>
                  <button onClick={() => navigator.clipboard.writeText(clientId)} className="ml-2 text-emerald-400 hover:text-emerald-200 transition">
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              {/* Secret Key */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-1">Secret Key</label>
                <div className="flex items-center bg-slate-800/60 border border-slate-600 rounded-lg px-3 py-2">
                  <div className="flex-1 text-slate-200 break-all">
                    {showSecret ? secretKey : '•'.repeat(secretKey.length)}
                  </div>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="ml-2 text-emerald-400 hover:text-emerald-200 transition"
                  >
                    {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(secretKey)} className="ml-2 text-emerald-400 hover:text-emerald-200 transition">
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <div className={`text-center text-xs  ${timeLeft < 30 ? " text-red-400" : " text-emerald-400"}`}>
                หน้าต่างนี้จะปิดอัตโนมัติใน {countdownText}
              </div>
            </div>
          </div>
        </div>
      )}


    </main>
  )

  function closeDialog() {
    setOpenKeyForId(null); setRevealed(false); setCopyOk(false)
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

function MetaLink({ label, value }: { label: string; value?: string }) {
  if (!value) return <Meta label={label} value="—" />
  return (
    <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="truncate">
        <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200">
          <Globe className="h-4 w-4" />
          <span className="truncate">{value}</span>
        </a>
      </div>
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
