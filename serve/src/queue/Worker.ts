import { Worker } from "bullmq";
import { redisIORedis } from "../utils/redisIORedis";
import * as sendMail  from "../utils/nodemailer";


const mailWorker = new Worker("mailQueue", async (job) => {
   const {name} = job.data;
   console.log(`🚀 เริ่มงาน ${job.id} ชื่อ: ${job.name}`);
   switch(job.name){
    case "sendApprovalApi":
        await sendMail.sendApprovalApi(job.data);
        break;
    case "senfdOtpKey":
        await sendMail.SendOtpOfKey(job.data);
        break;
    default:
        console.log("No job name match")
   }
},{    connection: redisIORedis,
       concurrency: 5,
});
mailWorker.on("completed", (job) => console.log(`✅ Job ${job.id} เสร็จสิ้น`));
mailWorker.on("failed", (job, err) => console.error(`❌ Job ${job?.id} ล้มเหลว:`, err));