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
  const res = await apiClient.get<userRequestRes>('/users/fetchusers')
  return res.data
}


export interface approveRequest {
  userId: number;
  appove: boolean
}
export const appoveUser = async (payload: approveRequest): Promise<approveRequest> => {
  const res = await apiClient.post<approveRequest>('/users/approve',payload)
  return res.data
}