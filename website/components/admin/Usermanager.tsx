// components/UserManager.tsx
"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Search,
  RefreshCcw,
  Trash2,
  ChevronDown,
  Mail,
  Phone,
  Download,
  UserPlus,
  MoreVertical,
  Pencil,
  Building2,
} from "lucide-react";

/* =============================================================================
   TYPES
============================================================================= */
export type Role = "manager" | "editor" | "viewer"; // ❗ ไม่มี admin
export type Status = "active" | "suspended";

export type UserRow = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  organization?: string;
  role: Role;
  status: Status;
  createdAt: string; // ISO
};

const ROLES: Role[] = ["manager", "editor", "viewer"];
const STATUSES: Status[] = ["active", "suspended"];
const ORGS = [
  "สสจ.นนทบุรี",
  "กองควบคุมโรค",
  "รพ.ตัวอย่าง",
  "กรมดิจิทัลเพื่อเศรษฐกิจและสังคม",
  "สปสช.",
  "ศบค.",
];

/* =============================================================================
   STATE TYPES
============================================================================= */
export type SortKey =
  | "name"
  | "email"
  | "organization"
  | "role"
  | "status"
  | "createdAt";

export type FetchState = {
  items: UserRow[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  role: Role | "all";
  status: Status | "all";
  sortBy: SortKey;
  sortDir: "asc" | "desc";
};

/* =============================================================================
   MOCK API (แทนที่ด้วย service จริงของคุณได้)
============================================================================= */
export async function apiListUsers(params: {
  page: number;
  pageSize: number;
  q?: string;
  role?: Role;
  status?: Status;
  sortBy?: SortKey;
  sortDir?: "asc" | "desc";
}): Promise<{ items: UserRow[]; total: number }> {
  await new Promise((r) => setTimeout(r, 250));
  const seeds: UserRow[] = Array.from({ length: 60 }).map((_, i) => ({
    id: i + 1,
    name: `ผู้ใช้หมายเลข ${i + 1}`,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `08${(Math.random() * 1_0000_0000).toFixed(0).padStart(8, "0")}`.slice(0, 10),
    organization: ORGS[i % ORGS.length],
    role: ROLES[i % ROLES.length],
    status: i % 7 === 0 ? "suspended" : "active",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));

  let arr = seeds;
  if (params.q) {
    const q = params.q.toLowerCase();
    arr = arr.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.organization || "").toLowerCase().includes(q)
    );
  }
  if (params.role) arr = arr.filter((u) => u.role === params.role);
  if (params.status) arr = arr.filter((u) => u.status === params.status);

  const { sortBy = "createdAt", sortDir = "desc" } = params;
  arr.sort((a: any, b: any) => {
    const A = a[sortBy];
    const B = b[sortBy];
    if (A === B) return 0;
    if (sortDir === "asc") return A > B ? 1 : -1;
    return A < B ? 1 : -1;
  });

  const total = arr.length;
  const start = (params.page - 1) * params.pageSize;
  const items = arr.slice(start, start + params.pageSize);
  return { items, total };
}

export async function apiCreateUser(payload: Omit<UserRow, "id" | "createdAt">) {
  await new Promise((r) => setTimeout(r, 250));
  const id = Math.floor(Math.random() * 10_000) + 1000;
  return {
    success: true,
    user: {
      id,
      createdAt: new Date().toISOString(),
      ...payload,
    } as UserRow,
  };
}
export async function apiUpdateUser(id: number, patch: Partial<UserRow>) {
  await new Promise((r) => setTimeout(r, 250));
  return { success: true, patch, id };
}
export async function apiDeleteUsers(_ids: number[]) {
  await new Promise((r) => setTimeout(r, 250));
  return { success: true };
}

/* =============================================================================
   UTILS
============================================================================= */
function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
export function exportCSV(rows: UserRow[]) {
  if (!rows.length) return;
  const header = [
    "id",
    "name",
    "username",
    "email",
    "phone",
    "organization",
    "role",
    "status",
    "createdAt",
  ];
  const csv = [header.join(",")]
    .concat(
      rows
        .map((r) =>
          [
            r.id,
            r.name,
            r.username,
            r.email,
            r.phone || "",
            r.organization || "",
            r.role,
            r.status,
            r.createdAt,
          ]
            .map((x) => `"${String(x).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n")
    )
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function RolePill({ role }: { role: Role }) {
  const m: Record<Role, string> = {
    manager:
      "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30",
    editor:
      "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30",
    viewer:
      "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs", m[role])}>
      {role}
    </span>
  );
}

function StatusPill({ s }: { s: Status }) {
  const m = {
    active: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30",
    suspended: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30",
  } as const;
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
        m[s]
      )}
    >
      {s}
    </span>
  );
}

/* =============================================================================
   FORM DIALOG (เพิ่ม/แก้ไข ผู้ใช้) — หน่วยงาน/บทบาท เป็น dropdown
============================================================================= */
type UserFormState = {
  open: boolean;
  mode: "create" | "edit";
  draft: Partial<UserRow>;
};

function UserFormDialog({
  state,
  onClose,
  onSubmit,
}: {
  state: UserFormState;
  onClose: () => void;
  onSubmit: (draft: Partial<UserRow>) => Promise<void>;
}) {
  const d = state.draft;
  const [local, setLocal] = React.useState<Partial<UserRow>>(d);
  React.useEffect(() => setLocal(d), [d]);

  const disabled =
    !local.name ||
    !local.username ||
    !local.email ||
    !local.role ||
    !local.organization;

  return (
    <Transition appear show={state.open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-100 shadow-xl">
                <Dialog.Title className="text-lg font-semibold">
                  {state.mode === "create" ? "เพิ่มผู้ใช้ใหม่" : "แก้ไขผู้ใช้"}
                </Dialog.Title>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="text-xs text-slate-300">
                    ชื่อ-สกุล <span className="text-rose-400">*</span>
                    <input
                      className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 text-sm outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20"
                      value={local.name ?? ""}
                      onChange={(e) =>
                        setLocal((s) => ({ ...s, name: e.target.value }))
                      }
                      placeholder="เช่น สมชาย ใจดี"
                    />
                  </label>
                  <label className="text-xs text-slate-300">
                    Username <span className="text-rose-400">*</span>
                    <input
                      className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 text-sm outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20"
                      value={local.username ?? ""}
                      onChange={(e) =>
                        setLocal((s) => ({ ...s, username: e.target.value }))
                      }
                      placeholder="เช่น somchai01"
                    />
                  </label>
                  <label className="text-xs text-slate-300">
                    อีเมล <span className="text-rose-400">*</span>
                    <input
                      type="email"
                      className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 text-sm outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20"
                      value={local.email ?? ""}
                      onChange={(e) =>
                        setLocal((s) => ({ ...s, email: e.target.value }))
                      }
                      placeholder="name@example.com"
                    />
                  </label>
                  <label className="text-xs text-slate-300">
                    เบอร์โทร
                    <input
                      className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 text-sm outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20"
                      value={local.phone ?? ""}
                      onChange={(e) =>
                        setLocal((s) => ({ ...s, phone: e.target.value }))
                      }
                      placeholder="0812345678"
                    />
                  </label>

                  <label className="text-xs text-slate-300 sm:col-span-2">
                    หน่วยงาน <span className="text-rose-400">*</span>
                    <select
                      className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 text-sm outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20"
                      value={local.organization ?? ""}
                      onChange={(e) =>
                        setLocal((s) => ({
                          ...s,
                          organization: e.target.value,
                        }))
                      }
                    >
                      <option value="" disabled>
                        — เลือกหน่วยงาน —
                      </option>
                      {ORGS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs text-slate-300">
                    บทบาท <span className="text-rose-400">*</span>
                    <select
                      className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 text-sm outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20"
                      value={(local.role as Role) ?? "viewer"}
                      onChange={(e) =>
                        setLocal((s) => ({ ...s, role: e.target.value as Role }))
                      }
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs text-slate-300">
                    สถานะ
                    <select
                      className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 text-sm outline-none"
                      value={(local.status as Status) ?? "active"}
                      onChange={(e) =>
                        setLocal((s) => ({
                          ...s,
                          status: e.target.value as Status,
                        }))
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                  >
                    ยกเลิก
                  </button>
                  <button
                    disabled={disabled}
                    onClick={() => onSubmit(local)}
                    className={clsx(
                      "rounded-xl px-4 py-2 text-sm text-white",
                      disabled
                        ? "bg-emerald-600/50"
                        : "bg-emerald-600 hover:bg-emerald-500"
                    )}
                  >
                    บันทึก
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* =============================================================================
   TABLE PARTS
============================================================================= */
function TableHeader({
  state,
  setState,
}: {
  state: FetchState;
  setState: React.Dispatch<React.SetStateAction<FetchState>>;
}) {
  const th = (key: SortKey, label: string) => (
    <th
      key={key}
      onClick={() =>
        setState((s) => ({
          ...s,
          sortBy: key,
          sortDir:
            s.sortBy === key ? (s.sortDir === "asc" ? "desc" : "asc") : "asc",
        }))
      }
      className="cursor-pointer px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:text-white"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {state.sortBy === key ? (
          <ChevronDown
            className={clsx(
              "h-3.5 w-3.5 transition",
              state.sortDir === "asc" ? "rotate-180" : "rotate-0"
            )}
          />
        ) : null}
      </span>
    </th>
  );

  return (
    <thead className="sticky top-0 z-[1] bg-slate-800/80 backdrop-blur">
      <tr>
        <th className="w-10 px-3 py-2" />
        {th("name", "ชื่อ-สกุล / หน่วยงาน")}
        {th("email", "ติดต่อ")}
        {th("role", "บทบาท")}
        {th("status", "สถานะ")}
        {th("createdAt", "สร้างเมื่อ")}
        <th className="px-3 py-2 text-right text-xs font-semibold text-slate-300">
          การดำเนินการ
        </th>
      </tr>
    </thead>
  );
}

function RowMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 hover:bg-white/5"
        aria-label="more"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-800/95 p-1 text-sm shadow-xl">
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4" /> แก้ไขข้อมูล
          </button>
          <div className="mx-2 my-1 border-t border-white/10" />
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-400 hover:bg-rose-500/10"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" /> ลบผู้ใช้
          </button>
        </div>
      )}
    </div>
  );
}

function UserRowItem({
  u,
  selected,
  onToggle,
  onEdit,
  onDelete,
}: {
  u: UserRow;
  selected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="hover:bg-white/5">
      <td className="px-3 py-2 align-top">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-white/20 bg-slate-900/70"
          checked={selected}
          onChange={onToggle}
        />
      </td>
      <td className="px-3 py-2">
        <div className="font-medium text-white">{u.name}</div>
        <div className="mt-0.5 inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-0.5 text-[11px] text-slate-200 ring-1 ring-white/10">
          <Building2 className="h-3 w-3" /> {u.organization || "-"}
        </div>
        <div className="mt-1 text-xs text-slate-400">@{u.username}</div>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2 text-slate-200">
          <Mail className="h-3.5 w-3.5" /> {u.email}
        </div>
        {u.phone && (
          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
            <Phone className="h-3.5 w-3.5" /> {u.phone}
          </div>
        )}
      </td>
      <td className="px-3 py-2">
        <RolePill role={u.role} />
      </td>
      <td className="px-3 py-2">
        <StatusPill s={u.status} />
      </td>
      <td className="px-3 py-2 text-slate-300">{formatDate(u.createdAt)}</td>
      <td className="px-3 py-2 text-right">
        <RowMenu onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

/* =============================================================================
   TOOLBAR (Bulk ลบ + เพิ่มผู้ใช้)
============================================================================= */
function BulkDelete({
  selected,
  onBulkDelete,
}: {
  selected: number[];
  onBulkDelete: () => void;
}) {
  const disabled = selected.length === 0;
  return (
    <button
      disabled={disabled}
      onClick={onBulkDelete}
      className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600/90 px-3 text-sm font-medium text-white shadow hover:bg-rose-600 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" /> ลบที่เลือก
    </button>
  );
}

function Toolbar({
  state,
  setState,
  selected,
  loading,
  onRefresh,
  onCreate,
  onBulkDelete,
}: {
  state: FetchState;
  setState: React.Dispatch<React.SetStateAction<FetchState>>;
  selected: number[];
  loading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
  onBulkDelete: () => void;
}) {
  const [q, setQ] = React.useState(state.query);

  React.useEffect(() => {
    const t = setTimeout(
      () => setState((s) => ({ ...s, page: 1, query: q })),
      300
    );
    return () => clearTimeout(t);
  }, [q, setState]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อ, อีเมล, หน่วยงาน, username"
            className="h-10 w-full rounded-xl border border-white/10 bg-slate-900/70 pl-9 pr-3 text-sm text-slate-100 outline-none ring-emerald-400/30 transition focus:border-emerald-400/40 focus:ring-4"
          />
        </div>

        <button
          onClick={onRefresh}
          className={clsx(
            "inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100",
            loading && "opacity-70"
          )}
        >
          <RefreshCcw className={clsx("h-4 w-4", loading && "animate-spin")} />{" "}
          รีเฟรช
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={state.role}
          onChange={(e) =>
            setState((s) => ({ ...s, page: 1, role: e.target.value as any }))
          }
          className="h-10 rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100"
        >
          <option value="all">บทบาททั้งหมด</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={state.status}
          onChange={(e) =>
            setState((s) => ({ ...s, page: 1, status: e.target.value as any }))
          }
          className="h-10 rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100"
        >
          <option value="all">สถานะทั้งหมด</option>
          {STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
        <select
          value={state.pageSize}
          onChange={(e) =>
            setState((s) => ({
              ...s,
              pageSize: parseInt(e.target.value, 10),
              page: 1,
            }))
          }
          className="h-10 rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}/หน้า
            </option>
          ))}
        </select>

        <div className="hidden sm:block">
          <BulkDelete selected={selected} onBulkDelete={onBulkDelete} />
        </div>

        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-emerald-500"
        >
          <UserPlus className="h-4 w-4" /> เพิ่มผู้ใช้
        </button>
      </div>

      <div className="sm:hidden">
        <BulkDelete selected={selected} onBulkDelete={onBulkDelete} />
      </div>
    </div>
  );
}

/* =============================================================================
   PAGE
============================================================================= */
export default function UserManager() {
  const [state, setState] = React.useState<FetchState>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    query: "",
    role: "all",
    status: "all",
    sortBy: "createdAt",
    sortDir: "desc",
  });
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [refreshTick, setRefreshTick] = React.useState(0);

  const [form, setForm] = React.useState<UserFormState>({
    open: false,
    mode: "create",
    draft: { role: "viewer", status: "active" },
  });

  const [confirm, setConfirm] = React.useState<{
    open: boolean;
    ids: number[];
  }>({
    open: false,
    ids: [],
  });

  // โหลดข้อมูล
  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const { items, total } = await apiListUsers({
          page: state.page,
          pageSize: state.pageSize,
          q: state.query || undefined,
          role:
            state.role === "all" ? undefined : (state.role as Role),
          status:
            state.status === "all" ? undefined : (state.status as Status),
          sortBy: state.sortBy,
          sortDir: state.sortDir,
        });
        if (!cancelled) setState((s) => ({ ...s, items, total }));
      } catch (err) {
        if (!cancelled) console.error("load users failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [
    state.page,
    state.pageSize,
    state.query,
    state.role,
    state.status,
    state.sortBy,
    state.sortDir,
    refreshTick,
  ]);

  // helpers
  function toggleAll(v: boolean) {
    setSelected(v ? state.items.map((u) => u.id) : []);
  }
  function toggleOne(id: number) {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((x) => x !== id) : sel.concat(id)
    );
  }

  // delete
  function openDelete(ids?: number[]) {
    const target = ids ?? selected;
    if (!target.length) return;
    setConfirm({ open: true, ids: target });
  }
  async function doDelete() {
    const ids = confirm.ids;
    if (!ids.length) return setConfirm((c) => ({ ...c, open: false }));
    await apiDeleteUsers(ids);
    setState((s) => ({
      ...s,
      items: s.items.filter((u) => !ids.includes(u.id)),
      total: s.total - ids.length,
    }));
    setSelected((x) => x.filter((id) => !ids.includes(id)));
    setConfirm((c) => ({ ...c, open: false }));
  }

  // submit เพิ่ม/แก้ไข
  async function submitForm(draft: Partial<UserRow>) {
    if (form.mode === "create") {
      const res = await apiCreateUser({
        name: draft.name!,
        username: draft.username!,
        email: draft.email!,
        phone: draft.phone,
        organization: draft.organization!,
        role: (draft.role as Role) ?? "viewer",
        status: (draft.status as Status) ?? "active",
        createdAt: new Date().toISOString(),
      } as UserRow);
      if (res.success) {
        setState((s) => ({
          ...s,
          items: [res.user, ...s.items],
          total: s.total + 1,
        }));
      }
    } else if (form.mode === "edit" && draft.id) {
      await apiUpdateUser(draft.id, draft);
      setState((s) => ({
        ...s,
        items: s.items.map((u) =>
          u.id === draft.id ? ({ ...u, ...draft } as UserRow) : u
        ),
      }));
    }
    setForm((f) => ({ ...f, open: false }));
  }

  return (
    <main className="relative w-full">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(16,185,129,0.10),transparent),radial-gradient(60%_50%_at_100%_0%,rgba(34,211,238,0.07),transparent)]" />

      <header className="mb-4 flex items-center justify-between">
       
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 hover:bg-white/5"
            onClick={() => exportCSV(state.items)}
          >
            <Download className="h-4 w-4" /> ส่งออก CSV
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 shadow-xl backdrop-blur">
        <Toolbar
          state={state}
          setState={setState}
          selected={selected}
          loading={loading}
          onRefresh={() => setRefreshTick((t) => t + 1)}
          onCreate={() =>
            setForm({
              open: true,
              mode: "create",
              draft: { role: "viewer", status: "active" },
            })
          }
          onBulkDelete={() => openDelete()}
        />

        <div className="mt-3 overflow-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <TableHeader state={state} setState={setState} />
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: state.pageSize }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-2">
                      <div className="h-4 w-4 rounded bg-white/20" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-4 w-64 rounded bg-white/20" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-4 w-56 rounded bg-white/20" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-4 w-20 rounded bg-white/20" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-4 w-24 rounded bg-white/20" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="h-4 w-28 rounded bg-white/20" />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="ml-auto h-8 w-8 rounded bg-white/20" />
                    </td>
                  </tr>
                ))
              ) : state.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-slate-400"
                  >
                    ไม่พบข้อมูลผู้ใช้
                  </td>
                </tr>
              ) : (
                state.items.map((u) => (
                  <UserRowItem
                    key={u.id}
                    u={u}
                    selected={selected.includes(u.id)}
                    onToggle={() => toggleOne(u.id)}
                    onEdit={() =>
                      setForm({ open: true, mode: "edit", draft: u })
                    }
                    onDelete={() => openDelete([u.id])}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-slate-900/70"
              checked={
                selected.length === state.items.length &&
                state.items.length > 0
              }
              onChange={(e) => toggleAll(e.target.checked)}
            />
            <span>เลือกทั้งหมด (เลือกอยู่ {selected.length} รายการ)</span>
          </label>

          <div className="flex items-center gap-2 text-sm text-slate-300">
            <button
              disabled={state.page <= 1}
              onClick={() =>
                setState((s) => ({ ...s, page: Math.max(1, s.page - 1) }))
              }
              className="rounded-xl border border-white/10 px-3 py-1.5 disabled:opacity-50"
            >
              ก่อนหน้า
            </button>
            <span>
              หน้า {state.page} /{" "}
              {Math.max(1, Math.ceil(state.total / state.pageSize))}
            </span>
            <button
              disabled={state.page >= Math.ceil(state.total / state.pageSize)}
              onClick={() =>
                setState((s) => ({
                  ...s,
                  page: Math.min(
                    Math.max(1, Math.ceil(state.total / state.pageSize)),
                    s.page + 1
                  ),
                }))
              }
              className="rounded-xl border border-white/10 px-3 py-1.5 disabled:opacity-50"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <UserFormDialog
        state={form}
        onClose={() => setForm((f) => ({ ...f, open: false }))}
        onSubmit={submitForm}
      />

      <Transition appear show={confirm.open} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setConfirm((c) => ({ ...c, open: false }))}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-100 shadow-xl">
                  <Dialog.Title className="text-lg font-semibold">
                    ลบผู้ใช้
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-slate-300">
                    คุณต้องการลบผู้ใช้จำนวน {confirm.ids.length} รายการหรือไม่?
                    การกระทำนี้ไม่สามารถย้อนกลับได้
                  </p>
                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      onClick={() =>
                        setConfirm((c) => ({ ...c, open: false }))
                      }
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={doDelete}
                      className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-500"
                    >
                      ลบ
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}
