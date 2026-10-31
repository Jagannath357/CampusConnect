# Socket.IO & Real-Time Event Architecture — CampusConnect

## 1. Real-Time System Objectives

CampusConnect employs Socket.IO to power two real-time communication pathways:
1. **Personal User Notifications:** Immediate push alerts for events concerning a specific student (e.g. claim approval, collaboration join request, grievance status update).
2. **Emergency System Broadcasts (Decision Table 6):** High-priority alerts pushed across all active browser sessions with intrusive banner overlays that require no page reloads.

---

## 2. Server-Side Socket.IO Manager

The Socket.IO instance is initialized on the same HTTP server in `backend/src/server.ts` and managed by `backend/src/sockets/socketManager.ts`.

### Connection Handshake & Authentication
```typescript
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
  if (!token) {
    // Unauthenticated connection allowed for public emergency broadcast reception
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    socket.data.user = payload;
    next();
  } catch (err) {
    next();
  }
});
```

### Room Management
Upon successful connection:
- If authenticated as a user: `socket.join(`user_${socket.data.user.userId}`)`
- If authenticated as an administrator: `socket.join('role_ADMIN')`
- All sockets automatically join the global broadcast space.

---

## 3. Real-Time Events Specification

### 1. `emergency_alert` (Global Broadcast)
- **Trigger:** Dispatched by an administrator via `POST /api/admin/emergency/broadcast`.
- **Payload:**
  ```json
  {
    "id": "67245b7f...",
    "title": "Severe Weather Warning: Campus Closure",
    "message": "Due to cyclonic conditions, all offline academic sessions are suspended.",
    "isCritical": true,
    "broadcastAt": "2026-10-31T12:00:00.000Z"
  }
  ```
- **Client Behavior:** Caught by `NotificationContext.tsx`; instantly renders `<EmergencyBanner />` at the top of every screen in red (`isCritical: true`) or amber (`isCritical: false`) with sound and animation.

### 2. `notification` (Personal Direct Alert)
- **Trigger:** Dispatched when an administrator approves a lost-and-found claim, a student applies to a collaboration post, or a club application is reviewed.
- **Payload:**
  ```json
  {
    "id": "67245d8a...",
    "title": "Ownership Claim Approved!",
    "message": "Your claim for 'Calculus Textbook' was verified. Collect at Helpdesk.",
    "type": "CLAIM",
    "link": "/lost-found/67245d8a...",
    "createdAt": "2026-10-31T12:05:00.000Z"
  }
  ```
- **Client Behavior:** Updates unread counter in the navbar bell icon and shows a toast notification.

---

## 4. Frontend Socket Client Lifecycle

In `frontend/src/services/socket.ts`:
- Reconnects automatically if disconnected.
- Updates the `auth.token` parameter dynamically whenever the student logs in or refreshes their session.
- Gracefully disconnects when the user logs out:
  ```typescript
  export const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };
  ```
