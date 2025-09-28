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
    status: "approved" | "rejected",
    note?: string
    ) {
    const t = await getTransporter();
    const subject = `[MyApp] Request ${status}`;
    const text = `Your request has been ${status}.${note ? " Note: " + note : ""}`;
    const html = `
        <p>Your request has been <b>${status}</b>.</p>
        ${note ? `<p>Note: ${note}</p>` : ""}
    `;

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