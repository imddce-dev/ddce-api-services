import { Context } from 'hono';
import { DrizzleDB } from '../configs/type';
import * as path from 'path';
import { minioClient } from '../configs/minio';
import * as apiModel  from '../models/api.model'
import { deleteCookie } from 'hono/cookie';

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
      const key = `documents/attachments/${filename}`;

      await minioClient.putObject('fileebs', key, Buffer.from(buffer));

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
     const result = await apiModel.updateStatusApi(db, eventId, status)

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

export const getApikeyByToken = async (c: Context) => {
  try {
    const db = c.get("db") as DrizzleDB;
    const tempAuth = c.get("tempAuth");
    const id = Number(tempAuth?.id);

    if (!id || isNaN(id)) {
      return c.html(`
        <div style="font-family:sans-serif; padding:2rem;">
          <h3 style="color:#e11d48;">ไม่พบข้อมูลการขอสิทธิ์ชั่วคราว</h3>
        </div>
      `, 400);
    }

    const result = await apiModel.getApikeyByRequestId(db, id);

    if (result.success === false) {
      return c.html(`
        <div style="font-family:sans-serif; padding:2rem;">
          <h3 style="color:#e11d48;">${result.message}</h3>
        </div>
      `, result.code === "NOT_FOUND" ? 404 : 400);
    }
    if (!result.data) {
      return c.html(`
        <div style="font-family:sans-serif; padding:2rem;">
          <h3 style="color:#e11d48;">ไม่พบข้อมูล API Key</h3>
        </div>
      `, 404);
    }
    const apiKey = result.data.clientId;
    const url = result.data.url;
    const secret = result.data.secretKey;

    return c.html(`
      <html lang="th">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>API Key Viewer</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body {
          background: #0f172a;
          color: #e2e8f0;
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .card {
          width: 100%;
        }
        .field {
          margin-bottom: 1.2rem;
        }

        .label {
          font-size: 1rem;
          text-transform: uppercase;
          color: #fff;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }

        .input-row {
          display: flex;
          align-items: center;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          justify-content: space-between;
        }

        .input-value {
          color: #cbd5e1;
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 270px;
        }

        .btn-copy, .btn-show {
          color: #14b8a6;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          background: none;
          border: none;
          outline: none;
          transition: color 0.2s;
        }

        .btn-copy:hover, .btn-show:hover {
          color: #2dd4bf;
        }

        small {
          color: #64748b;
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="field">
          <div class="label">API URL</div>
          <div class="input-row">
            <div class="input-value" id="url">${url}</div>
          </div>
        </div>

        <div class="field">
          <div class="label">Client ID</div>
          <div class="input-row">
            <div class="input-value" id="clientId">${apiKey}</div>
            
          </div>
        </div>

        <div class="field">
          <div class="label">Secret Key</div>
          <div class="input-row">
            <div class="input-value" id="secret">${secret}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `);
  } catch (error: any) {
    console.error(error);
    return c.html(`
      <div style="font-family:sans-serif; padding:2rem;">
        <h3 style="color:#e11d48;">เกิดข้อผิดพลาดภายในระบบ</h3>
        <p>${error.message || "An internal server error occurred."}</p>
      </div>
    `, 500);
  }
};

export const RemoveTokenTemp = async (c: Context) => {
    deleteCookie(c, 'token_temp',{
      path: '/',
      secure: true,
      sameSite: 'None',
    })

    return c.json({
      success: true,
      message: "ลบ Token ชั่วคราวเรียบร้อย"
    },200)
}