# System Architecture — CampusConnect

## 1. High-Level Architectural Pattern

CampusConnect adopts a modular, decoupled full-stack architecture adhering to the **Separation of Concerns (SoC)** principle. The platform is partitioned into distinct tiers:

```mermaid
flowchart TD
    subgraph Client Tier ["Frontend (React 18 + Vite)"]
        SPA["Single Page Application"]
        Router["React Router v6 Guarded Routes"]
        AuthCtx["Auth Context (JWT State)"]
        NotifCtx["Notification Context & Sockets"]
        Views["Student & Admin Views"]
    end

    subgraph Gateway Tier ["Express Server Gateway"]
        Security["Helmet, CORS, Rate Limiters"]
        AuthMiddleware["JWT & tokenVersion Verifier"]
        RBACMiddleware["Role Guard (STUDENT vs ADMIN)"]
        ValidateMiddleware["Zod Input Validators"]
    end

    subgraph Service Tier ["Business Controllers"]
        AuthCtrl["Auth & Profile"]
        CollabCtrl["Teammate Finder"]
        QnACtrl["Academic Q&A"]
        ResourceCtrl["Study Library"]
        LostFoundCtrl["Lost & Found"]
        EventCtrl["Event & Quota Manager"]
        GrievanceCtrl["Anonymous Grievance Redressal"]
        BroadcastCtrl["Emergency Broadcast Engine"]
        ClubCtrl["Club Governance"]
        PlacementCtrl["Placement Drives"]
        ConfigCtrl["System Config & Audit"]
    end

    subgraph Storage Tier ["Data & Real-time Layer"]
        MongoDB[("MongoDB Atlas Database")]
        Cloudinary[("Cloudinary Media / Local Disk")]
        SocketServer["Socket.IO WebSocket Server"]
    end

    SPA -->|HTTPS REST Requests| Gateway Tier
    Gateway Tier --> Service Tier
    Service Tier --> MongoDB
    Service Tier --> Cloudinary
    Service Tier --> SocketServer
    SocketServer -.->|WSS Real-time Push| NotifCtx
```

---

## 2. Client-Server Communication Flow

### 1. REST API Operations
- The frontend Axios client attaches the user's JSON Web Token as a Bearer token in the `Authorization` header for all protected endpoints.
- The Express server processes the request through the following pipeline:
  1. **Global Security:** Helmet sets security headers; CORS validates the origin; Express Rate Limit prevents brute-force abuse.
  2. **Authentication Middleware:** Validates JWT signature, checks user existence in MongoDB, verifies that `user.status !== 'SUSPENDED'`, and verifies that the token's embedded `tokenVersion` matches the current `user.tokenVersion`.
  3. **RBAC Middleware:** Verifies that the user role matches the required role (`STUDENT` or `ADMIN`).
  4. **Zod Validation Middleware:** Validates incoming `req.body`, `req.query`, and `req.params` against strict schemas before passing control to the controller.
  5. **Controller Execution:** Executes business logic, performs atomic database operations via Mongoose, creates audit logs if applicable, and returns structured JSON responses.

### 2. WebSocket Real-Time Channel
- The Socket.IO server runs alongside the Express HTTP server on the same port.
- During the connection handshake, clients provide their authentication token in the `auth` object.
- The server validates the token and joins the client to:
  - A private user room: `user_${userId}` for personal notifications (e.g. claim verification, club approval, collaboration application).
  - A role-based room: `role_ADMIN` or `role_STUDENT` for announcements.
  - A global broadcast channel: `emergency_alert` for immediate push of critical emergency banners across all connected browser tabs.

---

## 3. Immediate Session Revocation Pattern (`tokenVersion`)

To satisfy **Decision Table 8 Rule 1** (immediate revocation of active sessions upon account suspension), CampusConnect avoids waiting for JWT expiration:

1. Each `User` document in MongoDB maintains a numeric `tokenVersion: number` field (defaulting to `0`).
2. When a JWT is minted upon login, the current `tokenVersion` is baked into the JWT claims payload.
3. On every authenticated request, `auth.ts` middleware fetches the user and verifies:
   $$\text{jwtPayload.tokenVersion} == \text{user.tokenVersion}$$
4. When an administrator suspends an account, the controller executes:
   ```typescript
   student.status = 'SUSPENDED';
   student.tokenVersion = (student.tokenVersion || 0) + 1;
   await student.save();
   await UserSession.deleteMany({ userId: student._id });
   ```
5. Any subsequent HTTP request made with the previously issued token is rejected immediately with HTTP 403 Forbidden, and the frontend automatically logs the user out and redirects them to the `/suspended` page.

---

## 4. Zero-Knowledge Anonymous Grievance Flow

To guarantee student safety and satisfy **Module 8 / Module 18**, grievances are strictly isolated from user accounts:

```
[Student Browser]
       │
       ▼ (Sends description, category, optional attachment)
[Backend /api/grievances]
       │
       ├─► Generates secure tracking code: GRV-2026-XXXX
       ├─► Stores Grievance document WITHOUT ANY userId or student reference
       ├─► Stores NO IP addresses or identifying request headers
       │
       ▼ (Returns tracking code to student)
[Student Browser] ──► Displays GRV-2026-XXXX for manual self-service tracking
```

Administrators can view, assign to departments, and update resolution notes for grievances in the admin console without ever having access to the submitter's identity. Students check grievance status by querying `GET /api/grievances/track/:ticket` without requiring login credentials.

