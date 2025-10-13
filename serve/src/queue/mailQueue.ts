import { Queue } from "bullmq";
import { redisIORedis } from "../utils/redisIORedis";

export const mailQueue = new Queue("mailQueue", {
    connection: redisIORedis,
});
