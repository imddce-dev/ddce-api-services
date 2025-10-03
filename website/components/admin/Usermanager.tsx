"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchUsers,
  type userRequest,
  appoveUser,
  type approveRequest,
} from "@/services/apiService";
import { MoreVertical, Pencil, Trash2, Check, X } from "lucide-react";
import { createPortal } from "react-dom";

const Usermanager = () => {
  const [userdata, setUserdata] = useState<userRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchUsers();
        if (response.success) {
          setUserdata(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch User Data!", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleMenuToggle = (id: number, e: React.MouseEvent) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 160,
      });
      setOpenMenuId(id);
    }
  };
  const handleApprove = async (appove: boolean) => {
    if (!selectedUserId) return;
    try {
      const res = await appoveUser({ userId: selectedUserId, appove });
      console.log("Approve Result:", selectedUserId,appove);
      setUserdata((prev) =>
        prev.map((u) =>
          u.id === selectedUserId
            ? { ...u, status: appove ? "active" : "pending" }
            : u
        )
      );
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setDialogOpen(false);
    }
  };

  if (loading) return <div className="text-slate-300">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="p-4">
      <table className="table-auto border-collapse w-full rounded-2xl overflow-hidden text-slate-200">
        <thead>
          <tr className="bg-slate-800 text-slate-100">
            <th className="border border-slate-700 px-2 py-2">ID</th>
            <th className="border border-slate-700 px-2 py-2">ชื่อ-สกุล</th>
            <th className="border border-slate-700 px-2 py-2">Email</th>
            <th className="border border-slate-700 px-2 py-2">Phone</th>
            <th className="border border-slate-700 px-2 py-2">องค์กร</th>
            <th className="border border-slate-700 px-2 py-2">สถานะ</th>
            <th className="border border-slate-700 px-2 py-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {userdata.map((user, i) => (
            <tr
              key={user.id}
              className={`${
                i % 2 === 0 ? "bg-slate-900" : "bg-slate-800"
              } hover:bg-slate-700`}
            >
              <td className="border border-slate-700 px-2 py-1">{user.id}</td>
              <td className="border border-slate-700 px-2 py-1">
                {user.fullname}
              </td>
              <td className="border border-slate-700 px-2 py-1">{user.email}</td>
              <td className="border border-slate-700 px-2 py-1">{user.phone}</td>
              <td className="border border-slate-700 px-2 py-1">
                {user.organizeName} ({user.organizeId})
              </td>
              <td className="border border-slate-700 px-2 py-1">
                {user.status === "active" ? (
                  <span className="text-emerald-400 font-medium">active</span>
                ) : (
                  <span className="text-amber-400">{user.status}</span>
                )}
              </td>
              <td className="border border-slate-700 px-2 py-1 relative">
                <button
                  ref={buttonRef}
                  className="p-1 rounded hover:bg-slate-600"
                  onClick={(e) => handleMenuToggle(user.id, e)}
                >
                  <MoreVertical className="w-5 h-5 text-slate-300" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openMenuId !== null &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left, position: "absolute" }}
            className="w-40 rounded-xl border border-slate-700 bg-slate-900 shadow-xl z-[9999]"
          >
            <button
              className="flex w-full items-center gap-2 px-3 py-2 hover:bg-emerald-600/20 text-emerald-400"
              onClick={() => {
                setOpenMenuId(null);
                setSelectedUserId(openMenuId);
                setDialogOpen(true);
              }}
            >
              <Check className="h-4 w-4" /> อนุมัติ
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 hover:bg-blue-600/20 text-blue-400"
              onClick={() => {
                setOpenMenuId(null);
                console.log("แก้ไข", openMenuId);
              }}
            >
              <Pencil className="h-4 w-4" /> แก้ไข
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 hover:bg-red-600/20 text-red-400"
              onClick={() => {
                setOpenMenuId(null);
                console.log("ลบ", openMenuId);
              }}
            >
              <Trash2 className="h-4 w-4" /> ลบ
            </button>
          </div>,
          document.body
        )}

      {dialogOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60">
            <div className="w-[320px] rounded-xl bg-slate-900 p-6 shadow-xl border border-slate-700 text-slate-200">
              <h2 className="text-lg font-semibold mb-4">ยืนยันการอนุมัติ</h2>
              <p className="mb-6">
                ต้องการอนุมัติการใช้งานของผู้ใช้{" "}
                <span className="text-emerald-400">{selectedUserId}</span> ใช่หรือไม่?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                  onClick={() => setDialogOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
                  onClick={() => handleApprove(false)}
                >
                  ไม่อนุมัติ
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500"
                  onClick={() => handleApprove(true)}
                >
                  อนุมัติ
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Usermanager;
