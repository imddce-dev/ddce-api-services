'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FetchAllApireq,
  appoveApi,
  updateApiReq,
  deleteApi,
  type ApiReqData,
} from '@/services/apiService';
import {
  ArrowUpDown,
  Building2,
  Check,
  Clock,
  Filter,
  Link as LinkIcon,
  Loader2,
  Mail,
  Pencil,
  Search,
  ShieldCheck,
  Trash2,
  X,
  XCircle,
  FileText,
  Globe,
  Network,
  Info,
  Copy,
  RefreshCw,
  KeySquare,
} from 'lucide-react';

/* ============================== helpers ============================== */
type Tone = 'emerald' | 'amber' | 'rose' | 'slate';
type BackendStatus = 'active' | 'pending' | 'rejected' | 'denied';

const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');
const toDate = (s?: string) => (s ? new Date(s) : null);

const formatDateTime = (s?: string) => {
  if (!s) return '-';
  const d = new Date(s);
  return d.toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const STATUS_THAI = {
  pending: 'กำลังดำเนินการ',
  active: 'อนุมัติ',
  rejected: 'ปฏิเสธ',
} as const;

type ThaiStatus = (typeof STATUS_THAI)[keyof typeof STATUS_THAI];

const STATUS_MAP: Record<BackendStatus, ThaiStatus> = {
  active: STATUS_THAI.active,
  pending: STATUS_THAI.pending,
  rejected: STATUS_THAI.rejected,
  denied: STATUS_THAI.rejected,
};

function getToneByStatus(status?: string): Tone {
  const s = (status || '').toLowerCase();
  if (s.includes('อนุมัติ') || s.includes('active') || s.includes('approve')) return 'emerald';
  if (s.includes('ปฏิเสธ') || /reject|deny|fail|denied/.test(s)) return 'rose';
  if (s.includes('กำลัง') || /pending|progress|process/.test(s)) return 'amber';
  return 'slate';
}

function StatusBadge({ status }: { status?: string }) {
  const t = getToneByStatus(status);
  const cls =
    t === 'emerald'
      ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
      : t === 'amber'
      ? 'bg-amber-500/15 text-amber-300 ring-amber-500/30'
      : t === 'rose'
      ? 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
      : 'bg-slate-600/20 text-slate-300 ring-slate-600/40';
  const Icon = t === 'emerald' ? ShieldCheck : t === 'amber' ? Clock : t === 'rose' ? XCircle : Clock;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        'transition-colors duration-200',
        cls
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status || '-'}
    </span>
  );
}

function toneStripe(t: Tone) {
  if (t === 'emerald') return 'from-emerald-400/30 via-teal-400/20 to-emerald-400/30';
  if (t === 'amber') return 'from-amber-400/30 via-yellow-400/20 to-amber-400/30';
  if (t === 'rose') return 'from-rose-500/30 via-pink-400/20 to-rose-500/30';
  return 'from-slate-500/30 via-slate-400/20 to-slate-500/30';
}

/* ============================== Main ============================== */
export default function RequestsAdmin() {
  const [rowsAll, setRowsAll] = useState<ApiReqData[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // table ui
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | ThaiStatus>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'project_name'>('created_at');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  // detail dialog
  const [detail, setDetail] = useState<ApiReqData | null>(null);

  // deleting id
  const [deleting, setDeleting] = useState<number | null>(null);

  const reload = async () => {
    try {
      setLoading(true);
      const resp = await FetchAllApireq();
      if (resp.success) {
        setRowsAll(resp.data || []);
        setErr(null);
      } else {
        setRowsAll([]);
        setErr(resp.message || 'โหลดข้อมูลไม่สำเร็จ');
      }
    } catch (e: any) {
      console.error(e);
      setRowsAll([]);
      setErr(e?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  /* ---------- derived ---------- */
  const rows = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    let r = rowsAll.filter((it) => {
      const passText =
        !keyword ||
        [
          it.project_name,
          it.requester_name,
          it.requester_email,
          it.organizer_name,
          it.description,
          it.data_source,
          String(it.id),
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(keyword));
      const passStatus = !statusFilter || it.status === statusFilter;
      return passText && passStatus;
    });

    r.sort((a, b) => {
      const d =
        sortBy === 'created_at'
          ? (toDate(a.created_at)?.getTime() || 0) - (toDate(b.created_at)?.getTime() || 0)
          : String(a.project_name || '').localeCompare(String(b.project_name || ''), 'th');
      return sortDir === 'asc' ? d : -d;
    });
    return r;
  }, [rowsAll, q, statusFilter, sortBy, sortDir]);

  /* ---------- handlers ---------- */
  const openDetail = (row: ApiReqData) => setDetail(row);

  const doChangeStatus = async (row: ApiReqData, next: BackendStatus) => {
    try {
      const thaiNext = STATUS_MAP[next];
      // optimistic
      setRowsAll((prev) => prev.map((x) => (x.id === row.id ? { ...x, status: thaiNext } : x)));
      setDetail((d) => (d && d.id === row.id ? { ...d, status: thaiNext } : d));
      await appoveApi({ eventId: row.id, status: next });
    } catch (e: any) {
      console.error('change status failed', e);
      alert(e?.message || 'เปลี่ยนสถานะไม่สำเร็จ');
      reload();
    }
  };

  const doSaveEdit = async (draft: Partial<ApiReqData>) => {
    if (!draft.id) return;
    try {
      const original = rowsAll.find((x) => x.id === draft.id);
      if (!original) throw new Error('ไม่พบรายการเดิม');

      const payload: ApiReqData = {
        ...original,
        project_name: draft.project_name ?? original.project_name,
        description: draft.description ?? original.description,
        rate_limit_per_minute:
          typeof draft.rate_limit_per_minute === 'number'
            ? draft.rate_limit_per_minute
            : original.rate_limit_per_minute,
        retention_days:
          typeof draft.retention_days === 'number' ? draft.retention_days : original.retention_days,
        allowed_ips: draft.allowed_ips ?? original.allowed_ips,
        callback_url: draft.callback_url ?? original.callback_url,
        data_source: draft.data_source ?? original.data_source,
        data_format: draft.data_format ?? original.data_format,
      };

      setRowsAll((prev) => prev.map((x) => (x.id === payload.id ? payload : x)));
      setDetail(payload);
      await updateApiReq(payload);
    } catch (e: any) {
      console.error('save edit failed', e);
      alert(e?.message || 'บันทึกไม่สำเร็จ');
      reload();
    }
  };

  const doDelete = async (id: number) => {
    if (!window.confirm(`คุณต้องการลบคำขอ #${id} ใช่หรือไม่?`)) return;
    setDeleting(id);
    try {
      setRowsAll((prev) => prev.filter((x) => x.id !== id));
      await deleteApi(id);
      if (detail?.id === id) setDetail(null);
    } catch (e: any) {
      console.error('delete failed', e);
      alert(e?.message || 'ลบไม่สำเร็จ');
      reload();
    } finally {
      setDeleting(null);
    }
  };

  /* ============================== UI ============================== */
  return (
    <div className="ps-4 pe-4 md:ps-6 md:pe-6 pt-4 pb-8">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-2 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <ArrowUpDown className="h-4 w-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created_at' | 'project_name')}
            className="rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-sm text-slate-200 transition-colors duration-200"
          >
            <option value="created_at">เรียงตามวันที่สร้าง</option>
            <option value="project_name">เรียงตามชื่อโครงการ</option>
          </select>
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}
            className="rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-sm text-slate-200 transition-colors duration-200"
          >
            <option value="desc">ใหม่ → เก่า</option>
            <option value="asc">เก่า → ใหม่</option>
          </select>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <label className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหา: ชื่อ/อีเมล/โครงการ/ID"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-8 py-2 text-sm text-slate-200 placeholder:text-slate-500 outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
            />
          </label>

          <label className="relative inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-sm text-slate-300 transition-colors duration-200">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as '' | ThaiStatus)}
              className="bg-transparent outline-none"
            >
              <option value="">สถานะ: ทั้งหมด</option>
              <option value={STATUS_THAI.pending}>{STATUS_THAI.pending}</option>
              <option value={STATUS_THAI.active}>{STATUS_THAI.active}</option>
              <option value={STATUS_THAI.rejected}>{STATUS_THAI.rejected}</option>
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl transition-shadow duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse text-slate-200">
            <thead className="sticky top-0 z-10 bg-slate-950/70 backdrop-blur">
              <tr className="text-slate-300">
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">โครงการ</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">สถานะ</th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`} className={i % 2 ? 'bg-slate-900/30' : 'bg-slate-900/10'}>
                    <td className="px-3 py-3"><div className="h-4 w-10 animate-pulse rounded bg-slate-700/40" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-56 animate-pulse rounded bg-slate-700/40" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-24 animate-pulse rounded bg-slate-700/40" /></td>
                    <td className="px-3 py-3 text-right"><div className="ml-auto h-8 w-8 animate-pulse rounded bg-slate-700/40" /></td>
                  </tr>
                ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10">
                    <div className="text-center text-slate-400">ไม่พบข้อมูลที่ตรงเงื่อนไข</div>
                  </td>
                </tr>
              )}

              {!loading &&
                rows.map((r, i) => (
                  <tr
                    key={r.id}
                    className={cn(
                      i % 2 ? 'bg-slate-900/30' : 'bg-slate-900/10',
                      'border-t border-slate-800/60 hover:bg-slate-800/40',
                      'transition-colors duration-150'
                    )}
                  >
                    <td className="px-3 py-3 align-top text-sm text-slate-300">{r.id}</td>

                    <td className="px-3 py-3 align-top">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-100">{r.project_name || '—'}</div>
                        {r.organizer_name && (
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                            <Building2 className="h-3.5 w-3.5" />
                            <span className="truncate">{r.organizer_name}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-3 align-top">
                      <StatusBadge status={r.status} />
                    </td>

                    <td className="px-3 py-3 align-top text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          className="rounded-lg bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors duration-200"
                          onClick={() => openDetail(r)}
                        >
                          ดูรายละเอียด
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dialog */}
      {detail && (
        <DetailDialog
          row={detail}
          onClose={() => setDetail(null)}
          onChangeStatus={(next) => doChangeStatus(detail, next)}
          onSave={doSaveEdit}
          onDelete={() => doDelete(detail.id)}
        />
      )}
    </div>
  );
}

/* ============================== Detail Dialog ============================== */

function DetailDialog({
  row,
  onClose,
  onChangeStatus,
  onSave,
  onDelete,
}: {
  row: ApiReqData;
  onClose: () => void;
  onChangeStatus: (next: BackendStatus) => void;
  onSave: (draft: Partial<ApiReqData>) => void;
  onDelete: () => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKeygen, setShowKeygen] = useState(false);

  // mount animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  // draft fields
  const [draft, setDraft] = useState<Partial<ApiReqData>>({
    id: row.id,
    project_name: row.project_name,
    description: row.description,
    rate_limit_per_minute: row.rate_limit_per_minute,
    retention_days: row.retention_days,
    allowed_ips: row.allowed_ips,
    callback_url: row.callback_url,
    data_source: row.data_source,
    data_format: row.data_format,
  });

  // เลือกสถานะ (ต้องกดยืนยัน)
  const [pendingStatus, setPendingStatus] = useState<BackendStatus | null>(null);

  const t = getToneByStatus(row.status);
  const stripe = toneStripe(t);

  const isDirty =
    draft.project_name !== row.project_name ||
    draft.description !== row.description ||
    draft.rate_limit_per_minute !== row.rate_limit_per_minute ||
    draft.retention_days !== row.retention_days ||
    draft.allowed_ips !== row.allowed_ips ||
    draft.callback_url !== row.callback_url ||
    draft.data_source !== row.data_source ||
    draft.data_format !== row.data_format;

  const canConfirm = editMode && (isDirty || !!pendingStatus);

  // อนุญาตสร้าง/ใช้ API Key เฉพาะสถานะอนุมัติ
  const isApproved = (pendingStatus ?? null) === 'active' || row.status === STATUS_THAI.active;

  const doConfirm = async () => {
    try {
      setSaving(true);
      if (isDirty) await onSave(draft);
      if (pendingStatus) await onChangeStatus(pendingStatus);
      setPendingStatus(null);
      setEditMode(false);
      alert('แก้ไขเรียบร้อย');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[10000] grid place-items-center bg-black/60 p-4',
        'transition-opacity duration-200',
        mounted ? 'opacity-100' : 'opacity-0'
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          'w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 shadow-2xl',
          'transition-all duration-200',
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
        )}
      >
        {/* Header */}
        <div className="relative">
          <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', stripe)} />
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <div className="flex items-center gap-3 min-w-0">
              <h2 className="text-lg font-semibold">คำขอ #{row.id}</h2>
              <StatusBadge status={pendingStatus ? STATUS_MAP[pendingStatus] : row.status} />
            </div>
            <div className="flex items-center gap-2">
              {/* ปุ่มสร้าง API Key — เฉพาะอนุมัติ */}
              <button
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors duration-200',
                  isApproved ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-800 opacity-60 cursor-not-allowed'
                )}
                onClick={() => isApproved && setShowKeygen(true)}
                title={isApproved ? 'สร้าง/ดู API Key' : 'ต้องอนุมัติก่อนจึงจะสร้าง/ใช้ API Key ได้'}
              >
                <KeySquare className="h-4 w-4" />
                สร้าง API Key
              </button>

              {!editMode ? (
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors duration-200"
                  onClick={() => setEditMode(true)}
                >
                  <Pencil className="h-4 w-4" />
                  แก้ไข
                </button>
              ) : (
                <>
                  <button
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors duration-200 disabled:opacity-60"
                    onClick={() => {
                      setEditMode(false);
                      setPendingStatus(null);
                      setDraft({
                        id: row.id,
                        project_name: row.project_name,
                        description: row.description,
                        rate_limit_per_minute: row.rate_limit_per_minute,
                        retention_days: row.retention_days,
                        allowed_ips: row.allowed_ips,
                        callback_url: row.callback_url,
                        data_source: row.data_source,
                        data_format: row.data_format,
                      });
                    }}
                    disabled={saving}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm hover:bg-emerald-500 transition-colors duration-200 disabled:opacity-60"
                    onClick={doConfirm}
                    disabled={!canConfirm || saving}
                    title={!canConfirm ? 'ยังไม่มีการเปลี่ยนแปลง หรือยังไม่ได้เลือกสถานะ' : undefined}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    ยืนยัน
                  </button>
                </>
              )}
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors duration-200"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                ปิด
              </button>
            </div>
          </div>
          <div className="h-px w-full bg-slate-800" />
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-3">
          {/* left column */}
          <section className="lg:col-span-2 space-y-4 min-w-0">
            <Card>
              <CardRow label="ระบบ/โครงการ">
                {editMode ? (
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
                    value={draft.project_name ?? ''}
                    onChange={(e) => setDraft({ ...draft, project_name: e.target.value })}
                  />
                ) : (
                  <span className="text-slate-100 break-words">{row.project_name || '—'}</span>
                )}
              </CardRow>

              <CardRow label="คำอธิบาย">
                {editMode ? (
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
                    value={draft.description ?? ''}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                ) : (
                  <div className="max-h-64 overflow-auto rounded-lg bg-slate-900/40 p-3 text-slate-200 whitespace-pre-wrap break-words">
                    {row.description || '—'}
                  </div>
                )}
              </CardRow>

              <CardRow label="แหล่งข้อมูล">
                {editMode ? (
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
                    value={draft.data_source ?? ''}
                    onChange={(e) => setDraft({ ...draft, data_source: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-200 break-words">
                    <FileText className="h-4 w-4" />
                    {row.data_source || '—'}
                  </div>
                )}
              </CardRow>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CardRow label="รูปแบบข้อมูล">
                  {editMode ? (
                    <input
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
                      value={draft.data_format ?? ''}
                      onChange={(e) => setDraft({ ...draft, data_format: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-200 break-words">
                      <FileText className="h-4 w-4" />
                      {row.data_format || '—'}
                    </div>
                  )}
                </CardRow>

                <CardRow label="Callback URL">
                  {editMode ? (
                    <input
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
                      value={draft.callback_url ?? ''}
                      onChange={(e) => setDraft({ ...draft, callback_url: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-cyan-300 break-words">
                      <Globe className="h-4 w-4" />
                      <a href={row.callback_url || '#'} target="_blank" rel="noreferrer" className="hover:underline break-words">
                        {row.callback_url || '—'}
                      </a>
                    </div>
                  )}
                </CardRow>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CardRow label="Rate limit (req/min)">
                  {editMode ? (
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
                      value={draft.rate_limit_per_minute ?? 0}
                      onChange={(e) => setDraft({ ...draft, rate_limit_per_minute: Number(e.target.value || 0) })}
                    />
                  ) : (
                    <span className="text-slate-200">{row.rate_limit_per_minute}</span>
                  )}
                </CardRow>
                <CardRow label="Retention (days)">
                  {editMode ? (
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
                      value={draft.retention_days ?? 0}
                      onChange={(e) => setDraft({ ...draft, retention_days: Number(e.target.value || 0) })}
                    />
                  ) : (
                    <span className="text-slate-200">{row.retention_days}</span>
                  )}
                </CardRow>
              </div>

              <CardRow label="Allowed IPs (คั่นด้วย ,)">
                {editMode ? (
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2 transition-all duration-200"
                    value={draft.allowed_ips ?? ''}
                    onChange={(e) => setDraft({ ...draft, allowed_ips: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-200 break-words">
                    <Network className="h-4 w-4" />
                    <span className="break-words">{row.allowed_ips || '—'}</span>
                  </div>
                )}
              </CardRow>
            </Card>

            <Card>
              <div className="mb-2 text-sm font-medium text-slate-300">ไฟล์แนบ/เอกสาร</div>
              {row.attachments?.length ? (
                <ul className="space-y-2">
                  {row.attachments.map((a) => (
                    <li key={`${row.id}-${a.path}`} className="break-words">
                      <a
                        className="group inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 break-words transition-colors duration-200"
                        href={a.path}
                        target="_blank"
                        rel="noreferrer"
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
            </Card>
          </section>

          {/* right column */}
          <section className="space-y-4 min-w-0">
            <Card>
              <div className="mb-2 text-sm font-medium text-slate-300">ผู้ยื่นคำขอ</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-200 break-words">
                  <Mail className="h-4 w-4" />
                  <a className="hover:underline break-words transition-colors duration-200" href={`mailto:${row.requester_email}`}>
                    {row.requester_name || '—'} ({row.requester_email || '—'})
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-400 break-words">
                  <Building2 className="h-4 w-4" />
                  <span className="break-words">{row.organizer_name || '—'}</span>
                </div>
                <div className="text-slate-400">สร้างเมื่อ: {formatDateTime(row.created_at)}</div>
              </div>
            </Card>

            <Card>
              <div className="mb-2 text-sm font-medium text-slate-300">เลือกสถานะ (ต้องกดยืนยัน)</div>

              {!editMode && (
                <div className="mb-2 flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs text-slate-300">
                  <Info className="mt-0.5 h-4 w-4 text-slate-400" />
                  ต้องกด <span className="mx-1 rounded bg-slate-700 px-1.5 py-0.5 text-[11px]">แก้ไข</span> ก่อน แล้วเลือกสถานะ/แก้ข้อมูล จากนั้นกด <b>ยืนยัน</b>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2">
                {(['active','pending','denied'] as BackendStatus[]).map((s) => {
                  const active = pendingStatus === s;
                  const base =
                    s === 'active' ? 'bg-emerald-600 hover:bg-emerald-500' :
                    s === 'pending' ? 'bg-amber-600 hover:bg-amber-500' :
                    'bg-rose-600 hover:bg-rose-500';
                  const Icon = s === 'active' ? ShieldCheck : s === 'pending' ? Clock : XCircle;
                  const label = STATUS_MAP[s];
                  return (
                    <button
                      key={s}
                      className={cn(
                        'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                        base,
                        !editMode && 'opacity-60 cursor-not-allowed',
                        active && 'ring-2 ring-offset-0 ring-white/40'
                      )}
                      onClick={() => editMode && setPendingStatus(s)}
                      disabled={!editMode}
                      title={!editMode ? 'กดแก้ไขก่อน' : 'เลือกไว้ ต้องกดยืนยันด้านบนเพื่อบันทึก'}
                    >
                      <Icon className="h-4 w-4" />
                      {label} {active ? '(เลือกไว้)' : ''}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-slate-400">
                สถานะปัจจุบัน: <span className="text-slate-300">{row.status || '-'}</span>
              </div>

              <div className="mt-4 h-px w-full bg-slate-800" />

              <div className="mt-4">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-600/40 bg-rose-600/10 px-3 py-2 text-sm text-rose-300 hover:bg-rose-600/20 transition-colors duration-200"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  ลบคำขอ
                </button>
              </div>
            </Card>
          </section>
        </div>
      </div>

      {/* KeyGen Dialog */}
      {showKeygen && (
        <KeyGenDialog
          allowed={isApproved}
          projectName={draft.project_name || row.project_name || `Project #${row.id}`}
          requesterName={row.requester_name}
          onClose={() => setShowKeygen(false)}
        />
      )}
    </div>
  );
}

/* ============================== KeyGen Dialog ============================== */

function KeyGenDialog({
  allowed,
  projectName,
  requesterName,
  onClose,
}: {
  allowed: boolean;
  projectName?: string;
  requesterName?: string | null;
  onClose: () => void;
}) {
  // mount animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const [apiKey, setApiKey] = useState<string>(generateKey());
  const [copied, setCopied] = useState(false);

  function generateKey() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const len = 48;
    let body = '';
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const buf = new Uint32Array(len);
      window.crypto.getRandomValues(buf);
      for (let i = 0; i < len; i++) body += alphabet[buf[i] % alphabet.length];
    } else {
      for (let i = 0; i < len; i++) body += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return `sk_${body}`;
  }

  const handleCopy = async () => {
    if (!allowed) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[11000] grid place-items-center bg-black/70 p-4',
        'transition-opacity duration-200',
        mounted ? 'opacity-100' : 'opacity-0'
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          'w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 shadow-2xl',
          'transition-all duration-200',
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
        )}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h3 className="text-lg font-semibold">สร้าง API Key</h3>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors duration-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" /> ปิด
          </button>
        </div>
        <div className="h-px w-full bg-slate-800" />

        <div className="p-5 space-y-4">
          <div className="text-sm text-slate-300">
            สร้างคีย์สำหรับ <span className="text-slate-100 font-medium">{projectName}</span>
            {requesterName ? <> — ผู้ขอ: <span className="text-slate-200">{requesterName}</span></> : null}
          </div>

          {!allowed ? (
            <div className="rounded-xl border border-rose-600/40 bg-rose-600/10 p-4 text-rose-200 text-sm">
              ต้องมีสถานะ <b>อนุมัติ</b> เท่านั้นจึงจะสร้าง/ใช้ API Key ได้
            </div>
          ) : null}

          <div className={cn('rounded-xl border border-slate-700 bg-slate-900/60 p-4', !allowed && 'opacity-60')}>
            <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">API Key</div>
            <div className="flex gap-2 items-center">
              <input
                readOnly
                value={apiKey}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 transition-colors duration-200"
              />
              <button
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                  allowed ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-800 cursor-not-allowed'
                )}
                onClick={handleCopy}
                title={allowed ? 'คัดลอก' : 'ต้องอนุมัติก่อน'}
                disabled={!allowed}
              >
                <Copy className="h-4 w-4" />
                {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
              </button>
              <button
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                  allowed ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-slate-700 cursor-not-allowed'
                )}
                onClick={() => allowed && setApiKey(generateKey())}
                title={allowed ? 'สุ่มใหม่' : 'ต้องอนุมัติก่อน'}
                disabled={!allowed}
              >
                <RefreshCw className="h-4 w-4" />
                สุ่มใหม่
              </button>
            </div>

            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              โปรดคัดลอกและเก็บ API Key นี้ไว้ให้ปลอดภัย — <b>จะแสดงให้เห็นเพียงครั้งเดียว</b>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 transition-colors duration-200"
              onClick={onClose}
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== Tiny UI Components ============================== */

function MenuBtn({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors duration-200',
        className,
        disabled && 'opacity-60'
      )}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 min-w-0 transition-colors duration-200">
      {children}
    </div>
  );
}

function CardRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 min-w-0">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 min-w-0 break-words">{children}</div>
    </div>
  );
}
