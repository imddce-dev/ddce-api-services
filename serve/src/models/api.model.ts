
import { api_keys, api_notification, url_api, organizer, users, api_key_limits } from './../configs/mysql/schema';
import { sendApprovalApi } from '../utils/nodemailer';
import { DrizzleDB } from '../configs/type';
import { apiRequests, apiRequestAttachments } from '../configs/mysql/schema';
import { desc, eq, sql,and } from 'drizzle-orm';
import { generateClientKey,generateSecretKey, encrypt, decrypt} from '../utils/hmactoken';

const BASE_URL = "https://api-service-ddce.ddc.moph.go.th/";

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



export const fetchRequest = async (db: DrizzleDB) => {
  try {
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
        attachments: sql`
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'name', a.file_name,
                'path', CONCAT(${BASE_URL}, a.file_path)
              )
            )
            FROM ${apiRequestAttachments} AS a
            WHERE a.api_request_id = ${apiRequests}.id
            LIMIT 2
          )
        `.as("attachments"),
      })
      .from(apiRequests)
      .orderBy(desc(apiRequests.id));

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Error Fetch events Request:", err);
    return {
      success: false,
      code: "UNKNOWN_ERROR",
      message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
    };
  }
};

const VALID_STATUS = ["sending", "pending", "active", "inactive", "denied"] as const;
type StatusType = typeof VALID_STATUS[number];

export const updateStatusApi = async (db: DrizzleDB, eventId: number, status: StatusType) => {
  try {
    if (!VALID_STATUS.includes(status)) {
      return {
        success: false,
        code: "INVALID_STATUS",
        message: `สถานะไม่ถูกต้อง ต้องเป็นหนึ่งใน: ${VALID_STATUS.join(", ")}`,
      };
    }

    const chkEvents = await db.query.apiRequests.findFirst({
      where: eq(apiRequests.id, eventId),
    });

    if (!chkEvents) {
      return {
        success: false,
        code: "NOT_FOUND",
        message: "ไม่พบ Event ID ที่ต้องการ",
      };
    }

    if (chkEvents.status === status) {
      return {
        success: true,
        message: `สถานะยังคงเป็น '${status}' อยู่แล้ว`,
      };
    }

    if (["active", "denied"].includes(chkEvents.status)) {
      await db
        .update(apiRequests)
        .set({ status })
        .where(eq(apiRequests.id, eventId));

      return {
        success: true,
        message: `สถานะเดิมคือ '${chkEvents.status}' จึงไม่ส่งอีเมลซ้ำ`,
      };
    }

    const result = await db.transaction(async (tx) => {
      await tx
        .update(apiRequests)
        .set({ status })
        .where(eq(apiRequests.id, eventId));

      const checkNoti = await tx.query.api_notification.findFirst({
        where: eq(api_notification.eventId, eventId),
      });

      if (!checkNoti && (status === "active" || status === "denied")) {
        await tx.insert(api_notification).values({
          eventId,
          sendMail: chkEvents.requesterEmail,
        });
      }

      return { updated: true, hadNoti: !!checkNoti };
    });

    await sendApprovalApi({
      to: chkEvents.requesterEmail || "",
      status,
      username: chkEvents.requesterName,
      requestId: eventId,
    });

    return {
      success: true,
      message: `อัปเดตสถานะเป็น '${status}' สำเร็จ`,
      transaction: result,
    };

  } catch (error) {
    console.error("Error Update Status Request:", error);
    return {
      success: false,
      code: "UNKNOWN_ERROR",
      message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
    };
  }
};

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


export const getApikeyByRequestId = async(db:DrizzleDB, requestId:number) =>{
  try{
    const currentId = await db.query.apiRequests.findFirst({
      where: eq(apiRequests.id, requestId)
    })
    if(!currentId){
      return{
        success: false,
        code:"NOT_FOUND",
        message:"Not Match Id Events"
      }
    }
    if(currentId.status !== "active"){
      return{
        success: false,
        code:"REQUEST_NOT_ACTIVE",
        message:"คำขอของคุณยังไม่ได้รับการอนุมัติ"
      }
    }
    const url = await db.query.url_api.findFirst({
      where: eq(url_api.usage, currentId.dataSource as 'mebs2' | 'ebs_province' | 'ebs_ddc')
    })
    if(!url){
      return{
        success: false,
        code:"URL_NOT_FOUND",
        message:"ไม่พบ URL สำหรับคำขอนี้"
      }
    }

    const apikey = await db.query.api_keys.findFirst({
      where: eq(api_keys.event_id, requestId)
    })
    if(!apikey){
      return{
        success: false,
        code:"APIKEY_NOT_FOUND",
        message:"ไม่พบ API Key สำหรับคำขอนี้"
      }
    }
    const decryptedClientKey = decrypt(apikey.client_key);
    const decryptedSecretKey = decrypt(apikey.secret_key);

    return{
      success: true,
      data: {
        url: url.url,
        clientId: decryptedClientKey,
        secretKey: decryptedSecretKey
      }
    }
    
  }catch(error){
    console.log("Error Get API Key By Request Id:",error)
    return{
      success: false,
      code:"UNKNOWN_ERROR",
      message:"เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่"
    }
  }
}

export const createApiKey = async(db:DrizzleDB, eventId: number) =>{
  try{
    const currentEvent = await db.query.apiRequests.findFirst({
      where: eq(apiRequests.id, eventId)
    })
    if(!currentEvent){
      return{
        success: false,
        code:"NOT_FOUND",
        message:"Not Match Id Events"
      }
    }
    if(currentEvent.status !== "active"){
      return{
        success: false,
        code:"REQUEST_NOT_ACTIVE",
        message:"คำขอของคุณยังไม่ได้รับการอนุมัติ"
      }
    }
    const existingKey = await db.query.api_keys.findFirst({
      where: and(
        eq(api_keys.event_id, eventId),
        eq(api_keys.status, 'active')
      )
    });
    if (existingKey && existingKey.expiresAt > new Date()) {
      return { success: false, code: "KEY_EXISTS", message: "Event นี้มี API Key ที่ยัง Active อยู่" };
    }
    const currentOrganize = await db.query.organizer.findFirst({  
      where: eq(organizer.name, currentEvent.organizerName || "")
    })
    if(!currentOrganize){ 
      return{
        success: false,
        code:"ORGANIZE_NOT_FOUND",
        message:"ไม่พบข้อมูลผู้จัดงานสำหรับคำขอนี้"
      }
    }

  const tx = await db.transaction(async (tx) => {
    const RawClientKey = generateClientKey(24);
    const RawSecretKey = generateSecretKey(48);
    const encryptedClientKey = encrypt(RawClientKey);
    const encryptedSecretKey = encrypt(RawSecretKey);
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6); 


    await tx.insert(api_keys).values({
      user_id: currentEvent.userRecord,
      event_id: eventId,
      organize_id: currentOrganize.id,
      client_key: encryptedClientKey,
      secret_key: encryptedSecretKey,
      expiresAt: expirationDate,
    })

    const currentApiKey = await tx.query.api_keys.findFirst({
      where: eq(api_keys.event_id,eventId)
    })
    if(!currentApiKey?.id){
        return{
          success: false,
          code:"APIKEY_NOT_FOUND",
          message:"ไม่พบข้อมูลผู้จัดงานสำหรับคำขอนี้"
        }
    }

    const currentLimit = await tx.query.api_key_limits.findFirst({
      where: eq(api_key_limits.api_key_id, currentApiKey?.id)
    })
    
    let route_prefix = "";
    if(currentEvent.dataSource === 'ebs_ddc'){
      route_prefix = "/api/v1/ebs"
    }else if(currentEvent.dataSource === 'mebs2'){
      route_prefix = "/api/v1/mebs"
    }else{
      route_prefix = "/api/v1/ebs_province"
    }
    const api_key_id = currentApiKey?.id
    const per_min = 60 
    const burst = 0

    await tx.insert(api_key_limits).values({
      api_key_id: api_key_id,
      route_prefix: route_prefix,
      per_min: per_min,
      burst: burst
    })

     return{
      success: true,
      data: {
        clientKey: RawClientKey,
        secretKey: RawSecretKey,
        expiresAt: expirationDate
      }
    }
  })
   return { success: true, data: tx };
   
  }catch(error){
    console.log("Error Create API Key:",error)
    return{
      success: false,
      code:"UNKNOWN_ERROR",
      message:"เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่"
    }
  }
} 
