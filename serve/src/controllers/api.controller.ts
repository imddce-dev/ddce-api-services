import { Context } from 'hono';
import { DrizzleDB } from '../configs/type';
import * as path from 'path';
import { minioClient } from '../configs/minio';
import * as apiModel  from '../models/api.model'

export const creatApiReq = async (c: Context) => {
  try {
    const db = c.get('db') as DrizzleDB;
    const form = await c.req.formData();
    const data = {
      requesterName: form.get('requesterName') as string,
      requesterEmail: form.get('requesterEmail') as string,
      requesterPhone: form.get('requesterPhone') as string,
      organizerName: form.get('organizerName') as string,
      agree: form.get('agree') === 'true',
      allowedIPs: form.get('allowedIPs') as string,
      authMethod: form.get('authMethod') as string,
      callbackUrl: form.get('callbackUrl') as string,
      dataFormat: form.get('dataFormat') as string,
      dataSource: form.get('dataSource') as string,
      description: form.get('description') as string,
      projectName: form.get('projectName') as string,
      purpose: form.get('purpose') as string,
      rateLimitPerMinute: form.get('rateLimitPerMinute')
        ? Number(form.get('rateLimitPerMinute'))
        : 60,
      retentionDays: form.get('retentionDays')
        ? Number(form.get('retentionDays'))
        : 30,
      userRecord: Number(form.get('userRecord'))
    };


    const attachments: any[] = [];
    const files = form.getAll('authAttachment[]') as File[];

    for (const f of files) {

      const originalName = f.name || (f as any).filename || 'upload';
      let ext = path.extname(originalName);

      if (!ext && f.type) {
        if (f.type.includes('wordprocessingml')) ext = '.docx';
        else if (f.type === 'application/pdf') ext = '.pdf';
        else if (f.type.startsWith('image/')) ext = '.' + f.type.split('/')[1];
      }
      const  newname = "attachments"
      const base = path.basename(newname, ext) || 'upload';
      const filename = `${base}-${Date.now()}${ext}`;
      const buffer = await f.arrayBuffer();
      const key = `attachments/${filename}`;

      await minioClient.putObject('documents', key, Buffer.from(buffer));

      attachments.push({
        fileName: filename,
        fileSize: f.size,
        fileLastModified: f.lastModified ? new Date(f.lastModified) : new Date(),
        filePath: key
      });
    }

    
     const result = await apiModel.createApiRequest(db,data,attachments)

     if(!result.success){
      return c.json(result,400)
     }

    return c.json(result, 201);

  } catch (error: any) {
    console.log(error);
    return c.json(
      {
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An internal server error occurred.',
      },
      500
    );
  }
};


export const EvenApiByID = async(c: Context)=> {
  try{

    const db =  c.get('db') as DrizzleDB
    const id = Number(c.req.param('id'))

    if(isNaN(id)){
       return c.json(
        { success: false, message: "ID ไม่ถูกต้อง" },
        400
      );
    }

    const result = await apiModel.fetchRequestById(db,id)
    
    if(result.success === false){
      return c.json({
        success: false,
        message: result.message
      },500)
    }
    return c.json({
      success: true,
      data: result.data
  },200)
      
  }catch(error : any){
    console.log(error)
    return c.json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An internal server error occurred.',
    },500)
  }
}

export const FetchEventApi = async (c: Context) => {
  try{

    const db = c.get('db') as DrizzleDB
    const result = await apiModel.fetchRequest(db)

     if(result.success === false){
      return c.json({
        success: false,
        message: result.message
      },500)
    }

    return c.json({
      success: true,
      data: result.data
    })
    

  }catch (error : any){
    console.log(error)
    return c.json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An internal server error occurred.',
    },500)
  }
}
export const updatStatusApi = async (c: Context) => {
  try{
     const db = c.get('db') as DrizzleDB
     const body = await c.req.json() 
     const eventId = Number(body.eventId);
     const status =  body.status
     console.log(eventId)
     const result = await apiModel.updatStatusApi(db, eventId, status)

     if(result.success === false){
        if(result.code === "NOT_FOUND"){
            return c.json({
              success : false,
              message: result.message
            },404)
        }else{
            return c.json({
              success : false,
              message: result.message
            },400)
        }
     }

    return c.json({
      success: true,
      message: result.message
    },200)

  }catch (error : any){
    console.log(error)
    return c.json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || 'An internal server error occurred.'
    },500)
  }
}

export const updateDataRequest = async (c:Context) => {
  try{
    const db = c.get('db') as DrizzleDB
    const body = await c.req.json()

    const result = await apiModel.updateDataRequest(db,body)
    if(result.success === false){
      if(result.code === "NOT_FOUND"){
        return c.json({
          success: false,
          message: result.message
        },404)
      }else{
        return c.json({
          success: false,
          message: result.message
        },400)
      }
    }

    return c.json({
      success:true,
      message: result.message
    },200)

  }catch (error : any){
    console.log(error)
    return c.json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || 'An internal server error occurred.'
    },500)
  }
}

export const deleteDataRequest = async (c: Context) => {
  try{

    const db = c.get('db') as DrizzleDB
    const id = Number(c.req.param('id'))

    if(isNaN(id)){
       return c.json(
        { success: false, message: "ID ไม่ถูกต้อง" },
        400
      );
    }

    const result = await apiModel.deleteRequest(db,id)

    if(result.success === false){
      if(result.code === 'NOT_FOUND'){
        return c.json({
          success: false,
          message: result.message
        },404)
      }else{
        return c.json({
          success: false,
          message: result.message
        },400)
      }
    }

    return c.json({
        success: true,
    },200)


  }catch (error : any) {
    console.log(error)
    return c.json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || 'An internal server error occurred.'
    },500)
  }
}