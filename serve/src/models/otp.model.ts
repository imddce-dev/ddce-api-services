import { generateToken } from './../utils/authToken';
import { eq } from "drizzle-orm"
import { db } from "../configs/mysql"
import { customAlphabet } from "nanoid";
import  {apiRequests, otp_code as otpCode, users , otp_verify_key }  from '../configs/mysql/schema'
import   * as sendMail  from '../utils/nodemailer'
import { DrizzleDB } from '../configs/type';

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

export const otpVerifyKey = async(db: DrizzleDB, eventId:number) => {
    try{
        const currentEvents = await db.query.apiRequests.findFirst({
            where: eq(apiRequests.id, eventId)
        })
        if(!currentEvents){
            return{
                success: false,
                code: "NOT_FOUND",
                message:"This event was not found."
            }
        }
        await db.delete(otp_verify_key).where(eq(otp_verify_key.eventId,eventId))

    }catch (error){
        console.log('Error Generate OTP:', error)
        return {
            success:false
        }
    }
}
