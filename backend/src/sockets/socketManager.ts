import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { AuthUserPayload } from '../types/index.js';

interface AuthenticatedSocket extends Socket {
  user?: AuthUserPayload;
}

let io: Server | null = null;

export const initSocketIO = (httpServer: HttpServer): Server => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  io = new Server(httpServer, {
    cors: {
      origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  // Socket Authentication Middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        // Allow unauthenticated connection for public emergency view or gracefully reject
        return next(new Error('Authentication token required for WebSocket'));
      }

      const payload = verifyToken(token);
      const user = await User.findById(payload.userId);
      if (!user || user.status === 'SUSPENDED' || user.tokenVersion !== payload.tokenVersion) {
        return next(new Error('Unauthorized socket connection'));
      }

      socket.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion,
      };

      next();
    } catch (err) {
      next(new Error('Socket authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.user) {
      socket.disconnect();
      return;
    }

    const { userId, role } = socket.user;
    console.log(`[Socket] User connected: ${userId} (${role}), socketId: ${socket.id}`);

    // Join personal user room
    socket.join(`user_${userId}`);

    // Join role-specific room
    socket.join(`role_${role}`);

    // Join common broadcast channel
    socket.join('broadcast_global');

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${userId}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized yet');
  }
  return io;
};

// Helper methods to push real-time events to connected clients
export const emitNotificationToUser = (userId: string, notification: any): void => {
  if (!io) return;
  io.to(`user_${userId}`).emit('notification', notification);
};

export const emitEmergencyBroadcast = (alert: any): void => {
  if (!io) return;
  // Instantly broadcast to all connected users
  io.emit('emergency_alert', alert);
};

export const emitEventUpdate = (eventId: string, updateData: any): void => {
  if (!io) return;
  io.emit('event_update', { eventId, ...updateData });
};

