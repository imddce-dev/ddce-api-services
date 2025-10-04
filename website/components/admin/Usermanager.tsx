// app/usermanager/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchUsers,
  type userRequest,
  appoveUser,
  type approveRequest,
  updateUsers,
  type updateRequest,
  deleteUser,
} from "@/services/apiService";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

/* ----------------------- helpers ----------------------- */
const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");
const StatusBadge = ({ status }: { status: userRequest["status"] }) => {
  const map: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
    pending: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
    suspended: "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        map[status] ?? "bg-slate-600/20 text-slate-300 ring-1 ring-inset ring-slate-600/40"
      )}
    >
      {status}
    </span>
  );
};

/* --------- edit form: allow only fullname/email/phone --------- */
type EditForm = {
  id: number;
  fullname: string;
  email?: string;
  phone?: string;
};

export default function Usermanager() {
  const [userdata, setUserdata] = useState<userRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"" | "active" | "pending" | "suspended">("");

  // menu
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // dialogs
  const [approveOpen, setApproveOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<false | "approve" | "reject">(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);

  /* -------------------------- load / reload -------------------------- */
  const reloadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers();
      if (res?.success) setUserdata([...res.data]);
    } catch (e) {
      console.error("Reload users failed:", e);
      alert((e as any)?.message || "โหลดรายชื่อผู้ใช้ล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reloadUsers(); }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t)) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenuId(null);
        setMenuPosition(null);
        setApproveOpen(false);
        setDeleteOpen(false);
        setEditOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* -------------------------- derived rows -------------------------- */
  const rows = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return userdata.filter((u) => {
      const passText =
        !keyword ||
        [u.fullname, u.email, u.phone, u.organizeName, String(u.id)]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(keyword));
      const passStatus = !statusFilter || u.status === statusFilter;
      return passText && passStatus;
    });
  }, [userdata, q, statusFilter]);

  /* -------------------------- handlers -------------------------- */
  const handleMenuToggle = (id: number, e: React.MouseEvent) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuPosition(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 6,
      left: rect.right + window.scrollX - 180,
    });
    setOpenMenuId(id);
  };

  const handleApprove = async (approveVal: boolean) => {
    if (!selectedUserId) return;
    try {
      setSubmitting(approveVal ? "approve" : "reject");
      // ใช้ signature เดิมของ service: { userId, appove }
      const payload: approveRequest = { userId: selectedUserId, appove: approveVal };
      await appoveUser(payload);
      await reloadUsers();
    } catch (err: any) {
      console.error("Approve failed", err);
      alert(err?.message || "ทำรายการไม่สำเร็จ");
    } finally {
      setSubmitting(false);
      setApproveOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      setDeleting(true);
      await deleteUser(selectedUserId);
      await reloadUsers();
    } catch (err: any) {
      console.error("Delete failed", err);
      alert(err?.message || "ลบผู้ใช้ไม่สำเร็จ");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSelectedUserId(null);
    }
  };

  const openEdit = (id: number) => {
    const u = userdata.find((x) => x.id === id);
    if (!u) return;
    setEditData({
      id: u.id,
      fullname: u.fullname ?? "",
      email: u.email ?? "",
      phone: u.phone ?? "",
    });
    setEditOpen(true);
  };

  const saveUser = async (payload: EditForm) => {
    setSaving(true);
    try {
      // ใช้ signature เดิมของ service: updateUsers(updateRequest)
      const req: updateRequest = {
        userId: payload.id,
        fullname: (payload.fullname ?? "").trim(),
        email: (payload.email ?? "").trim(),
        phone: (payload.phone ?? "").trim(),
      };
      await updateUsers(req);
      await reloadUsers();
      setEditOpen(false);
      setEditData(null);
    } catch (e: any) {
      console.error("Save user failed:", e);
      alert(e?.message || "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้");
    } finally {
      setSaving(false);
    }
  };

  /* ============================== UI ============================== */
  return (
    <div className="ps-4 pe-4 md:ps-6 md:pe-6 pt-4 pb-6">
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-2 md:mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-base font-semibold text-slate-100">User Manager</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <label className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหา: ชื่อ/อีเมล/องค์กร/ID"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-8 py-2 text-sm text-slate-200 placeholder:text-slate-500 outline-none ring-emerald-500/30 focus:ring-2"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none ring-emerald-500/30 focus:ring-2 sm:w-44"
          >
            <option value="">สถานะ: ทั้งหมด</option>
            <option value="active">active</option>
            <option value="pending">pending</option>
            <option value="suspended">suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-slate-200">
            <thead className="sticky top-0 z-10 bg-slate-950/70 backdrop-blur">
              <tr className="text-slate-300">
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">ชื่อ-สกุล</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Email / Phone / สถานะ
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`} className={i % 2 ? "bg-slate-900/30" : "bg-slate-900/10"}>
                    <td className="px-3 py-3"><div className="h-4 w-10 animate-pulse rounded bg-slate-700/40" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-40 animate-pulse rounded bg-slate-700/40" /></td>
                    <td className="px-3 py-3">
                      <div className="space-y-2">
                        <div className="h-4 w-56 animate-pulse rounded bg-slate-700/40" />
                        <div className="h-4 w-36 animate-pulse rounded bg-slate-700/40" />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="ml-auto h-8 w-8 animate-pulse rounded bg-slate-700/40" />
                    </td>
                  </tr>
                ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10">
                    <div className="text-center text-slate-400">
                      ไม่พบข้อมูลที่ตรงกับเงื่อนไข — ลองเปลี่ยนคำค้นหาหรือสถานะ
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                rows.map((user, i) => (
                  <tr
                    key={user.id}
                    className={cn(
                      i % 2 ? "bg-slate-900/30" : "bg-slate-900/10",
                      "border-t border-slate-800/60 hover:bg-slate-800/40"
                    )}
                  >
                    <td className="px-3 py-3 align-middle text-sm text-slate-300">{user.id}</td>

                    <td className="px-3 py-3 align-middle">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-100">{user.fullname}</div>
                        {user.organizeName && (
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                            <Building2 className="h-3.5 w-3.5" />
                            <span className="truncate">{user.organizeName}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-3 align-middle text-sm">
                      <div className="flex flex-col gap-1">
                        {user.email ? (
                          <a
                            className="inline-flex items-center gap-1 text-slate-300 hover:text-slate-100"
                            href={`mailto:${user.email}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{user.email}</span>
                          </a>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                        {user.phone ? (
                          <a
                            className="inline-flex items-center gap-1 text-slate-300 hover:text-slate-100"
                            href={`tel:${user.phone}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {user.phone}
                          </a>
                        ) : null}
                        <div className="mt-1">
                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3 align-middle text-right">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/60 text-slate-300 outline-none ring-emerald-500/30 transition hover:bg-slate-800/70 focus:ring-2"
                        aria-haspopup="menu"
                        aria-expanded={openMenuId === user.id}
                        onClick={(e) => handleMenuToggle(user.id, e)}
                        title="จัดการ"
                      >
                        <MoreVertical className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Context Menu */}
      {openMenuId !== null && menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left, position: "absolute" }}
            className="z-[9999] w-44 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/95 shadow-2xl backdrop-blur"
            role="menu"
          >
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10"
              role="menuitem"
              onClick={() => {
                setSelectedUserId(openMenuId);
                setApproveOpen(true);
                setOpenMenuId(null);
                setMenuPosition(null);
              }}
            >
              <Check className="h-4 w-4" /> อนุมัติ/ไม่อนุมัติ
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-blue-300 hover:bg-blue-500/10"
              role="menuitem"
              onClick={() => {
                const id = openMenuId!;
                setOpenMenuId(null);
                setMenuPosition(null);
                openEdit(id);
              }}
            >
              <Pencil className="h-4 w-4" /> แก้ไข
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
              role="menuitem"
              onClick={() => {
                setSelectedUserId(openMenuId);
                setDeleteOpen(true);
                setOpenMenuId(null);
                setMenuPosition(null);
              }}
            >
              <Trash2 className="h-4 w-4" /> ลบ
            </button>
          </div>,
          document.body
        )}

      {/* Approve Dialog */}
      {approveOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] grid place-items-center bg-black/60 p-4">
            <div className="w-full max-w-[420px] rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200 shadow-2xl">
              <h2 className="text-lg font-semibold">ยืนยันการดำเนินการ</h2>
              <p className="mt-2 text-sm text-slate-300">
                ต้องการเปลี่ยนสถานะผู้ใช้{" "}
                <span className="font-medium text-emerald-300">#{selectedUserId}</span> หรือไม่?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
                  onClick={() => setApproveOpen(false)}
                  disabled={!!submitting}
                >
                  ยกเลิก
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm hover:bg-rose-500 disabled:opacity-60"
                  onClick={() => handleApprove(false)}
                  disabled={!!submitting}
                >
                  {submitting === "reject" ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-b-transparent" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  ไม่อนุมัติ
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-500 disabled:opacity-60"
                  onClick={() => handleApprove(true)}
                  disabled={!!submitting}
                >
                  {submitting === "approve" ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-b-transparent" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  อนุมัติ
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Dialog */}
      {deleteOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] grid place-items-center bg-black/60 p-4">
            <div className="w-full max-w-[420px] rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200 shadow-2xl">
              <h2 className="text-lg font-semibold text-rose-300">ลบผู้ใช้</h2>
              <p className="mt-2 text-sm text-slate-300">
                คุณต้องการลบผู้ใช้{" "}
                <span className="font-medium text-rose-300">#{selectedUserId}</span> ใช่หรือไม่?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                >
                  ยกเลิก
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm hover:bg-rose-500 disabled:opacity-60"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-b-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  ยืนยันลบ
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Edit Dialog (fullname/email/phone only) */}
      {editOpen && editData &&
        createPortal(
          <div className="fixed inset-0 z-[10000] grid place-items-center bg-black/60 p-4">
            <div className="w-full max-w-[520px] rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200 shadow-2xl">
              <h2 className="text-lg font-semibold">แก้ไขข้อมูลผู้ใช้ #{editData.id}</h2>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">ชื่อ-สกุล *</span>
                  <input
                    value={editData.fullname}
                    onChange={(e) => setEditData({ ...editData, fullname: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
                    placeholder="ชื่อ-สกุล"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">อีเมล</span>
                  <input
                    value={editData.email ?? ""}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    type="email"
                    className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
                    placeholder="name@example.com"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">เบอร์โทร</span>
                  <input
                    value={editData.phone ?? ""}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring-2"
                    placeholder="08x-xxx-xxxx"
                  />
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  * แก้ไขได้เฉพาะ ชื่อ-สกุล, อีเมล และเบอร์โทร เท่านั้น
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
                  onClick={() => {
                    setEditOpen(false);
                    setEditData(null);
                  }}
                  disabled={saving}
                >
                  ยกเลิก
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-500 disabled:opacity-60"
                  onClick={() => editData && saveUser(editData)}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-b-transparent" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  บันทึก
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
