import { DrizzleDB } from '../configs/type';
import { apiRequests, apiRequestAttachments } from '../configs/mysql/schema';

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



