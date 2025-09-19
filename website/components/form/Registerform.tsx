"use client";

import React, { useMemo, useState, Fragment, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { Combobox, Transition } from '@headlessui/react';
import PrivacyDialog from "@/components/common/PrivacyDialog"; 
import { register as registerService } from '@/services/authervice';
import { getOrg as getOrgService} from '@/services/orgService'
import { CustomAlertSuccess, CustomAlertError } from '../../lib/alerts';
import { useRouter } from "next/navigation";

type FormValues = {
  fullname: string;
  username: string;   
  email: string;
  phone: string;
  organizer: string;
  password: string;
  confirm: string;
  policy: boolean;
};

const SelectorIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    aria-hidden="true" 
    className="h-5 w-5 text-gray-400"
  >
    <path 
      fillRule="evenodd" 
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
      clipRule="evenodd" 
    />
  </svg>
);

/** Password policy **/
const pwdRules = {
  minLen: 8,
  lower: /[a-z]/,
  upper: /[A-Z]/,
  digit: /[0-9]/,
  special: /[^A-Za-z0-9\s]/,
  noSpace: /^\S+$/,
};

const commonPasswords = new Set([
  "123456","123456789","password","qwerty","111111","12345678","abc123",
  "password1","123123","qwerty123","iloveyou","000000","1234","12345",
]);

// --- Helper Functions ---

function scorePassword(pwd: string, personal: string[] = []) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= pwdRules.minLen) s++;
  if (pwdRules.lower.test(pwd)) s++;
  if (pwdRules.upper.test(pwd)) s++;
  if (pwdRules.digit.test(pwd)) s++;
  if (pwdRules.special.test(pwd)) s++;
  if (pwdRules.noSpace.test(pwd)) s++;
  const pStr = personal.filter(Boolean).map((t) => t.toLowerCase()).join("|");
  if (pStr && new RegExp(pStr, "i").test(pwd)) s = Math.max(0, s - 2);
  if (commonPasswords.has(pwd.toLowerCase())) s = Math.max(0, s - 3);
  return s;
}

function containsPersonalInfo(pwd: string, username?: string, fullname?: string) {
  const parts = [
    username?.toLowerCase() ?? "",
    ...(fullname ? fullname.toLowerCase().split(/\s+/).filter(Boolean) : []),
  ].filter(Boolean);
  if (!pwd) return false;
  const p = pwd.toLowerCase();
  return parts.some((t) => t.length >= 3 && p.includes(t));
}

function validatePhonePretty(v: string) {
  if (!v) return "กรอกเบอร์ติดต่อ";
  const digits = v.replace(/[^\d+]/g, "");
  if (digits.slice(1).includes("+")) return "รูปแบบเบอร์ไม่ถูกต้อง";
  const onlyNums = digits.startsWith("+") ? digits.slice(1) : digits;
  if (!/^\d+$/.test(onlyNums)) return "รูปแบบเบอร์ไม่ถูกต้อง";
  if (onlyNums.length < 9 || onlyNums.length > 15) return "ความยาวเบอร์ควรอยู่ระหว่าง 9-15 หลัก";
  return true;
}

/** UI **/
function RuleItem({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={
          "inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] " +
          (ok ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30" : "bg-white/10 text-slate-300")
        }
        aria-hidden
      >
        {ok ? "✓" : "•"}
      </span>
      <span className={ok ? "text-slate-300" : "text-slate-400"}>{text}</span>
    </li>
  );
}

interface ComboboxOption {
    value: number;
    label: string;
  }


export function Registerform() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormValues>({ 
    mode: "onChange",
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      phone: "",
      organizer: "",
      password: "",
      confirm: "",
      policy: false,
    }
  });

  const [orgOptions, setOrgOptions] = useState<ComboboxOption[]>([]);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter()
  
  const pwd = watch("password");
  const username = watch("username");
  const fullname = watch("fullname");


 useEffect(() => {
  const loadOrganizations = async () => {
    try {
      const response = await getOrgService();
      const organizationsArray = response.data || []; 
      const formattedOptions = organizationsArray.map(org => ({
        value: org.id,
        label: org.name,
      }));

      setOrgOptions(formattedOptions);
    } catch (error) {
      console.error("Failed to fetch organizations", error);
      setOrgOptions([]); 
    }
  };
  loadOrganizations();
}, []);
 
 const filteredOptions =
    query === ''
      ? orgOptions
      : orgOptions.filter((org) =>
          org.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  const ruleState = useMemo(() => {
    const len = (pwd?.length ?? 0) >= pwdRules.minLen;
    const lo = pwdRules.lower.test(pwd ?? "");
    const up = pwdRules.upper.test(pwd ?? "");
    const dg = pwdRules.digit.test(pwd ?? "");
    const sp = pwdRules.special.test(pwd ?? "");
    const ns = pwdRules.noSpace.test(pwd ?? "");
    const common = pwd ? !commonPasswords.has(pwd.toLowerCase()) : false;
    const personal = pwd ? !containsPersonalInfo(pwd, username, fullname) : false;
    return { len, lo, up, dg, sp, ns, common, personal };
  }, [pwd, username, fullname]);

  const score = useMemo(
    () => scorePassword(pwd ?? "", [username ?? "", ...(fullname?.split(/\s+/) ?? [])]),
    [pwd, username, fullname]
  );
  const strengthLabel = score <= 2 ? "อ่อนแอ" : score <= 5 ? "ปานกลาง" : "ปลอดภัย";
 const onSubmit = async (values: FormValues) => {
  if (values.password !== values.confirm) {
    CustomAlertError(
      "เกิดข้อผิดพลาด",
      "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง"
    );
    return;
  }

  const { confirm, ...payload } = values;
  try {
    const result = await registerService(payload);
    if (!result.success) {
      CustomAlertError("เกิดข้อผิดพลาด", result.message || "ไม่สามารถลงทะเบียนได้");
      return;
    }

    const alertAc = await CustomAlertSuccess("ลงทะเบียนสำเร็จแล้ว", result.message || "ลงทะเบียนสำเร็จแล้ว");
    if(alertAc.isConfirmed){
      reset()
      router.push("/auth/login");
    }

  } catch (error) {
    //console.error("Registration failed:", error);

    let errorMessage = "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    CustomAlertError("เกิดข้อผิดพลาด", errorMessage);
  }
};

 
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 py-3 text-sm">
        <div className="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-2">
          
          {/* ชื่อ-สกุล */}
          <div>
            <label className="mb-1 block text-xs text-white text-[16px] font-extrabold">
              ชื่อ-นามสกุล <small>( เป็นภาษาไทย )</small> <span className="text-red-400">*</span>
            </label>
            <input
                className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none focus:ring-2 
                                transition duration-700 ease-in-out ${
                    errors.fullname
                      ? 'border-red-400 focus:ring-red-400/40'
                      : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
                  }`}
                placeholder="โปรดระบุคำนำหน้า เช่น นาง นางสาว " 
                {...register("fullname", { 
                    required: "กรุณาระบุ ชื่อ-นามสกุล ให้เรียบร้อย",
                    pattern: {
                      value: /^[ก-๙\s]+$/,
                      message: "กรุณากรอกชื่อ-นามสกุลเป็นภาษาไทยเท่านั้น"
                    }
                })}
            />
            <Transition
              show={!!errors.fullname}
              as={Fragment}
              enter="transition-opacity duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-700"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
                {errors.fullname?.message}
              </p>
            </Transition>
          </div>

          {/* Username */}
          <div>
            <label className="mb-1 block text-xs text-white text-[16px] font-extrabold">
              ชื่อผู้ใช้ (Username) <span className="text-red-400">*</span>
            </label>
            <input
              className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none focus:ring-2 
                              transition duration-700 ease-in-out ${
                    errors.username
                      ? 'border-red-400 focus:ring-red-400/40'
                      : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
                  }`}
              {...register("username", {
                required: "กรุณาป้อนชื่อผู้ใช้ (username) ให้เรียบร้อย",
                minLength: { value: 8, message: "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 8 ตัวอักษร" },
                maxLength: { value: 20, message: "ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 20 ตัวอักษร" },
                pattern: { value: /^[a-zA-Z0-9._-]+$/, message: "ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษ ตัวเลข หรือสัญลักษณ์ . _ - เท่านั้น" },
                validate: {
                  notOnlyNumbers: (value) => !/^\d+$/.test(value) || "ชื่อผู้ใช้ต้องไม่ประกอบด้วยตัวเลขเพียงอย่างเดียว",
                },
              })}
              placeholder="ชื่อผู้ใช้งานของคุณ เช่น john_doe หรือ anna.s"
            />
            <Transition
              show={!!errors.username}
              as={Fragment}
              enter="transition-opacity duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-700"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
            <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
              {errors.username?.message}
            </p>
            </Transition>
          </div>

          {/* ... ส่วนอื่นๆ ของฟอร์มเหมือนเดิม ... */}
          
          {/* อีเมล */}
          <div>
             <label className="mb-1 block text-xs text-white text-[16px] font-extrabold">
                  อีเมล <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none focus:ring-2 
                              transition duration-700 ease-in-out ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-400/40'
                      : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
                  }`}
              {...register("email", {
                required: "กรุณาป้อนอีเมลให้เรียบร้อย",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "รูปแบบอีเมลไม่ถูกต้อง" },
              })}
              placeholder="name@example.com"
            />
            <Transition
              show={!!errors.email}
              as={Fragment}
              enter="transition-opacity duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-700"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
               <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
                {errors.email?.message}
              </p>
            </Transition>
          </div>

          {/* เบอร์ติดต่อ */}
          <div>
             <label className="mb-1 block text-xs text-white text-[16px] font-extrabold">
                  เบอร์โทรติดต่อ <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none focus:ring-2 
                              transition duration-700 ease-in-out ${
                    errors.phone
                      ? 'border-red-400 focus:ring-red-400/40'
                      : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
                  }`}
              placeholder="เช่น 081-234-5678"
              {...register("phone", { required: "กรุณาป้อนเบอร์โทรติดต่อให้เรียบร้อย", validate: validatePhonePretty })}
              inputMode="tel"
            />
            <p className="mt-1 text-[11px] text-slate-400">ใส่ตัวเลขได้ มี/ไม่มี ช่องว่างหรือขีดก็ได้</p>
            <Transition
              show={!!errors.phone}
              as={Fragment}
              enter="transition-opacity duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-700"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
            <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
              {errors.phone?.message}
            </p>
            </Transition>
          </div>

          {/* รหัสผ่าน */}
          <div>
             <label className="mb-1 block text-xs text-white text-[16px] font-extrabold">
                  รหัสผ่าน <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none focus:ring-2 
                                transition duration-700 ease-in-out ${
                      errors.password ? 'border-red-400 focus:ring-red-400/40' : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
                    }`}
                placeholder="ความยาวรหัสผ่านอย่างน้อย 8 ตัวอักษร"
                {...register("password", {
                  required: "กรุณาป้อนรหัสผ่านให้เรียบร้อย",
                  validate: (v) => {
                    if (!v || v.length < pwdRules.minLen) return `ความยาวอย่างน้อย ${pwdRules.minLen} ตัวอักษร`;
                    if (!pwdRules.lower.test(v)) return "ต้องมีตัวอักษรพิมพ์เล็ก";
                    if (!pwdRules.upper.test(v)) return "ต้องมีตัวอักษรพิมพ์ใหญ่";
                    if (!pwdRules.digit.test(v)) return "ต้องมีตัวเลข";
                    if (!pwdRules.special.test(v)) return "ต้องมีอักขระพิเศษ";
                    if (!pwdRules.noSpace.test(v)) return "ห้ามมีเว้นวรรค";
                    if (commonPasswords.has(v.toLowerCase())) return "รหัสผ่านนี้พบใช้กันบ่อยเกินไป";
                    if (containsPersonalInfo(v, username, fullname)) return "ห้ามมีชื่อผู้ใช้หรือส่วนของชื่อ-สกุลในรหัสผ่าน";
                    return true;
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-300 hover:text-white"
              >
                {showPwd ? "ซ่อน" : "แสดง"}
              </button>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1 w-[85%] rounded bg-white/10">
                <div
                  className="h-1 rounded transition-all duration-300"
                  style={{
                    width: `${(score / 8) * 100}%`,
                    background: score <= 2 ? "#fda4af" : score <= 5 ? "#fbbf24" : "#34d399",
                  }}
                />
              </div>
              <span className="text-[11px] text-slate-300">{strengthLabel}</span>
            </div>
            <ul className="mt-2 grid grid-cols-1 gap-1 text-[12px] text-slate-400 sm:grid-cols-2">
              <RuleItem ok={ruleState.len} text={`ยาวอย่างน้อย ${pwdRules.minLen} ตัวอักษร`} />
              <RuleItem ok={ruleState.ns} text="ห้ามมีช่องว่าง" />
              <RuleItem ok={ruleState.lo} text="มีตัวพิมพ์เล็ก (a-z)" />
              <RuleItem ok={ruleState.up} text="มีตัวพิมพ์ใหญ่ (A-Z)" />
              <RuleItem ok={ruleState.dg} text="มีตัวเลข (0-9)" />
              <RuleItem ok={ruleState.sp} text="มีอักขระพิเศษ (!@#$…)" />
              <RuleItem ok={ruleState.common} text="ไม่ใช่รหัสผ่านยอดฮิต" />
              <RuleItem ok={ruleState.personal} text="ไม่มีชื่อผู้ใช้/ชื่อ-สกุล" />
            </ul>
            <Transition
              show={!!errors.password}
              as={Fragment}
              enter="transition-opacity duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-700"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
                {errors.password?.message}
              </p>
            </Transition>
          </div>

          {/* ยืนยันรหัสผ่าน */}
          <div>
             <label className="mb-1 block text-xs text-white text-[16px] font-extrabold">
                  ยืนยันรหัสผ่าน <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none focus:ring-2 
                                transition duration-700 ease-in-out ${
                      errors.confirm ? 'border-red-400 focus:ring-red-400/40' : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
                    }`}
                placeholder="ป้อนรหัสผ่านอีกรอบ"
                {...register("confirm", {
                  required: "กรุณาป้อนยืนยันรหัสผ่านให้เรียบร้อย",
                  validate: (v) => v === (pwd ?? "") || "รหัสผ่านไม่ตรงกัน",
                })}
                autoComplete="new-password"
                onPaste={(e) => e.preventDefault()}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-300 hover:text-white"
              >
                {showConfirm ? "ซ่อน" : "แสดง"}
              </button>
            </div>
            <Transition
             show={!!errors.confirm}
             as={Fragment}
             enter="transition-opacity duration-700"
             enterFrom="opacity-0"
             enterTo="opacity-100"
             leave="transition-opacity duration-700"
             leaveFrom="opacity-100"
             leaveTo="opacity-0"
            >
              <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
                {errors.confirm?.message}
              </p>
            </Transition>
          </div>

          {/* หน่วยงาน */}
          <div>
            <label className="mb-1 block text-xs text-white text-[16px] font-extrabold">
              หน่วยงาน <span className="text-red-400">*</span>
            </label>
            <Controller
              name="organizer"
              control={control}
              rules={{ required: "กรุณาเลือกหรือพิมพ์เพื่อค้นหาหน่วยงาน" }}
              render={({ field: { onChange, value } }) => (
                <Combobox value={value} onChange={onChange}>
                  <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left">
                      <Combobox.Input
                        className={`h-9 w-full rounded-lg border bg-slate-900/80 px-3 text-slate-100 outline-none focus:ring-2 
                                            transition duration-700 ease-in-out ${
                                  errors.organizer
                                    ? 'border-red-400 focus:ring-red-400/40'
                                    : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
                                }`}
                        displayValue={(val: number) => orgOptions.find(o => o.value === val)?.label || ""}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="พิมพ์เพื่อค้นหา..."
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <SelectorIcon />
                      </Combobox.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setQuery('')}
                    >
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredOptions.length === 0 && query !== '' ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-400">
                            ไม่พบข้อมูล
                          </div>
                        ) : (
                          filteredOptions.map((org) => (
                            <Combobox.Option
                              key={org.value}
                              className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${ active ? 'bg-cyan-600 text-white' : 'text-slate-200' }`}
                              value={org.value}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {org.label}
                                  </span>
                                  {selected ? (
                                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-cyan-500'}`}>
                                      ✓
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              )}
            />
            <Transition
              show={!!errors.organizer}
              as={Fragment}
              enter="transition-opacity duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-700"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">{errors.organizer?.message}</p>
            </Transition>
            
          </div>

          {/* เงื่อนไขการใช้งาน */}
          <div className="md:col-span-2">
            <div>
              <label className="flex flex-1 items-start gap-3 text-xs text-slate-300">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-900/60 checked:bg-cyan-400 checked:border-cyan-400 transition duration-700"
                  {...register("policy", { required: "กรุณายอมรับเงื่อนไขการใช้งาน" })}
                />
                <span>
                  ฉันยอมรับเงื่อนไขการใช้งาน และ{" "}
                  <button
                    type="button"
                    onClick={() => setOpenPrivacy(true)}
                    className="underline decoration-dotted text-cyan-300 hover:text-cyan-200"
                  >
                    นโยบายความเป็นส่วนตัว
                  </button>
                </span>
              </label>
              <Transition
                show={!!errors.policy}
                as={Fragment}
                enter="transition-opacity duration-700"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-700"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                 <p className="mt-1 text-[12px] font-bold text-red-400" role="alert">
                  {errors.policy?.message}
                </p>
              </Transition>
            </div>
          </div>

          {/* ปุ่มส่ง + ลิงก์ข้อความกลับไป Login */}
          <div className="md:col-span-2 pt-1">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="text-[16px] h-9 w-full rounded-xl bg-cyan-500/90 px-4  font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 disabled:opacity-60"
            >
              {isSubmitting ? "กำลังสมัคร…" : "สมัครใช้งาน"}
            </button>
            <div className="mt-2 text-center">
              <Link href="/auth/login" className="text-xs text-slate-300 underline decoration-dotted hover:text-cyan-200">
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </div>

          {/* หมายเหตุ */}
          <p className="md:col-span-2 text-[11px] text-slate-400">
            * ต้องกรอกทุกช่อง • นโยบายรหัสผ่าน: ยาว ≥ {pwdRules.minLen}, มีตัวพิมพ์เล็ก/ใหญ่ ตัวเลข และอักขระพิเศษ,
            ห้ามช่องว่าง, หลีกเลี่ยงคำยอดฮิต และห้ามมีชื่อผู้ใช้หรือชื่อ-สกุล
          </p>
        </div>
      </form>

      <PrivacyDialog
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        contactPhone="02-278-1234"
        contactEmail="privacy@ddce.go.th"
      />
    </>
  );
}

