"use server";

import Redis from "ioredis";

export async function getRedisClient() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log("REDIS_URL is not set");
    return null;
  } else {
    console.log("Connecting to Redis");
    return new Redis(redisUrl);
  }
}

const redisClient = await getRedisClient();

export async function getCache(key: string) {
  if (!redisClient) {
    return null;
  }

  return redisClient.get(key);
}

export async function setCache(
  key: string,
  value: string,
  expiration?: number
) {
  if (!redisClient) {
    return null;
  }

  if (expiration) {
    return redisClient.set(key, value, "EX", expiration);
  } else {
    return redisClient.set(key, value);
  }
}

export async function deleteCache(key: string) {
  if (!redisClient) {
    return null;
  }
  return redisClient.del(key);
}

export async function deleteCacheByPrefix(prefix: string) {
  if (!redisClient) {
    return null;
  }

  return redisClient.keys(`${prefix}*`).then((keys) => {
    if (keys.length > 0) {
      return redisClient.del(keys);
    }
    return null;
  });
}
