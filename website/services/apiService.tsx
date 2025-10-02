import apiClient from './apiConfig';

interface ApiRequest {
  requesterName:        string;
  requesterEmail:       string;
  requesterPhone:       string;
  organizerName:        string;
  agree:                boolean;
  allowedIPs:           string;
  authAttachment:       File[];   // upload file(s)
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
     
/*-----------------------------ดึง users ทั้งหมด------------------------------------------------------------ */
export interface userRequest {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  organizeId: string;
  organizeName: string;
  appove: boolean;
  appoveAt: string
  createAt: string
  status: string;
}


export interface userRequestRes {
  success: boolean;
  data: userRequest[]
}
export const fetchUsers = async (): Promise<userRequestRes> => {
  const res = await apiClient.get<userRequestRes>('/users/fetchusers',{
    headers:{
       "Cache-Control": "no-store"
    }
  })
  return res.data
}
/*------------------------------------อนุมัติ----------------------------------------------------- */
export interface approveRequest {
  userId: number;
  appove: boolean
}
export const appoveUser = async (payload: approveRequest): Promise<approveRequest> => {
  const res = await apiClient.post<approveRequest>('/users/approve',payload)
  return res.data
}
/*---------------------------------อัพเดท-------------------------------------------------------- */
export interface updateRequest {
  userId: number;
  fullname: string;
  phone: string;
  email: string
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
   userId: number;
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