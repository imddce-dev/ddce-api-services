'use client'
import { FetchApiReqById ,type ApiReqData } from '@/services/apiService'
import React, { useEffect, useState } from 'react'
import { useUserStore } from "@/stores/useUserStore";

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const StatusForm = () => {
  const [events, setEvents] = useState<ApiReqData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userProfile = useUserStore((state) => state.userProfile);
  const currentId = userProfile?.id ?? null

  useEffect(()=> {
    const loaddata = async () => {
      if (!currentId) {
        setError("ยังไม่ได้เข้าสู่ระบบ")
        setLoading(false)
        return
      }
      try {
        const res = await FetchApiReqById(currentId)
        if (res.success && res.data && res.data.length > 0) {
          setEvents(res.data)
        } else {
          setEvents([])
          setError("ไม่พบข้อมูล")
        }
      } catch (err) {
        console.error("โหลดข้อมูลล้มเหลว:", err)
        setEvents([])
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
      } finally {
        setLoading(false)
      }
    }
    loaddata()
  },[currentId])

  if (loading) {
    return <p className="text-slate-400">กำลังโหลดข้อมูล...</p>
  }

  if (error) {
    return <p className="text-slate-400">{error}</p>
  }

  return (
    <div>
      {events.length === 0 ? (
        <p className="text-slate-400">ไม่พบข้อมูล</p>
      ) : (
        <ul className="space-y-3">
          {events.map(ev => (
            <li key={ev.id} className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm">
              <div><span className="font-semibold">ID:</span> {ev.id}</div>
              <div><span className="font-semibold">ชื่อผู้ยื่น:</span> {ev.requester_name}</div>
              <div><span className="font-semibold">อีเมล:</span> {ev.requester_email}</div>
              <div><span className="font-semibold">ระบบ/โครงการ:</span> {ev.project_name}</div>
              <div><span className="font-semibold">สถานะ:</span> {ev.status}</div>
              <div><span className="font-semibold">สร้างเมื่อ:</span> {formatDate(ev.created_at)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StatusForm
