import { promises } from 'dns';
import apiClient from './apiConfig';
import { error } from 'console';

export interface ApiRequest {
  requesterName:        string;
  requesterEmail:       string;
  requesterPhone:       string;
  organizerName:        string;
  agree:                boolean;
  allowedIPs:           string;
  authAttachment:       File[];   
  authMethod:           string;
  callbackUrl:          string;
  dataFormat:           string;
  dataSource:           string;
  description:          string;
  projectName:          string;
  purpose:              string;
  rateLimitPerMinute:   number;
  retentionDays:        number;
  scopes:               string[];
}
interface apiRequestRes {
  success: boolean;
  code: string;
  data: ApiRequest[];
}

export const createApiRequest = async (
  data: FormData
): Promise<apiRequestRes> => {
  const apiRes = await apiClient.post<apiRequestRes>(
    "/options/api-request",
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return apiRes.data;
};
 
/*-----------------------------ดึง Api Request ตาม users ------------------------------------------------------------ */
export interface ApiReqData {
  id:                     number,
  requester_name:         string,
  requester_email:        string,
  requester_phone:        string,
  organizer_name:         string,
  agree:                  boolean,
  allowed_ips:            string,
  auth_method:            string,
  callback_url:           string,
  data_format:            string,
  data_source:            string,
  description:            string,
  project_name:           string,
  purpose:                string,
  rate_limit_per_minute:  number,
  retention_days:         number,
  user_record:            number,
  status:                 string,
  created_at:             string,
  updated_at:             string,
}

interface ApiReqRes {
  success:                boolean,
  code?:                  string,
  message?:               string, 
  data:                   ApiReqData[]
}

export const FetchApiReqById = async(id: number): Promise<ApiReqRes> => {
    try{
        const resp = await apiClient.get<ApiReqRes>(`/options/api-request/${id}`,{
          headers:{
            "Cache-Control": "no-store"
          }
        })
        return resp.data
    }catch(err : any){
        console.error("Fetch Events Api error:", err);
        throw new Error(
          err.response?.data?.message || "ไม่สามารถกึงข้อมูลได้"
        );
    }
}

/*-----------------------------ดึง Api Request ทั้งหมด------------------------------------------------------------ */
/*-----------------------ดึง interface ApiReqData ApiReqRes------------------------------------------------------*/

export const FetchAllApireq = async(): Promise<ApiReqRes> => {
  try{
      const resp = await apiClient.get<ApiReqRes>('/options/api-request',{
        headers:{
          "Cache-Control": "no-store"
        }
      })
      return resp.data

  }catch (error :any){
      console.error("Fetch Events Api error:", error)
      throw new Error(
          error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้"
        );
  }
}
/*-----------------------------อัพเดท Api Request ------------------------------------------------------------ */
/*-----------------------ดึง interface ApiReqData------------------------------------------------------*/
export const updateApiReq = async(payload:ApiReqData): Promise<ApiReqData> => {
    try{
      const resp = await apiClient.put<ApiReqData>('/options/api-request',payload)
      return resp.data
    }catch (error :any){
      console.error("Update Events Api error:", error)
      throw new Error(
          error.response?.data?.message || "เกิดข้อผิดพลาดไม่สามารถทำรายการได้"
        );
  }
}
/*-----------------------------อนุมัติ คำขอ api------------------------------------------------------------ */
export interface approveApi {
  eventId:           number;
  status:            string;
}

export const appoveApi = async (payload:approveApi): Promise<approveApi> => {
  try{
    const resp = await apiClient.put<approveApi>('/options/approve-request',payload)
    return resp.data

  }catch(err : any){
    console.error("Approve Error:",err)
    throw new Error(
      err.response?.data?.message || "เกิดข้อผิดพลาดไม่สามารถทำรายการได้"
    )
  }
}

/*-----------------------------ลบคำขอ api------------------------------------------------------------ */
export interface deleteApiData {
  id: number;
}

export const deleteApi = async (id: number): Promise<deleteApiData> => {
    try{

      const resp = await apiClient.delete<deleteApiData>(`/options/api-request/${id}`)
      return resp.data

    }catch(err : any){
      console.error("Delete Error:",err)
      throw new Error(
        err.response?.data?.message || "เกิดข้อผิดพลาดไม่สามารถทำรายการได้"
      )
    }
}



/*-----------------------------ดึง users ทั้งหมด------------------------------------------------------------ */
export interface userRequest {
  id:           number;
  fullname:     string;
  username:     string;
  email:        string;
  phone:        string;
  organizeId:   string;
  organizeName: string;
  appove:       boolean;
  appoveAt:     string
  createAt:     string
  status:       string;
}

export interface userRequestRes {
  success:      boolean;
  data:         userRequest[]
}

export const fetchUsers = async (): Promise<userRequestRes> => {
  const res = await apiClient.get<userRequestRes>('/users/fetchusers',{
    headers:{
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    }
  })
  return res.data
}
/*------------------------------------อนุมัติ----------------------------------------------------- */
export interface approveRequest {
  userId:       number;
  appove:       boolean
}
export const appoveUser = async (payload: approveRequest): Promise<approveRequest> => {
  const res = await apiClient.post<approveRequest>('/users/approve',payload)
  return res.data
}
/*---------------------------------อัพเดท-------------------------------------------------------- */
export interface updateRequest {
  userId:       number;
  fullname:     string;
  phone:        string;
  email:        string
}
export const updateUsers = async ( paylaod: updateRequest): Promise<updateRequest> => {
  try{
    const resp = await apiClient.put<updateRequest>('/users/update-user',paylaod)
    return resp.data
  }catch (error : any){
    console.error("Update user error:", error);
    throw new Error(
      error.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้"
    );
  }
}

/*-----------------------------------ลบ user------------------------------------------------------ */
export interface RemoveRequest {
   userId:      number;
}
export const deleteUser = async (userId: number): Promise<RemoveRequest> => {
  try{
    const resp = await apiClient.delete<RemoveRequest>('/users/delete-user',{
      data:{userId},
    })
    return resp.data
    
  }catch (error : any){
    console.error("Update user error:", error);
    throw new Error(
      error.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้"
    );
  }
}