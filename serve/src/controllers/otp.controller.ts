import { verify } from 'hono/jwt';
import { Context } from "hono";
import { DrizzleDB } from "../configs/type";
import * as otpModel from '../models/otp.model'
import { setCookie } from 'hono/cookie';


export const otpVertiKey = async(c: Context) => {
    try{
        const db = c.get('db') as DrizzleDB
        const id = Number(c.req.param('id'))
         if(!id){
            return c.json({
                success : false,
                message : "no parameter" 
            },401)
        }
       
        const result = await otpModel.otpKey(db, id)
        if(result.success === false){
            if(result.code === 'NOT_FOUND'){
                return c.json({
                    success: false ,
                    message: result.message
                },404)
            }else{
                return c.json({
                    success: false,
                    mesage: result.message

                },400)
            }
        }
        return c.json({
            success: true,
            message: "Generate OTP Success !",
            data: result.data
        },200)
    }catch (error : any){
        console.log(error)
        return c.json({
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'An internal server error occurred.',
        },500)
    }
}

export const verifyTokenKey = async (c: Context) => {
    try{
        const db = c.get('db') as DrizzleDB
        const body = await c.req.json()
        const code =    body.code
        const eventId = body.eventId
        const ref =     body.ref

        if (!code || !eventId || !ref){
            return c.json({
                success :false,
                code: "NOT_FOUND_PARAMETER",
                messasge: "This parameter does not exist"
            },404)
        }

        const result = await otpModel.vertifyOtpKey(db, code , eventId, ref)

        if(result.success === false){
            return c.json({
                success: false,
                message: result.message
            },400)
        }

        return c.json ({
            success: true,
            data : result.data
        },200)

    }catch(error : any){
        console.log("error Veryify Token Temp.. !")
        return c.json({
            success: false ,
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || 'An internal server error occurred.'
        },500)
    }
}