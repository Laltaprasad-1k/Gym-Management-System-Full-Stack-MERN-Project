import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fithub',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  RABBITMQ_URL: process.env.RABBITMQ_URL|| 'amqp://localhost',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_SYDF3ATKs6rElb',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'BY1FtxliUwSCXsuZ5n2lNIrH',
  EMAIL_USER: process.env.SMTP_EMAIL || 'lalataprasad664@gmail.com',
  EMAIL_PASS: process.env.SMTP_PASSWORD || 'bdpydrevbmceahnv',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  
};

export default config;
