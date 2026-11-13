import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { hashPassword } from '../utils/password.js';

export const bootstrapAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@silicon.ac.in').toLowerCase().trim();
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@Silicon2026';
    const adminName = process.env.INITIAL_ADMIN_NAME || 'Silicon Administrator';

    let admin = await User.findOne({ email: adminEmail });

    const passwordHash = await hashPassword(adminPassword);

    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        tokenVersion: 0,
      });

      console.log('✅ Initial Admin created successfully in MongoDB Atlas:');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      admin.name = adminName;
      admin.passwordHash = passwordHash;
      admin.role = 'ADMIN';
      admin.status = 'ACTIVE';
      await admin.save();

      console.log('✅ Admin credentials synchronized and verified in MongoDB Atlas:');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Role:     ADMIN`);
      console.log(`   Status:   ACTIVE`);
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
