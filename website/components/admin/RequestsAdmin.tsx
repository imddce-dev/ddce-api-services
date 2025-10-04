'use client'
import { FetchAllApireq , type ApiReqData} from '@/services/apiService'
import React, { useEffect, useState } from 'react'


const RequestsAdmin = () => {
  const [reqdata, setReqdata] = useState<ApiReqData[]>([])
  useEffect(() => {
    const fechdata = async () => {
        try{
          const response = await FetchAllApireq();
          if(response.success){
            setReqdata([...response.data])
          }else{
            alert("No")
          }
        }catch (error){
          console.error("Failed to fetch User Data!", error);
        }
    }
    fechdata()
  },[])
  return (
    <div>
      {reqdata.length === 0 ? (
        <p className="text-slate-400">ไม่พบข้อมูล</p>
      ):(
        <ul className="space-y-3">
          {reqdata.map(r => (
            <li key={r.id} className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm">
              <div><span className="font-semibold">ID:</span> {r.id}</div>
              <div><span className="font-semibold">ชื่อผู้ยื่น:</span> {r.requester_name}</div>
              <div><span className="font-semibold">อีเมล:</span> {r.requester_email}</div>
              <div><span className="font-semibold">ระบบ/โครงการ:</span> {r.project_name}</div>
              <div><span className="font-semibold">สถานะ:</span> {r.status}</div>
              <div><span className="font-semibold">สร้างเมื่อ:</span> {r.created_at}</div>
              <div>
                <div>ดูเอกสาร</div>
              {
                r.attachments.map(i =>(
                  <div key={i.name}>
                    <p>ชื่อ:{i.name}</p>
                    <p>ลิงค์:{i.path}</p>
                  </div>
                ))
              }
              </div>
            </li>
          ))}
        </ul>
      )

      }
    </div>
  )
}

export default RequestsAdmin