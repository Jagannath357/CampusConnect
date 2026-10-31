# Development Changelog & Architectural Decisions — CampusConnect

## 1. Initial Specification Analysis & Document Extraction
- Extracted official specification documents from user download archives into `docs/spec_source/` and parsed them into `docs/extracted/`.
- Verified the scope: **21 active user stories** across Student and Admin experiences; **5 explicitly deferred user stories** (Story 9, 11, 12, 23, 25).
- Identified all **8 Decision Tables** governing account status transitions, registration domain whitelisting, teammate applications, resource sharing, claim verifications, emergency broadcasts, official event publishing, and disciplinary suspensions.

---

## 2. Key Engineering & Decision Table Decisions

### Decision Table 2 Rule 5 Clarification (Duplicate Registration)
- **Problem:** The original specification source spreadsheet contained an empty value in Rule 5 under duplicate account handling.
- **Resolution:** As instructed, duplicate student email detection was implemented with an explicit HTTP 409 Conflict status code and verified through automated test suites.

### Immediate Session Invalidation (`tokenVersion`)
- **Problem:** Standard stateless JWT authentication allows suspended students to continue making authenticated requests until token expiration.
- **Resolution:** Introduced a `tokenVersion: number` counter in the `User` schema that increments immediately upon suspension. The authentication middleware verifies matching token versions on every protected route, immediately revoking active sessions.

### Event Overbooking Concurrency Protection
- **Problem:** Concurrent seat reservations could cause negative seat quotas.
- **Resolution:** Applied atomic updates using `Event.findOneAndUpdate({ _id, availableSeats: { $gt: 0 }, status: 'PUBLISHED' }, { $inc: { availableSeats: -1 } })` alongside a compound unique index on `{ eventId: 1, studentId: 1 }` on `EventRegistration`.

### Zero-Knowledge Anonymous Grievances
- **Problem:** Ensuring student trust requires complete anonymity.
- **Resolution:** The `Grievance` schema completely omits user references and IP addresses. Resolution tracking occurs exclusively through random ticket identifiers (`GRV-2026-XXXX`).

---

## 3. Milestones & Chronological Timeline

1. **Phase 1: Backend Architecture & Data Models**
   - Configured Node.js + Express 5 + TypeScript + Mongoose.
   - Designed 20 Mongoose models with compound indexes and atomic updates.
   - Implemented Zod validators, Multer upload engine with Cloudinary and local disk fallback, JWT authentication, and RBAC middleware.
   - Built 12 modular controllers covering all 21 active user stories.
   - Created `bootstrapAdmin.ts` and `seed.ts` scripts.

2. **Phase 2: Backend Automated Verification**
   - Created `backend/tests/decisionTables.test.ts` with `mongodb-memory-server`.
   - Verified 30 automated test cases covering Decision Tables 1 through 8, RBAC boundaries, event overbooking prevention, and placement filtering. All 30 tests passed (100% pass rate).

3. **Phase 3: Frontend Architecture & Student Modules**
   - Initialized React 18 + Vite + Tailwind CSS + Lucide Icons client.
   - Configured Axios interceptors, Socket.IO client, AuthContext, and NotificationContext with live emergency banner overlay.
   - Built reusable UI library (Buttons, Dialogs, Cards, Badges, Tabs, StatCards, StatusBadges, EmptyStates).
   - Implemented all 10 Student Portal modules (Dashboard, Profile, Collabs, Q&A, Resources, Lost & Found, Events, Grievance, Clubs, Placements).

4. **Phase 4: Admin Console & Real-Time Broadcasts**
   - Implemented all 11 Admin Console pages (Dashboard, Student Auditing, Suspension Management, Content Moderation, Lost & Found Claims, Official Events, Emergency Broadcast with live preview, Grievance Routing, Club Governance, Placement Management, Live Analytics with Recharts, System Configuration, Append-Only Audit Logs).
   - Configured `AppRoutes.tsx` with role-based `ProtectedRoute` guards and nested layouts.

5. **Phase 5: Frontend Build & Test Verification**
   - Ran `tsc && vite build`: Bundled 2,598 modules into production assets with 0 errors.
   - Created unit test suite in `frontend/src/__tests__/App.test.tsx` using Vitest and React Testing Library: 6/6 tests passed.

6. **Phase 6: Root Orchestration & Comprehensive Documentation**
   - Created root `package.json` with multi-project scripts.
   - Authored comprehensive root `README.md` and all 14 detailed technical specification files in `docs/`.
