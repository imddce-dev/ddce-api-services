import { DrizzleDB } from '../configs/type';
import { apiRequests, apiRequestAttachments } from '../configs/mysql/schema';
import { db } from '../configs/mysql';
import { eq } from 'drizzle-orm';

export type ApiRequestData = {
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  organizerName?: string;
  agree?: boolean;
  allowedIPs?: string;
  authMethod: string;
  callbackUrl?: string;
  dataFormat?: string;
  dataSource?: string;
  description?: string;
  projectName?: string;
  purpose?: string;
  rateLimitPerMinute?: number;
  retentionDays?: number;
  userRecord: number;
};

export type AttachmentInput = {
  fileName: string;
  fileSize?: number;
  fileLastModified?: Date;
  filePath?: string;
};

const defaultApiRequestData = {
  agree: false,
  dataFormat: "json",
  rateLimitPerMinute: 60,
  retentionDays: 30,
};


export const createApiRequest = async (
  db: DrizzleDB,
  data: ApiRequestData,
  attchs: AttachmentInput[]
) => {

  try {
      const result = await db.insert(apiRequests).values(data);
      const newId = result[0].insertId; 

      if (!newId) {
        return {
          success: false,
          code: "INSERT_FAILED",
          message: "สร้างคำขอไม่สำเร็จ กรุณาลองใหม่",
        };
      }

      if (attchs && attchs.length > 0) {
        for (const attch of attchs) {
            try{
              const newAtta = {...attch,apiRequestId: newId,};
              await db.insert(apiRequestAttachments).values(newAtta);
            }catch(error){
                console.log("Error creating API Request:", error);
                return {
                  success: false,
                  code: "INSERT_FAILED",
                  message: "สร้างคำขอไม่สำเร็จ กรุณาลองใหม่",
                };
            }
              
        }
      }
      return {
        success: true,
        code: "USER_CREATED",
        message: "กรุณารอผลอนุมัติภายใน 7 วันทำการ",
      };

  } catch (err: any) {
    console.log("Error creating API Request:", err);
    return {
      success: false,
      code: "UNKNOWN_ERROR",
      message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
    };
  }
};

export const fetchRequestById = async(db: DrizzleDB, currentId:number) => {
  try{
      const result = await db
       .select({
         id: apiRequests.id,
         requester_name: apiRequests.requesterName,
         requester_email: apiRequests.requesterEmail,
         requester_phone: apiRequests.requesterPhone,
         organizer_name: apiRequests.organizerName,
         agree: apiRequests.agree,
         allowed_ips: apiRequests.allowedIPs,
         auth_method: apiRequests.authMethod,
         callback_url: apiRequests.callbackUrl,
         data_format: apiRequests.dataFormat,
         data_source: apiRequests.dataSource,
         description: apiRequests.description,
         project_name: apiRequests.projectName,
         purpose: apiRequests.purpose,
         rate_limit_per_minute: apiRequests.rateLimitPerMinute,
         retention_days: apiRequests.retentionDays,
         user_record: apiRequests.userRecord,
         status: apiRequests.status,
         created_at: apiRequests.createdAt,
         updated_at: apiRequests.updatedAt,
       })
       .from(apiRequests)
       .where(eq(apiRequests.userRecord,currentId))

      return {
        success: true,
        data: result
      }

  }catch (err){
      console.log("Error Fetch events Request:", err)
      return {
        success: false,
        code: "UNKNOWN_ERROR",
        message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
      }
  }
}







