import mongoose from 'mongoose';
import { ENV } from './env';

export const connectMongo = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    console.warn(`[MongoDB] Primary connection unavailable (${error.message}). Using in-memory fallback storage.`);
  }
};

export const disconnectMongo = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected gracefully');
  } catch (error: any) {
    console.error(`[MongoDB] Disconnect error: ${error.message}`);
  }
};

export const isMongoConnected = (): boolean => mongoose.connection.readyState === 1;
