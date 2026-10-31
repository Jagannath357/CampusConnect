import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { hashPassword } from '../utils/password.js';

export const bootstrapAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@silicon.ac.in';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@Silicon2026';
    const adminName = process.env.INITIAL_ADMIN_NAME || 'Silicon Administrator';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const passwordHash = await hashPassword(adminPassword);
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        tokenVersion: 0,
      });

      console.log('✅ Initial Admin created successfully:');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('ℹ️ Admin account already exists:');
      console.log(`   Email: ${adminEmail}`);
      if (admin.role !== 'ADMIN') {
        admin.role = 'ADMIN';
        await admin.save();
        console.log('   Upgraded role to ADMIN.');
      }
    }

    return admin;
  } catch (error) {
    console.error('❌ Failed to bootstrap admin account:', error);
    throw error;
  }
};

if (process.argv[1]?.includes('bootstrapAdmin')) {
  bootstrapAdmin()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async () => {
      await disconnectDB();
      process.exit(1);
    });
}
