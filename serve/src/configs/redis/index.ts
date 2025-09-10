import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;
export const connectRedis = async () => {
  if (!redisClient) {
    const client = createClient({
      url: 'redis://' + (process.env.REDIS_HOST || 'localhost') + ':' + (process.env.REDIS_PORT || '6379'),
    });

    client.on('error', (err) => console.error('Redis Client Error', err));
    
    await client.connect();
    
    redisClient = client as RedisClientType;
    console.log('Redis connected successfully.');
  }
  return redisClient;
};


export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis first.');
  }
  return redisClient;
};
