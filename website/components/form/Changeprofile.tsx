'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  Save,
  X,
  Building2,
  Mail,
  Phone,
  User2,
  BadgeInfo,
  Edit3,
  AtSign,
} from 'lucide-react';
import apiClient from '@/services/apiConfig';
import { useUserStore } from '@/stores/useUserStore';

type EditablePayload = {
  name: string;
  email: string;
  phone: string;
};

const emptyEditable: EditablePayload = {
  name: '',
  email: '',
  phone: '',
};

function isEmailValid(s: string) {
  return !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default function ChangeProfilePage() {
  const { userProfile, isLoading, fetchUserProfile } = useUserStore();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<EditablePayload>(emptyEditable);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // โหลดโปรไฟล์ครั้งแรก
  useEffect(() => {
    if (!userProfile && !isLoading) fetchUserProfile();
  }, [userProfile, isLoading, fetchUserProfile]);

  // sync form กับ store
  useEffect(() => {
    if (userProfile) {
      setForm({
        name: userProfile.name ?? '',
        email: userProfile.email ?? '',
        phone: userProfile.phone ?? '',
      });
    }
  }, [userProfile]);

  const original = useMemo<EditablePayload | null>(() => {
    if (!userProfile) return null;
    return {
      name: userProfile.name ?? '',
      email: userProfile.email ?? '',
      phone: userProfile.phone ?? '',
    };
  }, [userProfile]);

  const dirty = useMemo(() => {
    if (!original) return false;
    return (
      form.name !== original.name ||
      form.email !== original.email ||
      form.phone !== original.phone
    );
  }, [form, original]);

  const valid = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!isEmailValid(form.email)) return false;
    if (form.phone && form.phone.length > 30) return false;
    return true;
  }, [form]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!dirty || !valid || saving) return;
    setSaving(true);
    setMsg(null);
    try {
      const payload: EditablePayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };
      // ส่งเฉพาะ name/email/phone — ไม่แตะ organizer และ username
      await apiClient.put('/auth/profile', payload);
      await fetchUserProfile();
      setMsg({ type: 'success', text: 'บันทึกโปรไฟล์เรียบร้อย' });
      setEditMode(false);
    } catch (err: any) {
      console.error('Update profile failed', err);
      setMsg({
        type: 'error',
        text: err?.response?.data?.message || 'บันทึกไม่สำเร็จ กรุณาลองใหม่',
      });
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    if (original) setForm(original);
    setEditMode(false);
    setMsg(null);
  };

  // อักษรย่อโปรไฟล์เล็กๆ
  const initials =
    (userProfile?.name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('') || 'U';

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      {/* Header + Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-800 text-slate-200 font-semibold">
            {initials}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-100">โปรไฟล์ของฉัน</h1>
            <p className="mt-1 text-sm text-slate-400">
              แก้ไขได้เฉพาะ <span className="text-emerald-300">ชื่อ–นามสกุล, อีเมล, เบอร์โทร</span>{' '}
              — <span className="text-amber-300">username และหน่วยงานแก้ไขไม่ได้</span>
            </p>
          </div>
        </div>

        {/* ปุ่มบนขวา */}
        {!isLoading && userProfile && (
          <div className="flex items-center gap-2">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 transition-colors"
                title="แก้ไขโปรไฟล์"
              >
                <Edit3 className="h-4 w-4" />
                แก้ไข
              </button>
            ) : (
              <>
                <button
                  onClick={onCancel}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 transition-colors disabled:opacity-60"
                  disabled={saving}
                >
                  <X className="h-4 w-4" />
                  ยกเลิก
                </button>
                <button
                  onClick={() => onSubmit()}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500 transition-colors disabled:opacity-60"
                  disabled={!dirty || !valid || saving}
                  title={!dirty ? 'ยังไม่มีการเปลี่ยนแปลง' : !valid ? 'กรอกข้อมูลให้ถูกต้องก่อน' : 'บันทึก'}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  บันทึก
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Card หลัก */}
      <div className="mt-5 space-y-6">
        <Section title="ข้อมูลส่วนตัว" description={!editMode ? 'โหมดแสดงผล' : 'โหมดแก้ไข'}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* ชื่อ–นามสกุล */}
            <ViewOrEdit
              edit={editMode}
              label="ชื่อ–นามสกุล"
              value={form.name}
              leftIcon={<User2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />}
            >
              <input
                id="name"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-9 pr-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/30 focus:ring-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                maxLength={120}
                required
              />
            </ViewOrEdit>

            {/* อีเมล */}
            <ViewOrEdit
              edit={editMode}
              label="อีเมล"
              value={form.email}
              error={editMode && !isEmailValid(form.email) ? 'รูปแบบอีเมลไม่ถูกต้อง' : undefined}
              leftIcon={<Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />}
            >
              <input
                id="email"
                type="email"
                inputMode="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-9 pr-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/30 focus:ring-2 aria-[invalid=true]:ring-rose-500/40"
                aria-invalid={!isEmailValid(form.email)}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                maxLength={120}
                required
              />
            </ViewOrEdit>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* เบอร์โทร */}
            <ViewOrEdit
              edit={editMode}
              label="โทรศัพท์"
              value={form.phone || '—'}
              hint="ใส่ได้ทั้งตัวเลข ขีด หรือ +"
              leftIcon={<Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />}
            >
              <input
                id="phone"
                inputMode="tel"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-9 pr-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/30 focus:ring-2"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                maxLength={30}
                placeholder="เช่น 081-234-5678"
              />
            </ViewOrEdit>

            {/* username (อ่านอย่างเดียว) */}
            <ReadOnlyRow label="ชื่อผู้ใช้ (username)">
              <div className="flex items-center gap-2 text-slate-200">
                <AtSign className="h-4 w-4 text-slate-400" />
                <span className="break-words">{userProfile?.username || '—'}</span>
              </div>
            </ReadOnlyRow>
          </div>
        </Section>

        {/* หน่วยงาน (อ่านอย่างเดียว) */}
        <Section title="หน่วยงานของคุณ" description="ระบบล็อกไว้ ไม่สามารถแก้ไขได้">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Building2 className="h-4 w-4" />
              หน่วยงาน
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <ReadOnlyRow label="ชื่อหน่วยงาน">
                <span className="break-words text-slate-200">{userProfile?.organizerName || '—'}</span>
              </ReadOnlyRow>
              <ReadOnlyRow label="รหัสหน่วยงาน">
                <code className="rounded bg-slate-800/80 px-2 py-1 text-xs text-slate-300">
                  {userProfile?.organizerId || '—'}
                </code>
              </ReadOnlyRow>
            </div>
            <div className="mt-2 flex items-start gap-2 text-xs text-slate-400">
              <BadgeInfo className="mt-0.5 h-4 w-4 text-slate-500" />
              ฟิลด์หน่วยงานถูกล็อกโดยระบบ ไม่สามารถแก้ไขได้
            </div>
          </div>
        </Section>

        {/* สถานะ + ปุ่ม (สำหรับจอเล็ก) */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-400">
            สถานะ:{' '}
            {editMode ? (
              dirty ? (
                <span className="text-amber-300">มีการเปลี่ยนแปลง (ยังไม่บันทึก)</span>
              ) : (
                <span className="text-slate-300">ไม่มีการเปลี่ยนแปลง</span>
              )
            ) : (
              <span className="text-slate-300">โหมดแสดงผล</span>
            )}
          </div>

          {editMode && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 transition-colors disabled:opacity-60"
                disabled={saving}
              >
                <X className="h-4 w-4" />
                ยกเลิกการแก้ไข
              </button>
              <button
                type="submit"
                onClick={() => onSubmit()}
                disabled={!dirty || !valid || saving}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
                title={!dirty ? 'ยังไม่มีการเปลี่ยนแปลง' : !valid ? 'กรอกข้อมูลให้ถูกต้องก่อน' : 'บันทึก'}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                บันทึก
              </button>
            </div>
          )}
        </div>

        {/* ข้อความผลลัพธ์ */}
        {msg && (
          <div
            className={
              msg.type === 'success'
                ? 'rounded-lg border border-emerald-600/40 bg-emerald-600/10 p-3 text-emerald-200 text-sm'
                : 'rounded-lg border border-rose-600/40 bg-rose-600/10 p-3 text-rose-200 text-sm'
            }
          >
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------ UI bits ------------ */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-3">
        <div className="text-sm font-medium text-slate-200">{title}</div>
        {description ? <div className="text-xs text-slate-500">{description}</div> : null}
      </div>
      {children}
    </div>
  );
}

function ViewOrEdit({
  edit,
  label,
  value,
  children,
  error,
  hint,
  leftIcon,
}: {
  edit: boolean;
  label: string;
  value: React.ReactNode;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}) {
  if (!edit) {
    return (
      <ReadOnlyRow label={label}>
        <span className="text-slate-200 break-words">{value ?? '—'}</span>
      </ReadOnlyRow>
    );
  }
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 relative">
        {leftIcon}
        {children}
      </div>
      {hint && !error ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
      {error ? <div className="mt-1 text-xs text-rose-300">{error}</div> : null}
    </label>
  );
}

function ReadOnlyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 min-w-0 break-words rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm">
        {children}
      </div>
    </div>
  );
}
