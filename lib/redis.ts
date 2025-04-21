import Redis from "ioredis";

export function getRedisClient() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log("REDIS_URL is not set");
    return null;
  } else {
    console.log("Connecting to Redis");
    return new Redis(redisUrl);
  }
}

const redisClient = getRedisClient();

export function getCache(key: string) {
  if (!redisClient) {
    return null;
  }

  return redisClient.get(key);
}

export function setCache(key: string, value: string, expiration?: number) {
  if (!redisClient) {
    return null;
  }

  if (expiration) {
    return redisClient.set(key, value, "EX", expiration);
  } else {
    return redisClient.set(key, value);
  }
}
