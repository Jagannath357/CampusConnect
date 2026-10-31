# API Documentation — CampusConnect

## 1. API Standards & Base URL

- **Base URL:** `/api` (or `http://localhost:5000/api`)
- **Format:** JSON (`application/json`)
- **Authentication:** Bearer Token via `Authorization: Bearer <JWT>` header
- **Standard Response Structure:**
  ```json
  {
    "success": true,
    "message": "Human readable status message.",
    "data": { ... },
    "pagination": { ... } // Optional for list endpoints
  }
  ```

---

## 2. Authentication & Profile Endpoints (`/api/auth`, `/api/profile`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new student account (requires `@silicon.ac.in`). |
| `POST` | `/auth/login` | Public | Authenticate user and issue JWT token. |
| `POST` | `/auth/logout` | Authenticated | Terminate session and invalidate client token. |
| `GET` | `/auth/me` | Authenticated | Retrieve authenticated user and profile state. |
| `GET` | `/profile/me` | Authenticated | Fetch current user profile. |
| `PUT` | `/profile/me` | Authenticated | Update bio, CGPA, skills, GitHub/LinkedIn links. |
| `POST` | `/profile/avatar` | Authenticated | Upload new profile avatar picture (Multer). |

---

## 3. Teammate Collaboration Endpoints (`/api/collaborations`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/collaborations` | Authenticated | List open collaboration posts with search & branch filters. |
| `GET` | `/collaborations/:id` | Authenticated | Get collaboration post details and team roster. |
| `POST` | `/collaborations` | Student | Create a new project collaboration posting. |
| `POST` | `/collaborations/:id/apply` | Student | Apply to join a project team (Decision Table 3). |
| `PATCH` | `/collaborations/:id/applications/:appId` | Creator | Accept or reject a student join application. |
| `DELETE` | `/collaborations/:id` | Creator/Admin | Close or delete collaboration post. |

---

## 4. Academic Q&A Endpoints (`/api/questions`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/questions` | Authenticated | List academic questions (search, courseCode filter, tag filter). |
| `GET` | `/questions/:id` | Authenticated | Get question thread with answers and upvote counts. |
| `POST` | `/questions` | Student | Post a new academic question. |
| `POST` | `/questions/:id/answers` | Student | Submit an answer or code snippet to a question. |
| `POST` | `/questions/:id/answers/:answerId/upvote` | Authenticated | Upvote a peer answer. |
| `PATCH` | `/questions/:id/answers/:answerId/accept` | Author | Accept a peer answer as the verified solution. |

---

## 5. Study Resource Library Endpoints (`/api/resources`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/resources` | Authenticated | List study resources (filter by semester, department, category). |
| `POST` | `/resources` | Student | Upload study material file (PDF/DOCX/ZIP) (Decision Table 4). |
| `GET` | `/resources/:id/download` | Authenticated | Increment download counter and return resource download URL. |
| `DELETE` | `/resources/:id` | Uploader/Admin | Remove study resource. |

---

## 6. Lost-and-Found Endpoints (`/api/lost-found`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/lost-found` | Authenticated | List campus items (filter by LOST vs FOUND, status, category). |
| `GET` | `/lost-found/:id` | Authenticated | Get item details and claim history. |
| `POST` | `/lost-found` | Student | Report lost or found item with location and image. |
| `POST` | `/lost-found/:id/claim` | Student | Submit an ownership claim with identifying proof description. |

---

## 7. Campus Events Endpoints (`/api/events`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/events` | Authenticated | List upcoming published campus events. |
| `GET` | `/events/:id` | Authenticated | Get event details, remaining seat count, and organizer info. |
| `POST` | `/events/:id/register` | Student | Atomically reserve seat & obtain token (Decision Table 7). |
| `DELETE` | `/events/:id/register` | Student | Cancel confirmed seat registration and restore available quota. |
| `GET` | `/events/my-registrations` | Student | List all confirmed registrations for the current student. |

---

## 8. Anonymous Grievance Endpoints (`/api/grievances`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/grievances` | Public/Student | Submit zero-knowledge anonymous grievance; returns `GRV-2026-XXXX`. |
| `GET` | `/grievances/track/:ticket` | Public | Check grievance timeline and resolution status by tracking code. |

---

## 9. Student Clubs & Placement Endpoints (`/api/clubs`, `/api/placements`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/clubs` | Authenticated | List officially verified campus clubs. |
| `GET` | `/clubs/:id` | Authenticated | Get club profile, lead student, and contact info. |
| `POST` | `/clubs/apply` | Student | Submit charter application for a new student club. |
| `GET` | `/placements` | Authenticated | List active campus recruitment opportunities. |
| `GET` | `/placements/:id` | Authenticated | Get placement role description, package, and application URL. |

---

## 10. Administrator Console Endpoints (`/api/admin`)

*Strict RBAC: All endpoints require valid JWT and `role === 'ADMIN'`.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | Aggregated telemetry, event quotas, and grievance distribution. |
| `GET` | `/admin/students` | Search and filter registered student accounts. |
| `GET` | `/admin/students/:id` | Inspect complete student profile and past suspension history. |
| `POST` | `/admin/students/:id/suspend` | Suspend student, invalidate active JWTs (`tokenVersion++`) (DT-8). |
| `POST` | `/admin/students/:id/reactivate` | Reactivate suspended student account with notes. |
| `GET` | `/admin/suspensions` | Complete historical audit of all suspensions and reactivations. |
| `GET` | `/admin/moderation` | List flagged collaboration posts, questions, and answers. |
| `POST` | `/admin/moderation/:contentType/:id` | Remove policy-violating content or restore. |
| `GET` | `/admin/lost-found` | Inspect lost-and-found items and pending ownership claims. |
| `POST` | `/admin/lost-found/:id/verify` | Approve ownership claim and mark item as RESOLVED (DT-5). |
| `POST` | `/admin/events` | Schedule and publish official campus event (DT-7). |
| `PUT` | `/admin/events/:id` | Update event information, venue, capacity, or status. |
| `GET` | `/admin/events/:id/registrations` | Export confirmed attendee roster with registration tokens. |
| `POST` | `/admin/emergency/broadcast` | Push critical WebSocket emergency alert to all sessions (DT-6). |
| `GET` | `/admin/emergency/history` | List all historical emergency broadcasts. |
| `PATCH` | `/admin/emergency/:id/dismiss` | Dismiss active emergency alert. |
| `GET` | `/admin/grievances` | Anonymous grievance redressal dashboard. |
| `PATCH` | `/admin/grievances/:id/status` | Update grievance status, assign department, and add note. |
| `GET` | `/admin/clubs/applications` | Review pending student club charter applications. |
| `POST` | `/admin/clubs/applications/:id/review` | Approve charter (creates verified Club) or reject with notes. |
| `GET` | `/admin/placements` | Manage placement opportunities. |
| `POST` | `/admin/placements` | Announce new recruitment drive with branch & CGPA rules. |
| `PUT` | `/admin/placements/:id` | Update placement details or close drive. |
| `GET` | `/admin/configuration` | Retrieve permitted registration email domains and identity settings. |
| `PUT` | `/admin/configuration/:key` | Update system settings (`allowedEmailDomains`, `campusIdentity`). |
| `GET` | `/admin/audit-logs` | Query append-only administrative audit log ledger. |
