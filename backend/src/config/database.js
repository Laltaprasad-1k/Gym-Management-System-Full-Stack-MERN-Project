import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connecte');
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
