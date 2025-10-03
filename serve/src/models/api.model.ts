
import { DrizzleDB } from '../configs/type';
import { apiRequests, apiRequestAttachments } from '../configs/mysql/schema';
import { desc, eq } from 'drizzle-orm';

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
export const fetchRequest = async(db:DrizzleDB) => {
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
        .orderBy(desc(apiRequests.id))

      return {
        success: true,
        data: result
      }

    }catch (err) {
       console.log("Error Fetch events Request:", err)
       return{
        success: false,
        code:"UNKNOWN_ERROR",
        message:"เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
       }
    }
}

const VALID_STATUS = ["sending", "pending", "active", "inactive", "denied"] as const;
type StatusType = typeof VALID_STATUS[number];

export const updatStatusApi = async(db: DrizzleDB, eventId:number, status:string) => {
  try{

     if(!VALID_STATUS.includes(status as StatusType)){
      return {
        success: false,
        code:"INVALID_STATUS",
         message: `สถานะไม่ถูกต้อง ต้องเป็นหนึ่งใน: ${VALID_STATUS.join(", ")}`,
      }
     }
     const chkEvents = await db.query.apiRequests.findFirst({
      where: eq(apiRequests.id,eventId)
     })
     if(!chkEvents){
      return {
        success:false,
        code:"NOT_FOUND",
        message:"Not Match Id Events"
      }
     }


     await db
     .update(apiRequests)
     .set({
      status: status
     })
     .where(eq(apiRequests.id,eventId))

    return {
      success:true,
      message:"update Success !"
    }

  }catch (error){
    console.log("Error Update Status Request:",error)
    return{
      success: false,
      code:"UNKNOWN_ERROR",
      message:"เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
    }
  }
}


export const updateDataRequest = async( 
  db: DrizzleDB,
  data:{
    id: number,
    requester_name: string,
    requester_email: string,
    requester_phone: string,
    allowed_ips: string,
    auth_method: string,
    callback_url: string,
    data_format: string,
    data_source: string,
    description: string,
    project_name: string,
    purpose: string,
    rate_limit_per_minute: number,
    retention_days: number,
  }
)=> {
  try{
    console.log(data.id)
     const chkEvent = await db.query.apiRequests.findFirst({
    where: eq(apiRequests.id, data.id)
  })
  if(!chkEvent){
    return {
      success: false,
      code:"NOT_FOUND",
      message:"Not Match Id Events"
    }
  }
  await db
    .update(apiRequests)
    .set({
      requesterName: data.requester_name,
      requesterEmail: data.requester_email,
      requesterPhone: data.requester_phone,
      allowedIPs: data.allowed_ips,
      authMethod: data.auth_method,
      callbackUrl: data.callback_url,
      dataFormat: data.data_format,
      dataSource: data.data_source,
      description: data.description,
      projectName: data.project_name,
      purpose: data.purpose,
      rateLimitPerMinute: Number(data.rate_limit_per_minute),
      retentionDays: Number(data.retention_days)
    })
    .where(eq(apiRequests.id, data.id))

  return { 
    success: true,
    message: "Update Data"
  }

  }catch (error){
    console.log("Error Update Status Request:",error)
    return{
      success: false,
      code:"UNKNOWN_ERROR",
      message:"เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
    }
  }
}


export const deleteRequest = async (db:DrizzleDB, eventId:number) =>{
  try{
      const CheckEvent = await db.query.apiRequests.findFirst({
        where: eq(apiRequests.id, eventId)
      })

     if(!CheckEvent){
      return{
        success: false,
        code: "NOT_FOUND",
        message:"Not Match Id Events"
      }
     }
    
     if(CheckEvent.status === 'active'){
      return{
        success: false,
        code: "EVENT_IS_ACTIVE",
        message: "Event Request Active"
      }
     }

      await db
      .delete(apiRequests)
      .where(eq(apiRequests.id, eventId))


      await db
      .delete(apiRequestAttachments)
      .where(eq(apiRequestAttachments.apiRequestId, eventId))


      return{
        success: true,
        Message: "Data Delete Successfully !"
      }

  }catch (error){
      console.log("Error Delete Event Request:",error)
      return{
        success: false,
        code:"UNKNOWN_ERROR",
        message:"เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่"
      }
  }
}

