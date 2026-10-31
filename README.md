# CampusConnect — Centralized Single-Campus University Portal

> **Silicon University, Bhubaneswar**  
> *"One Campus. One Community. One Connection."*

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()
[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-30%2F30%20Passed-success)]()
[![Frontend Tests](https://img.shields.io/badge/Frontend%20Tests-6%2F6%20Passed-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)]()
[![Node](https://img.shields.io/badge/Node-v20%2B-green)]()
[![React](https://img.shields.io/badge/React-18.3-cyan)]()
[![License](https://img.shields.io/badge/License-Academic%20Project-purple)]()

---

## 1. Executive Summary

**CampusConnect** is a full-stack, enterprise-grade university portal built exclusively for **Silicon University, Bhubaneswar**. It bridges student collaboration, academic discussions, syllabus & study-material sharing, lost-and-found item recovery, official university event publishing, student club governance, placement drive notifications, zero-knowledge anonymous grievance redressal, and real-time emergency system broadcasts.

The system is designed with a modern decoupled client-server architecture:
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, TanStack Query, React Hook Form, Zod, Recharts, Axios, Socket.IO Client.
- **Backend:** Node.js, Express.js (TypeScript), MongoDB Atlas via Mongoose ODM, JWT authentication with immediate revocation (`tokenVersion`), Role-Based Access Control (RBAC), WebSocket notifications via Socket.IO, Multer with Cloudinary (plus local fallback storage), Helmet, CORS, and Express Rate Limit.

---

## 2. Default Credentials & Test Accounts

The platform includes seed scripts that initialize the database with institutional default accounts:

### Campus Administrator
- **Email:** `admin@silicon.ac.in`
- **Password:** `Admin@Silicon2026`
- **Role:** `ADMIN`
- **Privileges:** Full console access, student suspension, event publishing, emergency broadcasting, club approvals, placement announcements, system configuration.

### Sample Verified Students
| Name | Institutional Email | Password | Branch | Batch | CGPA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rohit Sharma** | `rohit.sharma@silicon.ac.in` | `Student@Silicon2026` | CSE | 2026 | 8.8 |
| **Sneha Patel** | `sneha.patel@silicon.ac.in` | `Student@Silicon2026` | ECE | 2026 | 9.2 |
| **Ananya Das** | `ananya.das@silicon.ac.in` | `Student@Silicon2026` | IT | 2027 | 7.9 |

> **Note on Registration Domain Restriction:** In accordance with **Decision Table 2 Rule 1**, self-registration requires an institutional email ending with `@silicon.ac.in`. Alternate domains can be configured dynamically by administrators via the System Configuration console.

---

## 3. Quick Start & Local Execution

### Prerequisites
- **Node.js:** v20.x or v22.x
- **npm:** v10.x or v11.x
- **MongoDB:** Local instance on `mongodb://127.0.0.1:27017/campusconnect` or MongoDB Atlas URI

### Installation & Environment Setup
Clone the repository and install dependencies:

```bash
# 1. Install root dependencies (or direct to backend/frontend)
cd backend && npm install
cd ../frontend && npm install
cd ..
```

Configure environment files:

#### `backend/.env`
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=super-secret-silicon-campusconnect-jwt-key-2026
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=500

# Cloudinary (Optional - falls back automatically to local uploads/)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Seeding the Database
Run the seed script to create the administrator, sample students, verified clubs, upcoming events, academic resources, collaboration posts, and active placements:

```bash
npm run seed
# Or directly: cd backend && npm run seed
```

### Starting the Applications

#### Option A: Running Backend and Frontend in separate terminals
```bash
# Terminal 1: Backend API & WebSocket Server (Port 5000)
cd backend
npm run dev

# Terminal 2: Frontend Vite Development Server (Port 5173)
cd frontend
npm run dev
```

#### Option B: Root Convenience Scripts
```bash
# Start backend
npm run dev:backend

# Start frontend
npm run dev:frontend
```

Once running:
- **Frontend Portal:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 4. Running Automated Test Suites

The project features comprehensive automated test suites covering all **8 Decision Tables**, edge conditions, RBAC boundaries, and core React components:

### Backend Test Suite (30 Tests)
Includes tests for:
- Decision Table 1: Student Account Status Transitions
- Decision Table 2: Student Registration Validation (including Rule 5 duplicate email 409 conflict handling)
- Decision Table 3: Teammate Finder Request Validation
- Decision Table 4: Study Resource Upload Permissions
- Decision Table 5: Lost & Found Ownership Verification
- Decision Table 6: Emergency Broadcast Dispatch & Role Guards
- Decision Table 7: Official Event Publishing & Overbooking Prevention
- Decision Table 8: User Guideline Enforcement & Immediate Token Revocation (`tokenVersion`)
- Anonymous Grievance Zero-Knowledge Protection
- Placement CGPA & Academic Branch Filtering

```bash
# Run backend tests
cd backend && npm run test
```

### Frontend Test Suite (6 Tests)
Validates core component rendering, status badge color mapping, stat card metrics, empty state interaction, modal dialog action dispatching, and institutional landing page layout:

```bash
# Run frontend tests
cd frontend && npm run test
```

### Running Both Test Suites
```bash
npm run test
```

---

## 5. System Features & Modules

### Student Experience (10 Modules)
1. **Module 1: Student Dashboard & Real-Time Feed** — Aggregated metric counters, active collaboration requests, upcoming registered events, unread notifications, and quick action shortcuts.
2. **Module 2: Student Profile & Academic Identity** — Manage bio, department, batch year, CGPA, technical skills tags, GitHub/LinkedIn links, and profile avatar.
3. **Module 3: Teammate Collaboration Finder (Decision Table 3)** — Create project collaboration posts with required skillsets, team size limits, and branch preferences; accept or decline join applications.
4. **Module 4: Peer Academic Q&A Forum** — Post course-specific questions, upload code snippets/diagrams, submit peer answers, upvote helpful solutions, and accept verified answers.
5. **Module 5: Study Resource Library (Decision Table 4)** — Upload lecture notes, previous question papers, and lab manuals; filter by semester, course code, and department.
6. **Module 6: Lost-and-Found Recovery Desk (Decision Table 5)** — Report lost or found campus items with images, locations, and timestamps; submit ownership claims with proof descriptions.
7. **Module 7: Campus Event Hub & Seat Booking (Decision Table 7)** — Discover official workshops, seminars, and fests; atomic single-click seat booking with overbooking prevention and unique ticket generation.
8. **Module 8: Zero-Knowledge Anonymous Grievance Portal** — Submit confidential complaints with zero student identifiers or tracking headers; check resolution progress using a secure tracking ticket (`GRV-2026-XXXX`).
9. **Module 9: Student Organization Discovery & Charter Application** — Discover verified clubs, review leadership information, and submit new club charter applications for administrative review.
10. **Module 10: Campus Recruitment & Placement Drives** — Search active placement drives, filter listings by branch and student CGPA eligibility, and track application deadlines.

### Administrator Console (11 Modules)
1. **Module 11: Student Account Auditing & Lifecycle** — Paginated student directory, profile inspector, account status audit, and batch filtering.
2. **Module 12: Content Moderation & Community Safety** — Review flagged collaboration posts, academic questions, and peer answers; remove policy-violating content.
3. **Module 13: Lost-and-Found Verification (Decision Table 5)** — Review student ownership claims, compare submitted proof against item descriptions, approve claims, and update items to Resolved status.
4. **Module 14: Live Telemetry & Activity Analytics** — Recharts data visualizations showing event capacity utilization, grievance category distribution, and branch enrollment ratios.
5. **Module 15: Single-Campus Configuration Control (Decision Table 2)** — Manage allowed email registration domains (`silicon.ac.in`), institutional tagline, campus address, and support contact details.
6. **Module 16: Official Event Publishing (Decision Table 7)** — Publish university events, upload promotional posters, enforce non-past dates, specify seat quotas, and export attendee rosters.
7. **Module 17: Emergency System Broadcast (Decision Table 6)** — Dispatch high-priority emergency alerts via WebSocket directly to all active browser sessions with instant red/amber banner overlays.
8. **Module 18: Anonymous Grievance Routing & Management** — Review anonymous student complaints, assign tickets to internal university departments, update investigation status, and log resolution notes.
9. **Module 19: Student Club Governance** — Review pending club charter applications, grant official university verification, assign club codes, and notify prospective student leaders.
10. **Module 20: Placement Notification Management** — Announce campus recruitment drives, specify job description, minimum CGPA thresholds, eligible academic branches, CTC package, and application deadlines.
11. **Module 21: Guideline Enforcement & Suspension (Decision Table 8)** — Suspend accounts violating university policies with mandatory reason logging; immediately invalidates all active JWT tokens via `tokenVersion` increments and purges sessions.

---

## 6. Project Architecture & Directory Structure

```
CampusConnect/
│
├── frontend/                     # React 18 + Vite + TypeScript Client
│   ├── public/                   # Static assets & icons
│   └── src/
│       ├── assets/               # Brand logos and illustrations
│       ├── components/           # Reusable UI components
│       │   ├── common/           # StatCard, StatusBadge, EmptyState, ConfirmDialog, etc.
│       │   ├── layout/           # Navbar, StudentSidebar, AdminSidebar, Footer
│       │   └── ui/               # Button, Input, Textarea, Card, Dialog, Badge, Tabs
│       ├── contexts/             # AuthContext, NotificationContext
│       ├── layouts/              # StudentLayout, AdminLayout
│       ├── pages/
│       │   ├── auth/             # LandingPage, LoginPage, RegisterPage, SuspendedPage, etc.
│       │   ├── student/          # 10 Student Module Pages
│       │   └── admin/            # 11 Admin Console Pages
│       ├── routes/               # AppRoutes, ProtectedRoute (RBAC Guard)
│       ├── services/             # Axios API Client, Socket.IO Client
│       ├── types/                # TypeScript Interfaces & Models
│       └── utils/                # Tailwind helper (cn), formatters
│
├── backend/                      # Node.js + Express + TypeScript API Server
│   └── src/
│       ├── config/               # MongoDB Mongoose & Cloudinary / Multer config
│       ├── controllers/          # 12 Modular Controllers
│       ├── middleware/           # auth, rbac, validate, upload, audit, errorHandler
│       ├── models/               # 20 Mongoose Models with compound indexes
│       ├── routes/               # 12 Express Route files + API index
│       ├── scripts/              # seed.ts, bootstrapAdmin.ts
│       ├── sockets/              # Socket.IO authenticated manager & broadcasts
│       ├── types/                # TypeScript backend types & Request extensions
│       ├── utils/                # bcrypt, jwt, tokens, dynamic system config
│       ├── validators/           # Zod schema validation rules
│       ├── app.ts                # Express app configuration & security middleware
│       └── server.ts             # HTTP + WebSocket server bootstrap
│
├── docs/                         # 14 Detailed Architectural & Technical Specifications
└── package.json                  # Root convenience scripts
```

---

## 7. Documentation Index

For comprehensive implementation specifications, review the markdown documents in the `docs/` folder:

1. [Project Overview](docs/PROJECT_OVERVIEW.md) — Scope, mission, active vs deferred user stories, Decision Tables.
2. [Technology Stack](docs/TECHNOLOGY_STACK.md) — Detailed rationale and versions for every tool in the stack.
3. [System Architecture](docs/SYSTEM_ARCHITECTURE.md) — Architectural diagrams, data flows, and subsystem interactions.
4. [Database Schema](docs/DATABASE_SCHEMA.md) — Detailed schema definitions, field types, constraints, and compound indexes.
5. [API Documentation](docs/API_DOCUMENTATION.md) — Complete REST endpoint catalogue with request/response contracts.
6. [Authentication and RBAC](docs/AUTHENTICATION_AND_RBAC.md) — Token lifecycle, session revocation, and security boundaries.
7. [Student Modules](docs/STUDENT_MODULES.md) — Workflow documentation for Modules 1 through 10.
8. [Admin Modules](docs/ADMIN_MODULES.md) — Workflow documentation for Modules 11 through 21.
9. [File Upload Configuration](docs/FILE_UPLOAD_CONFIGURATION.md) — Cloudinary cloud storage and local filesystem fallback.
10. [Socket.IO Notifications](docs/SOCKET_IO_NOTIFICATIONS.md) — Real-time event architecture and emergency broadcast channel.
11. [Security](docs/SECURITY.md) — Security policies, rate limiting, sanitization, and audit logging.
12. [Testing](docs/TESTING.md) — Automated testing matrix, Decision Table test coverage, and test results.
13. [Deployment](docs/DEPLOYMENT.md) — Production deployment instructions for Vercel, Render, MongoDB Atlas, and Cloudinary.
14. [Development Changelog](docs/DEVELOPMENT_CHANGELOG.md) — Complete timeline of architecture, engineering decisions, and verification steps.

---

## 8. License & Academic Attribution

This software project is designed and developed as a complete academic Software Engineering capstone project for **Silicon University, Bhubaneswar**. All rights reserved.
