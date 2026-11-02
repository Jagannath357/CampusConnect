import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  const token = localStorage.getItem('cc_token');
  const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

  if (!socket && token) {
    socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[WebSocket] Connected with socket ID:', socket?.id);
    });

    socket.on('connect_error', (error) => {
      console.warn('[WebSocket] Connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

