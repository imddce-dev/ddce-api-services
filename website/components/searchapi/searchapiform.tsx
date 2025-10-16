// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   Search,
//   Filter,
//   Calendar as CalendarIcon,
//   Download,
//   Link as LinkIcon,
//   ChevronDown,
//   ChevronUp,
//   RefreshCw,
//   Loader2,
//   Copy,
//   CheckCircle2,
//   XCircle,
//   ShieldCheck,
//   Clock,
// } from 'lucide-react';

// /* ============================== types ============================== */
// const SOURCES = ['EBS', 'DDC', 'M-EBS'] as const;
// type SourceId = (typeof SOURCES)[number];

// type Tone = 'emerald' | 'amber' | 'rose' | 'slate';

// export type SearchFilters = {
//   q: string;                // universal search (ทุกฟิลด์)
//   sources: SourceId[];
//   dateFrom?: string;        // lastUpdated ตั้งแต่
//   dateTo?: string;          // lastUpdated ถึง
//   status?: string;          // สถานะโรค/รายการ
//   diseaseGroup?: string;    // กลุ่มโรค (กรองเฉพาะ)
//   icd?: string;             // ค้นหาโค้ด ICD10/ICD11
// };

// export type DiseaseRecord = {
//   id: string;
//   source: SourceId;
//   diseaseName: string;
//   diseaseGroup: string;
//   icd10?: string;
//   icd11?: string;
//   status: string;
//   lastUpdated: string;      // ISO string
//   synonyms?: string[];
//   description?: string;
//   link?: string;
//   payload?: Record<string, unknown>;
// };

// /* ============================== helpers ============================== */
// const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');
// const toDate = (s?: string) => (s ? new Date(s) : null);

// function formatDateTime(s?: string) {
//   if (!s) return '-';
//   const d = new Date(s);
//   return d.toLocaleString('th-TH', {
//     year: 'numeric', month: '2-digit', day: '2-digit',
//     hour: '2-digit', minute: '2-digit', second: '2-digit',
//   });
// }

// function getToneByStatus(status?: string): Tone {
//   const s = (status || '').toLowerCase();
//   if (s.includes('active') || s.includes('ใช้งาน') || s.includes('เฝ้าระวังสูง')) return 'emerald';
//   if (s.includes('กำลัง') || s.includes('monitor') || s.includes('ระหว่างทบทวน')) return 'amber';
//   if (s.includes('ยกเลิก') || s.includes('ปิด') || s.includes('archived')) return 'rose';
//   return 'slate';
// }

// function StatusPill({ status }: { status?: string }) {
//   const t = getToneByStatus(status);
//   const cls =
//     t === 'emerald'
//       ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
//       : t === 'amber'
//       ? 'bg-amber-500/15 text-amber-300 ring-amber-500/30'
//       : t === 'rose'
//       ? 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
//       : 'bg-slate-600/20 text-slate-300 ring-slate-600/40';
//   const Icon = t === 'emerald' ? ShieldCheck : t === 'amber' ? Clock : t === 'rose' ? XCircle : Clock;
//   return (
//     <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', cls)}>
//       <Icon className="h-3.5 w-3.5" />
//       {status || '-'}
//     </span>
//   );
// }

// /* ============================== mock services (ต่อ API จริงภายหลัง) ============================== */
// const DISEASE_POOL = [
//   { name: 'โควิด-19', group: 'ทางเดินหายใจ', icd10: 'U07.1', icd11: 'RA01', syn: ['COVID', 'SARS-CoV-2'], desc: 'โรคติดเชื้อไวรัสโคโรนา 2019' },
//   { name: 'ไข้เลือดออก', group: 'ยุงลาย/แมลง', icd10: 'A90', icd11: '1D3Z', syn: ['Dengue'], desc: 'โรคติดเชื้อไวรัสเด็งกี' },
//   { name: 'ไข้หวัดใหญ่', group: 'ทางเดินหายใจ', icd10: 'J10', icd11: 'RA08', syn: ['Influenza', 'Flu'], desc: 'เชื้อไวรัสไข้หวัดใหญ่' },
//   { name: 'อหิวาตกโรค', group: 'ทางเดินอาหาร', icd10: 'A00', icd11: '1A1Z', syn: ['Cholera'], desc: 'ติดเชื้อ Vibrio cholerae' },
//   { name: 'มือ เท้า ปาก', group: 'โรคในเด็ก', icd10: 'B08.4', icd11: 'RA0Z', syn: ['HFMD'], desc: 'ติดเชื้อ Enterovirus ในเด็กเล็ก' },
// ];

// function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

// async function fetchEbs(filters: SearchFilters, page: number, pageSize: number) {
//   await sleep(240);
//   return makeFake('EBS', filters, page, pageSize);
// }
// async function fetchDdc(filters: SearchFilters, page: number, pageSize: number) {
//   await sleep(320);
//   return makeFake('DDC', filters, page, pageSize);
// }
// async function fetchMEbs(filters: SearchFilters, page: number, pageSize: number) {
//   await sleep(280);
//   return makeFake('M-EBS', filters, page, pageSize);
// }

// function makeFake(source: SourceId, filters: SearchFilters, page: number, pageSize: number) {
//   const base = page * 100 + source.length;
//   const statusPool = ['Active', 'กำลังเฝ้าระวัง', 'ยกเลิก/Archived'];

//   const items: DiseaseRecord[] = Array.from({ length: pageSize }).map((_, i) => {
//     const seed = DISEASE_POOL[(i + base) % DISEASE_POOL.length];
//     const id = `${source}-${base + i}`;
//     const ts = new Date(Date.now() - (page * 15 + i) * 36e5).toISOString();

//     return {
//       id,
//       source,
//       diseaseName: seed.name,
//       diseaseGroup: seed.group,
//       icd10: seed.icd10,
//       icd11: seed.icd11,
//       status: statusPool[(i + page) % statusPool.length],
//       lastUpdated: ts,
//       synonyms: seed.syn,
//       description: seed.desc,
//       link: '#',
//       payload: { example: true, note: `${source} payload for ${id}`, page, pageSize },
//     };
//   });

//   const q = (filters.q || '').toLowerCase().trim();
//   const icd = (filters.icd || '').toLowerCase().trim();
//   const grp = (filters.diseaseGroup || '').toLowerCase().trim();

//   const from = filters.dateFrom ? new Date(filters.dateFrom).getTime() : -Infinity;
//   const to = filters.dateTo ? new Date(filters.dateTo).getTime() + 86_399_000 : Infinity;

//   const filtered = items.filter((it) => {
//     const hay = [
//       it.id, it.diseaseName, it.diseaseGroup, it.icd10, it.icd11, it.status,
//       ...(it.synonyms || []), it.description || '', JSON.stringify(it.payload || {})
//     ].map(v => (v ?? '').toString().toLowerCase());

//     const passQ = !q || hay.some(h => h.includes(q));
//     const passIcd = !icd || [it.icd10, it.icd11].some(v => (v || '').toLowerCase().includes(icd));
//     const passGroup = !grp || (it.diseaseGroup || '').toLowerCase().includes(grp);
//     const passStatus = !filters.status || (it.status || '').toLowerCase().includes(filters.status.toLowerCase());

//     const t = new Date(it.lastUpdated).getTime();
//     const passDate = t >= from && t <= to;

//     return passQ && passIcd && passGroup && passStatus && passDate;
//   });

//   return { items: filtered, total: 120 };
// }

// /* ============================== Component ============================== */
// export default function ApiSearchForm() {
//   const [filters, setFilters] = useState<SearchFilters>({
//     q: '',
//     sources: ['EBS', 'DDC', 'M-EBS'],
//     diseaseGroup: '',
//     icd: '',
//     status: '',
//   });
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(20);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [items, setItems] = useState<DiseaseRecord[]>([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [expanded, setExpanded] = useState<Set<string>>(new Set());
//   const [copiedId, setCopiedId] = useState<string | null>(null);
//   const qRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const kb = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
//         e.preventDefault();
//         qRef.current?.focus();
//       }
//     };
//     window.addEventListener('keydown', kb, { passive: false });
//     return () => window.removeEventListener('keydown', kb);
//   }, []);

//   const summary = useMemo(() => {
//     const m = new Map<SourceId, number>();
//     SOURCES.forEach(s => m.set(s, 0));
//     items.forEach(it => m.set(it.source, (m.get(it.source) || 0) + 1));
//     return Object.fromEntries(m) as Record<SourceId, number>;
//   }, [items]);

//   async function runSearch(opts?: { reset?: boolean; pageOverride?: number }) {
//     setLoading(true); setError(null);
//     try {
//       const p = opts?.reset ? 1 : (opts?.pageOverride ?? page);
//       if (opts?.reset) { setItems([]); setHasMore(true); setPage(1); }

//       const calls: Array<Promise<{ items: DiseaseRecord[]; total: number }>> = [];
//       if (filters.sources.includes('EBS')) calls.push(fetchEbs(filters, p, pageSize));
//       if (filters.sources.includes('DDC')) calls.push(fetchDdc(filters, p, pageSize));
//       if (filters.sources.includes('M-EBS')) calls.push(fetchMEbs(filters, p, pageSize));

//       const results = await Promise.all(calls);
//       const merged = results.flatMap(r => r.items)
//         .sort((a, b) => (toDate(b.lastUpdated)?.getTime() || 0) - (toDate(a.lastUpdated)?.getTime() || 0));

//       setItems(prev => opts?.reset ? merged : [...prev, ...merged]);

//       const expected = pageSize * Math.max(1, filters.sources.length);
//       setHasMore(merged.length >= Math.min(expected, pageSize * 3));
//     } catch (e: any) {
//       setError(e?.message || 'ค้นหาไม่สำเร็จ');
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     runSearch({ reset: true }); // initial
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const canSearch = filters.sources.length > 0;

//   const toggleSource = (s: SourceId) => {
//     setFilters(f => {
//       const has = f.sources.includes(s);
//       return { ...f, sources: has ? f.sources.filter(x => x !== s) : [...f.sources, s] };
//     });
//   };

//   const onSubmit: React.FormEventHandler = (e) => {
//     e.preventDefault();
//     setPage(1);
//     runSearch({ reset: true, pageOverride: 1 });
//   };

//   const loadMore = async () => {
//     const next = page + 1;
//     setPage(next);
//     await runSearch({ reset: false, pageOverride: next });
//   };

//   const copyJson = async (it: DiseaseRecord) => {
//     try {
//       await navigator.clipboard.writeText(JSON.stringify(it, null, 2));
//       setCopiedId(it.id);
//       setTimeout(() => setCopiedId(null), 1200);
//     } catch { /* noop */ }
//   };

//   /* -------- Excel export (SpreadsheetML .xls) -------- */
//   const exportExcel = () => {
//     const headers = [
//       'updated_time', 'disease_name', 'disease_group', 'icd10', 'icd11',
//       'status', 'source', 'synonyms', 'description', 'link', 'record_id'
//     ] as const;

//     const rows = items.map((it) => [
//       formatDateTime(it.lastUpdated),
//       it.diseaseName ?? '',
//       it.diseaseGroup ?? '',
//       it.icd10 ?? '',
//       it.icd11 ?? '',
//       it.status ?? '',
//       it.source,
//       (it.synonyms || []).join('; '),
//       it.description ?? '',
//       it.link ?? '',
//       it.id,
//     ]);

//     const xml =
//       `<?xml version="1.0"?>` +
//       `<?mso-application progid="Excel.Sheet"?>` +
//       `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ` +
//       `xmlns:o="urn:schemas-microsoft-com:office:office" ` +
//       `xmlns:x="urn:schemas-microsoft-com:office:excel" ` +
//       `xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">` +
//       `<Worksheet ss:Name="Diseases"><Table>` +
//       `<Row>${headers.map(h => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('')}</Row>` +
//       rows.map(r => `<Row>${r.map(c => `<Cell><Data ss:Type="String">${escapeXml(c)}</Data></Cell>`).join('')}</Row>`).join('') +
//       `</Table></Worksheet></Workbook>`;

//     const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `diseases_${Date.now()}.xls`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="ps-4 pe-4 md:ps-6 md:pe-6 pt-4 pb-8">
//       {/* Toolbar */}
//       <div className="sticky top-0 z-30 mb-4 md:mb-6 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70 bg-slate-950/85 border-b border-slate-800/70">
//         <form onSubmit={onSubmit} className="grid gap-3 py-3">
//           {/* Universal search */}
//           <label className="relative block">
//             <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
//             <input
//               ref={qRef}
//               value={filters.q}
//               onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))}
//               placeholder="ค้นหาแบบ Universal: ชื่อโรค / กลุ่มโรค / ICD10/ICD11 / คำพ้อง / คำอธิบาย / source / payload (Ctrl/⌘+K)"
//               className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-8 py-2 text-sm text-slate-200 placeholder:text-slate-500 outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
//             />
//           </label>

//           {/* Sub-filters */}
//           <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
//             {/* วันที่อัปเดต */}
//             <div className="relative">
//               <CalendarIcon className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
//               <input
//                 type="date"
//                 value={filters.dateFrom || ''}
//                 onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
//                 className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-8 py-2 text-sm text-slate-200 outline-none ring-emerald-500/30 focus:ring-2 transition"
//                 placeholder="ตั้งแต่"
//               />
//             </div>
//             <div className="relative">
//               <CalendarIcon className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
//               <input
//                 type="date"
//                 value={filters.dateTo || ''}
//                 onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
//                 className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-8 py-2 text-sm text-slate-200 outline-none ring-emerald-500/30 focus:ring-2 transition"
//                 placeholder="ถึง"
//               />
//             </div>

//             {/* กลุ่มโรค / ICD / สถานะ */}
//             <input
//               value={filters.diseaseGroup || ''}
//               onChange={(e) => setFilters(f => ({ ...f, diseaseGroup: e.target.value }))}
//               placeholder="กลุ่มโรค (เช่น ทางเดินหายใจ, ยุงลาย/แมลง)"
//               className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
//             />
//             <input
//               value={filters.icd || ''}
//               onChange={(e) => setFilters(f => ({ ...f, icd: e.target.value }))}
//               placeholder="ICD10/ICD11"
//               className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
//             />
//             <select
//               value={filters.status || ''}
//               onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined }))}
//               className="rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-2 text-sm text-slate-200"
//             >
//               <option value="">สถานะ: ทั้งหมด</option>
//               <option value="Active">Active / ใช้งาน</option>
//               <option value="กำลังเฝ้าระวัง">กำลังเฝ้าระวัง / Monitoring</option>
//               <option value="ยกเลิก">ยกเลิก / Archived</option>
//             </select>

//             {/* แหล่งข้อมูล */}
//             <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-300">
//               <Filter className="h-4 w-4 text-slate-400" />
//               <span>แหล่ง:</span>
//               {SOURCES.map((s) => (
//                 <button
//                   key={s}
//                   type="button"
//                   onClick={() => toggleSource(s)}
//                   className={cn(
//                     'ml-1 rounded-md px-2 py-1 ring-1 ring-inset transition text-xs',
//                     filters.sources.includes(s)
//                       ? 'bg-emerald-700/30 text-emerald-200 ring-emerald-600/40'
//                       : 'bg-slate-800/70 text-slate-300 ring-slate-700/50'
//                   )}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Actions (ย้ายปุ่มส่งออกมาไว้ตรงนี้) */}
//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
//             <div className="flex items-center gap-2">
//               <button
//                 type="submit"
//                 disabled={loading || !canSearch}
//                 className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500 transition disabled:opacity-60"
//               >
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} ค้นหา
//               </button>

//               <button
//                 type="button"
//                 onClick={() => { setFilters({ q: '', sources: ['EBS','DDC','M-EBS'], diseaseGroup: '', icd: '', status: '', dateFrom: '', dateTo: '' }); setPage(1); runSearch({ reset: true, pageOverride: 1 }); }}
//                 className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition"
//               >
//                 <RefreshCw className="h-4 w-4" /> รีเซ็ต
//               </button>

//               <button
//                 type="button"
//                 onClick={exportExcel}
//                 disabled={items.length === 0}
//                 className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition disabled:opacity-40"
//                 title={items.length === 0 ? 'ยังไม่มีข้อมูลให้ส่งออก' : 'ส่งออกผลการค้นหาเป็น Excel'}
//               >
//                 <Download className="h-4 w-4" /> ส่งออก Excel
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Summary */}
//       <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
//         <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
//           ทั้งหมด: <span className="font-semibold text-slate-100">{items.length}</span>
//           <span className="ml-2 text-xs text-slate-400">(โหลดทีละหน้า {pageSize * Math.max(1, filters.sources.length)} รายการ)</span>
//         </div>
//         <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">EBS: <span className="font-semibold text-slate-100">{summary['EBS']}</span></div>
//         <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">DDC: <span className="font-semibold text-slate-100">{summary['DDC']}</span> · M-EBS: <span className="font-semibold text-slate-100">{summary['M-EBS']}</span></div>
//       </div>

//       {/* Results table */}
//       <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl transition-shadow duration-200">
//         <div className="overflow-x-auto">
//           <table className="min-w-[1100px] w-full border-collapse text-slate-200">
//             <thead className="sticky top-0 z-10 bg-slate-950/70 backdrop-blur">
//               <tr className="text-slate-300">
//                 <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">อัปเดต</th>
//                 <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">ชื่อโรค</th>
//                 <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">กลุ่มโรค</th>
//                 <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">ICD10</th>
//                 <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">ICD11</th>
//                 <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">สถานะ</th>
//                 <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">แหล่ง</th>
//                 <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">จัดการ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading && items.length === 0 && Array.from({ length: 6 }).map((_, i) => (
//                 <tr key={`sk-${i}`} className={i % 2 ? 'bg-slate-900/30' : 'bg-slate-900/10'}>
//                   {Array.from({ length: 8 }).map((__, j) => (
//                     <td key={j} className="px-3 py-3">
//                       <div className="h-4 w-full animate-pulse rounded bg-slate-700/40" />
//                     </td>
//                   ))}
//                 </tr>
//               ))}

//               {!loading && items.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="px-6 py-10">
//                     <div className="text-center text-slate-400">ไม่พบรายการ ลองปรับคำค้นหรือช่วงวันที่</div>
//                   </td>
//                 </tr>
//               )}

//               {items.map((it, i) => {
//                 const open = expanded.has(it.id);
//                 return (
//                   <React.Fragment key={it.id}>
//                     <tr className={cn(i % 2 ? 'bg-slate-900/30' : 'bg-slate-900/10', 'border-t border-slate-800/60 hover:bg-slate-800/40 transition-colors duration-150')}>
//                       <td className="px-3 py-3 align-top text-sm text-slate-300 whitespace-nowrap">{formatDateTime(it.lastUpdated)}</td>
//                       <td className="px-3 py-3 align-top min-w-[220px]">
//                         <div className="truncate font-medium text-slate-100">{it.diseaseName}</div>
//                         <div className="mt-0.5 truncate text-xs text-slate-400">{(it.synonyms || []).join(', ') || '-'}</div>
//                       </td>
//                       <td className="px-3 py-3 align-top text-sm">{it.diseaseGroup || '-'}</td>
//                       <td className="px-3 py-3 align-top text-sm">{it.icd10 || '-'}</td>
//                       <td className="px-3 py-3 align-top text-sm">{it.icd11 || '-'}</td>
//                       <td className="px-3 py-3 align-top"><StatusPill status={it.status} /></td>
//                       <td className="px-3 py-3 align-top text-sm">
//                         <span className="rounded-md bg-slate-800/70 px-2 py-0.5 ring-1 ring-inset ring-slate-700/60">{it.source}</span>
//                       </td>
//                       <td className="px-3 py-3 align-top text-center">
//                         <button
//                           className="rounded-lg bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors duration-200"
//                           onClick={() => setExpanded(prev => { const n = new Set(prev); n.has(it.id) ? n.delete(it.id) : n.add(it.id); return n; })}
//                         >
//                           {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />} รายละเอียด
//                         </button>
//                       </td>
//                     </tr>
//                     {open && (
//                       <tr className={i % 2 ? 'bg-slate-900/30' : 'bg-slate-900/10'}>
//                         <td colSpan={8} className="px-3 pb-4">
//                           <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
//                             <div className="mb-2 flex flex-wrap items-center gap-2">
//                               <a href={it.link || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
//                                 <LinkIcon className="h-3.5 w-3.5" /> เปิดข้อมูลต้นทาง
//                               </a>
//                               <button onClick={() => copyJson(it)} className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
//                                 {copiedId === it.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} คัดลอก JSON
//                               </button>
//                             </div>
//                             <div className="text-sm text-slate-300 mb-2">
//                               {it.description || '-'}
//                             </div>
//                             <pre className="max-h-72 overflow-auto rounded-lg bg-slate-900/60 p-3 text-xs leading-relaxed text-slate-200">
// {JSON.stringify(it, null, 2)}
//                             </pre>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Footer actions (เหลือเฉพาะโหลดเพิ่ม) */}
//       <div className="mt-4 flex items-center justify-end">
//         <button
//           onClick={loadMore}
//           disabled={!hasMore || loading || !canSearch}
//           className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition disabled:opacity-40"
//         >
//           {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} โหลดเพิ่ม
//         </button>
//       </div>

//       {error && <div className="mt-4 rounded-xl border border-rose-700/40 bg-rose-600/10 p-4 text-rose-200">{error}</div>}
//     </div>
//   );
// }

// /* ============================== utils ============================== */
// function escapeXml(v: unknown) {
//   return String(v ?? '')
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;');
// }
 