import { getTransporter } from "../configs/mail"

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