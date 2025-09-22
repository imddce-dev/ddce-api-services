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