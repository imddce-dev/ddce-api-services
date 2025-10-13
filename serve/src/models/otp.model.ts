import { generateToken, generateTokenTemp, JWTPayloadTemp } from './../utils/authToken';
import { and, eq } from "drizzle-orm"
import { db } from "../configs/mysql"
import { customAlphabet } from "nanoid";
import  {apiRequests, otp_code as otpCode, users , otp_verify_key }  from '../configs/mysql/schema'
import   * as sendMail  from '../utils/nodemailer'
import { DrizzleDB } from '../configs/type';
import { mailQueue } from '../queue/mailQueue';

interface otpPayloads {
   username : string;
   email: string;
   code:string;
   ref:string;
   expiredAt: Date;
}

export const GenerOtp = async(username : string): Promise<otpPayloads | null> => {
  try{
    const exitingUser = await db
    .select({id: users.id,fullname: users.fullname, email: users.email})
    .from(users)
    .where(eq(users.username, username))
    
    if(exitingUser.length === 0){
      console.log("Username id Valid !")
      return null
    }
     const userId = exitingUser[0].id
     await db.delete(otpCode).where(eq(otpCode.userId, userId))
     const code = String(Math.floor(100000+Math.random()*900000))
     const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',6)
     const ref = nanoid()
     const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

     const email = exitingUser[0].email
     const fullname = exitingUser[0].fullname
     const subject = "ส่งรหัสยืนยัน OTP เพื่อเข้าสู่ระบบ DDCE API REQUEST"
     const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>OTP Verification</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                background: #f4f4f7;
                padding: 20px;
                color: #333;
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                background: #fff;
                border-radius: 10px;
                padding: 20px;
                border: 1px solid #ddd;
            }
            h2 {
                color: #2c7be5;
                text-align: center;
            }
            .otp {
                font-size: 32px;
                font-weight: bold;
                text-align: center;
                letter-spacing: 5px;
                margin: 20px 0;
                color: #e63946;
            }
            .info {
                font-size: 14px;
                margin: 10px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                text-align: center;
                color: #888;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h2>🔐 รหัส OTP สำหรับเข้าสู่ระบบ</h2>
            <p>สวัสดีคุณ <b>${fullname}</b>,</p>
            <p>กรุณาใช้รหัส OTP ด้านล่างนี้เพื่อยืนยันการเข้าสู่ระบบ:</p>

            <div class="otp">${code}</div>

            <div class="info">
                <p><b>Reference:</b> ${ref}</p>
                <p><b>หมดอายุ:</b> ${expiredAt.toLocaleString("th-TH", { hour12: false })}</p>
            </div>

            <p>หากคุณไม่ได้ทำการร้องขอนี้ กรุณาเพิกเฉยต่ออีเมลนี้</p>

            <div class="footer">
                © ${new Date().getFullYear()} DDCE API REQUEST
            </div>
            </div>
        </body>
        </html>
        `;

     await db.insert(otpCode).values({
        userId,
        code,
        ref,
        expiredAt
     })

     await sendMail.sendOtpMail(email,subject,html)

    return {username,email,code,ref,expiredAt}
  }catch (error){
    console.log('Error Generate OTP:', error)
    return null
  }
}

export const otpKey = async(db: DrizzleDB, id:number) => {
    try{
        const currentEvents = await db.query.apiRequests.findFirst({
            where: eq(apiRequests.id, id)
        })
        if(!currentEvents){
            return{
                success: false,
                code: "NOT_FOUND",
                message:"This event was not found."
            }
        }
        await db.delete(otp_verify_key).where(eq(otp_verify_key.eventId, id))
        const code = String(Math.floor(100000+Math.random()*900000))
        const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',6)
        const ref = nanoid()
        const to = currentEvents.requesterEmail
        const expiredAt =  new Date(Date.now() + 5 * 60 * 1000)
        const eventId = id
        const fullname = currentEvents.requesterName

        await db.insert(otp_verify_key).values({
            eventId,
            code,
            ref,
            expiredAt
        })
        await mailQueue.add("senfdOtpKey",{to,id,code,ref,fullname,expiredAt})
        return{
            success: true,
            data: {ref}
        }
    }catch (error){
        console.log('Error Generate OTP:', error)
        return {
            success:false,
            code: "UNKNOWN_ERROR",
            message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
        }
    }
}

export const vertifyOtpKey = async(db: DrizzleDB, code: string ,eventId : number, ref : string) => {
    try{
        const currentOtp = await db.query.otp_verify_key.findFirst({
            where: and(
                eq(otp_verify_key.code, code),
                eq(otp_verify_key.eventId, eventId),
                eq(otp_verify_key.ref, ref)
            )               
        })
        if(!currentOtp){
            return{
                success: false,
                code: "NOT_FOUND",
                message:"This event was not found."
            }
        }

        if (currentOtp.used) {
            return { success: false, code: "USED", message: "This OTP was already used." }
        }

        if (new Date(currentOtp.expiredAt) < new Date()) {
            return { success: false, code: "EXPIRED", message: "This OTP has expired." }
        }

        const payload:JWTPayloadTemp = {
            id : eventId,
            exp: Math.floor(Date.now() / 1000) + (5 * 60)
        }
        const token = await generateTokenTemp(payload)
        return{
            success: true,
            data: token
        }  
    }catch (error) { 
        console.log('Error Generate OTP:', error)
        return {
            success:false,
            code: "UNKNOWN_ERROR",
            message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
        }
    }
}

