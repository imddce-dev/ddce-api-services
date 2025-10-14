import Redis from "ioredis";

export const  redisIORedis = new Redis({
    host: process.env.REDIS_HOST, 
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,     
    enableReadyCheck: false,   
})

redisIORedis.on("connect",() => console.log("Redis connected"))
redisIORedis.on("error",(err) => console.log("Redis error", err))
redisIORedis.on("close",() => console.log("Redis disconnected"))