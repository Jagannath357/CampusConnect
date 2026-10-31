import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { initSocketIO } from './sockets/socketManager.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const app = createApp();
    const server = http.createServer(app);

    // Initialize Socket.IO with WebSocket support
    initSocketIO(server);

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` CampusConnect Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Institution: Silicon University, Bhubaneswar`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start CampusConnect server:', error);
    process.exit(1);
  }
};

startServer();
