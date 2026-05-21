import { createClient } from 'redis';
import { config } from '../config/env.js';

let redisClient = null;

export const initRedis = async () => {
  try {
    redisClient = createClient({ url: config.REDIS_URL });
    redisClient.on('error', err => console.log(' Redis error:', err));
    await redisClient.connect();
    console.log('Redis connected');
  } catch (error) {
    console.log(' Redis connection failed, OTP features will be limited:', error.message);
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = async (email, otp) => {
  try {
    if (redisClient) {
      await redisClient.setEx(`otp:${email}`, 600, otp); // 10 minutes
      return true;
    }
    return false;
  } catch (error) {
    console.error('[v0] Error storing OTP:', error);
    return false;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    if (redisClient) {
      const storedOTP = await redisClient.get(`otp:${email}`);
      if (storedOTP === otp) {
        await redisClient.del(`otp:${email}`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};

export default {
  initRedis,
  generateOTP,
  storeOTP,
  verifyOTP,
};
