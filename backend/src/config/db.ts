import mongoose from 'mongoose';

export const connectDB = async (uri?: string): Promise<typeof mongoose> => {
  const mongoUri =
    uri ||
    process.env.MONGODB_URI ||
    'mongodb+srv://Jagannath300:Jaga123mongodb@cluster0.rouoh.mongodb.net/campusconnect';
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected from database');
  } catch (error) {
    console.error('[MongoDB] Disconnect error:', error);
  }
};

