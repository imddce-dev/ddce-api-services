import { getTransporter } from "../configs/mail"
function cleanTitle(fullName: string): string {
  return fullName.replace(/^(นาย|นางสาว|นาง|ดร\.|คุณ|Mr\.|Mrs\.|Ms\.)\s*/i, "").trim();
}

export async function sendMail(to: string, subject: string, html: string) {
    const t = await getTransporter();
    const info = await t.sendMail({
        from: `"IM-DDCE Service" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    })

    console.log("Message sent: %s", info.messageId)
    return info;
}

export async function sendOtpMail(to: string, subject: string, html: string){
    const t = await getTransporter();
    const info = await t.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
    })

     console.log("Message sent: %s", info.messageId)
    return info;
}

export async function sendApprovalMail(
  to: string,
  username: string,
  approved: boolean 
) {
  const t = await getTransporter();

  let subject = "";
  let text = "";
  let html = "";

  if (approved) {
    subject = `[DDCE API SERVICE REQUEST] การอนุมัติสิทธิ์การใช้งานระบบ`;
    text = `เรียน ${username}

คำขอการใช้งานระบบ DDCE API SERVICE REQUEST ของท่าน ได้รับการ "อนุมัติ" แล้ว
ท่านสามารถเข้าสู่ระบบและใช้งานตามสิทธิ์ที่กำหนดได้ทันที

กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน
กรมควบคุมโรค`;
    html = `
  <p>เรียนคุณ <b>${username}</b>,</p>
  <p>
    คำขอการใช้งานระบบ <b>DDCE API SERVICE REQUEST</b> ของท่าน 
    <span style="color:green"><b>ได้รับการอนุมัติแล้ว</b></span>
  </p>
  <p>ท่านสามารถเข้าสู่ระบบและยืนสมัครขอใช้ระบบบริการ API ได้ที่ https://api-service-ddce.ddc.moph.go.th/</p>
  <br/>
  <p>
    กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน  กรมควบคุมโรค
  </p>

  <hr style="margin:20px 0; border:0; border-top:1px solid #ddd;" />

  <footer style="font-size:12px; color:#666; line-height:1.4;">
    <p>
      อีเมลฉบับนี้ถูกส่งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ<br/>
      หากมีข้อสงสัย โปรดติดต่อผู้ดูแลระบบ IM Helpdesk <br/>
      Line Official: @736znvyt | อีเมล: im.ddce@gmail.com
    </p>
  </footer>
`;
  } else {
    subject = `[DDCE API SERVICE REQUEST] ผลการพิจารณาคำขอใช้งาน`;
    text = `เรียน ${username}

คำขอการใช้งานระบบ DDCE API SERVICE REQUEST ของท่าน "ไม่ผ่านการอนุมัติ"
หากมีข้อสงสัยกรุณาติดต่อผู้ดูแลระบบ

กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน
กรมควบคุมโรค`;
    html = `
      <p>เรียนคุณ <b>${username}</b>,</p>
      <p>คำขอการใช้งานระบบ <b>DDCE API SERVICE REQUEST</b> ของท่าน 
      <span style="color:red"><b>ไม่ผ่านการอนุมัติ</b></span></p>
      <p>หากมีข้อสงสัยกรุณาติดต่อผู้ดูแลระบบ</p>
      <br/>
  <p>
    กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน<br/>
    กรมควบคุมโรค
  </p>

  <hr style="margin:20px 0; border:0; border-top:1px solid #ddd;" />

  <footer style="font-size:12px; color:#666; line-height:1.4;">
    <p>
      อีเมลฉบับนี้ถูกส่งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ<br/>
      หากมีข้อสงสัย โปรดติดต่อผู้ดูแลระบบ IM Helpdesk <br/>
      Line Official: @736znvyt | อีเมล: im.ddce@gmail.com
    </p>
  </footer>
    `;
  }

  const info = await t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}


export async function sendApprovalApi({
  to,
  status,
  username,
  requestId
}: {
  to: string;
  status: string;
  username: string;
  requestId: number;
}) {
  const t = await getTransporter();
  const Newname = cleanTitle(username); 
  const requestNo = requestId.toString().padStart(6, "0");

  let subject = "";
  let bodyContent = "";

  switch (status) {
    case "pending":
      subject = `รับคำขอใช้งานระบบ DDC API REQUEST แล้ว (หมายเลขคำขอ #${requestNo})`;
      bodyContent = `
        <p>เรียนคุณ <b>${Newname}</b>,</p>
        <p>
          ตามที่ท่านได้ดำเนินการยื่นคำขอใช้งานระบบ <b>DDC API REQUEST</b> 
          หมายเลขคำขอ <b>#${requestNo}</b> นั้น  
          ระบบได้ดำเนินการบันทึกคำขอของท่านเรียบร้อยแล้ว
        </p>
        <p>
          ขณะนี้เจ้าหน้าที่ที่เกี่ยวข้องจะดำเนินการตรวจสอบข้อมูลและพิจารณาอนุมัติการใช้งานตามขั้นตอนต่อไป  
          โปรดรอการแจ้งผลผ่านทางอีเมลฉบับนี้ในลำดับถัดไป
        </p>
        <p>
          จึงเรียนมาเพื่อโปรดทราบ และขอขอบคุณท่านที่ให้ความสนใจใช้บริการระบบ <b>DDC API REQUEST</b>
        </p>
      `;
      break;

    case "active":
      subject = `อนุมัติคำขอใช้งานระบบ DDC API REQUEST (หมายเลขคำขอ #${requestNo})`;
      bodyContent = `
        <p>เรียนคุณ <b>${Newname}</b>,</p>
        <p>
          คำขอใช้งานระบบ <b>DDC API REQUEST</b> หมายเลขคำขอ <b>#${requestNo}</b>  
          บัดนี้คำขอของท่านได้ผ่านการพิจารณาและ 
          <span style="color:green;"><b>ได้รับการอนุมัติให้ใช้งานเรียบร้อยแล้ว</b></span>
        </p>
        <p>
          ท่านสามารถเข้าสู่ระบบเพื่อใช้งานได้ตามสิทธิ์ที่ได้รับ  
          ทั้งนี้ ขอให้ท่านรักษาความปลอดภัยของบัญชีผู้ใช้งานและรหัสผ่านของท่านไว้เป็นความลับ  
          เพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต
        </p>
        <p>
          จึงเรียนมาเพื่อโปรดทราบ และขอขอบคุณที่ให้ความร่วมมือกับกรมควบคุมโรค
        </p>
      `;
      break;

    case "denied":
      subject = `ผลการพิจารณาคำขอใช้งานระบบ DDC API REQUEST (หมายเลขคำขอ #${requestNo})`;
      bodyContent = `
        <p>เรียนคุณ <b>${Newname}</b>,</p>
        <p>
          คำขอใช้งานระบบ <b>DDC API REQUEST</b> หมายเลขคำขอ <b>#${requestNo}</b>  
          หลังจากเจ้าหน้าที่ได้ตรวจสอบข้อมูลและพิจารณาคำขอแล้ว  
          ปรากฏว่า <span style="color:red;"><b>คำขอของท่านไม่ผ่านการอนุมัติ</b></span> 
          ในรอบการพิจารณานี้
        </p>
        <p>
          หากท่านประสงค์จะยื่นคำขอใหม่ กรุณาตรวจสอบความถูกต้องของข้อมูล  
          และดำเนินการยื่นคำขออีกครั้งผ่านระบบ <b>DDC API REQUEST</b> 
        </p>
        <p>
          หากต้องการสอบถามรายละเอียดเพิ่มเติม  
          โปรดติดต่อเจ้าหน้าที่ผู้ดูแลระบบตามช่องทางที่ระบุไว้ด้านล่าง
        </p>
      `;
      break;
  }

  const html = `
    <div style="font-family:'Sarabun', Tahoma, sans-serif; color:#222; background:#f5f7f8; padding:24px;">
      <div style="max-width:720px; margin:auto; background:white; padding:40px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="border-bottom:3px solid #006c35; padding-bottom:12px; margin-bottom:20px;">
          <img src="https://api-service-ddce.ddc.moph.go.th/fileebsprov/images/moph-logo.png" 
               alt="logo" width="70" style="vertical-align:middle; margin-right:10px;">
          <span style="font-size:20px; font-weight:bold; color:#006c35;">กรมควบคุมโรค กระทรวงสาธารณสุข</span><br/>
          <span style="font-size:14px; color:#555;">กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน (DDCE)</span>
        </div>

        <!-- Body -->
        ${bodyContent}

        <!-- Footer -->
        <footer style="font-size:12px; color:#666; line-height:1.6; margin-top:30px; border-top:1px solid #ddd; padding-top:10px;">
          <p>
            อีเมลฉบับนี้ถูกส่งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ<br/>
            หากมีข้อสงสัย โปรดติดต่อเจ้าหน้าที่ผู้ดูแลระบบ IM Helpdesk<br/>
            Line Official: <b>@736znvyt</b> | อีเมล: <a href="mailto:im.ddce@gmail.com">im.ddce@gmail.com</a>
          </p>
          <p style="font-size:11px; color:#999;">
            © กองควบคุมโรคและภัยสุขภาพในภาวะฉุกเฉิน (DDCE) กรมควบคุมโรค กระทรวงสาธารณสุข
          </p>
        </footer>
      </div>
    </div>
  `;

  const info = await t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });

  console.log(`📧 [DDC API] Sent  mail to ${to}`);
  return info;
}


//Send otp For Watch API KEYS
export async function SendOtpOfKey({
 to,
 id,
 code,
 ref,
 fullname,
 expiredAt,
}:{
  to: string,
  id: number,
  code: string,
  ref: string,
  fullname: string,
  expiredAt: Date
}){
  const t = await getTransporter()
  const subject = "ส่งรหัสยืนยัน OTP เพื่อเข้าดู API KEY"
  const Newname = cleanTitle(fullname); 
  const requestNo = id.toString().padStart(6, "0");
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
            <h2>🔐 รหัส OTP สำหรับเข้าดู API KEYS</h2>
            <p>สวัสดีคุณ <b>${fullname}</b>,</p>
            <p>กรุณาใช้รหัส OTP ด้านล่างนี้เพื่อเข้าดู API KEY:</p>

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
  
  `
 const info = await t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
 })

  console.log(`📧 [DDC API] Sent mail to ${to}`)
  return info

}