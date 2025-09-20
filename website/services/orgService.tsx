import apiClient from './apiConfig';

export interface Organization {
  id: number;
  name: string;
}
export interface OrgApiResponse {
  success: boolean;
  data: Organization[];
}

export const getOrg = async (): Promise<OrgApiResponse> => {
  const apiResponse = await apiClient.get<OrgApiResponse>('/org');
  return apiResponse.data;
};