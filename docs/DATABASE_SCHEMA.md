# Database Schema Documentation — CampusConnect

## 1. Overview of Database Architecture

CampusConnect uses MongoDB with Mongoose ODM. All models are defined with TypeScript interfaces, strict validation, timestamps, and optimized compound indexes.

The database architecture comprises **20 Mongoose collections**:

1. `users` — Base authentication accounts (STUDENT and ADMIN).
2. `student_profiles` — Extended student academic information.
3. `collaboration_posts` — Teammate collaboration openings.
4. `academic_questions` — Student academic queries.
5. `academic_answers` — Peer answers and code solutions.
6. `academic_resources` — Course study materials and lecture notes.
7. `lost_found_items` — Reported lost and found campus belongings.
8. `ownership_claims` — Student ownership claims for lost items.
9. `events` — Official university workshops, seminars, and fests.
10. `event_registrations` — Student event registrations and tokens.
11. `grievances` — Completely anonymous student complaints.
12. `notifications` — In-app alerts and notifications.
13. `emergency_alerts` — Broadcast emergency advisories and critical alerts.
14. `clubs` — Verified campus student organizations.
15. `club_applications` — Applications for new student club charters.
16. `placements` — Campus recruitment opportunities.
17. `admin_audit_logs` — Tamper-resistant append-only admin logs.
18. `user_sessions` — Active user session records.
19. `suspension_records` — Historical suspension and reactivation records.
20. `system_configurations` — Dynamic campus identity and email domain rules.

---

## 2. Core Model Schemas & Specifications

### 1. `User` Schema
Represents the base authentication account for both students and administrators.

| Field | Type | Modifiers / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required, Trim | Full name of the user. |
| `email` | String | Required, Unique, Lowercase, Indexed | Institutional email address. |
| `passwordHash` | String | Required | bcrypt-hashed password (10 salt rounds). |
| `role` | String | Enum: `['STUDENT', 'ADMIN']`, Default: `'STUDENT'` | Access control role. |
| `status` | String | Enum: `['ACTIVE', 'INACTIVE', 'SUSPENDED']`, Default: `'ACTIVE'` | Account status. |
| `tokenVersion` | Number | Default: 0 | Session revocation counter. |
| `createdAt` | Date | Auto (timestamps: true) | Account registration timestamp. |
| `updatedAt` | Date | Auto (timestamps: true) | Last update timestamp. |

---

### 2. `StudentProfile` Schema
Contains academic identity and profile information linked to a student user account.

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | ObjectId | Ref: `User`, Required, Unique, Indexed |
| `department` | String | Required, Enum: `['CSE', 'CST', 'ECE', 'EEE', 'IT', 'MECH', 'CIVIL']` |
| `batchYear` | Number | Required (e.g. 2026) |
| `cgpa` | Number | Min: 0.0, Max: 10.0, Default: 0.0 |
| `skills` | [String] | Array of technical skills (e.g., `['React', 'Node.js', 'Python']`) |
| `bio` | String | Short student bio |
| `avatarUrl` | String | Profile picture URL (Cloudinary / Local) |
| `githubUrl` | String | GitHub profile URL |
| `linkedinUrl`| String | LinkedIn profile URL |

---

### 3. `Event` Schema
Represents official campus events with seat capacity controls.

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Required, Trim |
| `description` | String | Required |
| `category` | String | Enum: `['WORKSHOP', 'SEMINAR', 'CULTURAL', 'TECHNICAL', 'SPORTS', 'PLACEMENT']` |
| `date` | Date | Required (Must not be in the past) |
| `startTime` | String | Required (e.g. "10:00 AM") |
| `endTime` | String | Required (e.g. "01:00 PM") |
| `venue` | String | Required (e.g. "Silicon Auditorium") |
| `organizer` | String | Required |
| `organizerClubId`| ObjectId | Optional Ref: `Club` |
| `createdBy` | ObjectId | Ref: `User` (Admin creator) |
| `maxCapacity` | Number | Required, Min: 1 |
| `availableSeats`| Number | Required, Min: 0 (Atomically decremented) |
| `status` | String | Enum: `['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']` |
| `imageUrl` | String | Event poster image URL |

---

### 4. `EventRegistration` Schema
Tracks confirmed student seat reservations.

| Field | Type | Description |
| :--- | :--- | :--- |
| `eventId` | ObjectId | Ref: `Event`, Required, Indexed |
| `studentId` | ObjectId | Ref: `User`, Required, Indexed |
| `registrationToken`| String | Unique alphanumeric registration code (e.g. `REG-2026-XXXX`) |
| `registeredAt` | Date | Default: `Date.now` |
| `status` | String | Enum: `['CONFIRMED', 'CANCELLED']`, Default: `'CONFIRMED'` |

**Compound Unique Index:**
```typescript
eventRegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });
```
*Guarantees a student cannot double-book an event.*

---

### 5. `Grievance` Schema
Zero-knowledge anonymous student grievances.

| Field | Type | Description |
| :--- | :--- | :--- |
| `trackingTicket` | String | Required, Unique, Indexed (e.g. `GRV-2026-XXXX`) |
| `category` | String | Enum: `['ACADEMIC', 'HOSTEL', 'INFRASTRUCTURE', 'ADMINISTRATIVE', 'HARASSMENT', 'OTHER']` |
| `description` | String | Required (Min 10 characters) |
| `attachmentUrl` | String | Optional evidence attachment URL |
| `status` | String | Enum: `['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED']` |
| `assignedDepartment` | String | Optional assigned department/committee |
| `statusTimeline` | Array | Objects containing `{ status, note, updatedAt }` |

*Security Constraint: Contains zero reference to `userId`, `studentName`, or IP address.*

---

### 6. `LostFoundItem` and `OwnershipClaim` Schemas
Represents items reported on campus and student ownership verification.

**`LostFoundItem` Fields:**
- `itemName`: String (required)
- `category`: String (`ELECTRONICS`, `ID_CARDS`, `KEYS`, `DOCUMENTS`, `CLOTHING`, `OTHER`)
- `type`: String (`LOST` or `FOUND`)
- `location`: String (e.g. "Library 2nd Floor")
- `dateLostFound`: Date
- `description`: String
- `imageUrl`: String
- `status`: String (`OPEN`, `PENDING_VERIFICATION`, `RESOLVED`, `CLOSED`)
- `reporterId`: ObjectId (Ref: `User`)
- `resolvedBy`: ObjectId (Ref: `User`)

**`OwnershipClaim` Fields:**
- `itemId`: ObjectId (Ref: `LostFoundItem`)
- `claimantId`: ObjectId (Ref: `User`)
- `proofDescription`: String (Detailed description of marks, serial numbers, wallpapers)
- `proofImageUrl`: String (Optional invoice or proof photo)
- `status`: String (`PENDING`, `APPROVED`, `REJECTED`)
- `reviewedBy`: ObjectId (Ref: `User`)

---

### 7. `AdminAuditLog` Schema
Immutable append-only ledger for privileged administrative activities.

| Field | Type | Description |
| :--- | :--- | :--- |
| `adminId` | ObjectId | Ref: `User` (Admin who executed the action) |
| `actionType` | String | e.g. `USER_SUSPEND`, `EMERGENCY_BROADCAST`, `EVENT_PUBLISH` |
| `targetEntity` | String | Name of affected collection / entity |
| `targetId` | String | String representation of affected entity ID |
| `details` | Object | Arbitrary JSON audit payload |
| `ipAddress` | String | Origin client IP address |
| `userAgent` | String | HTTP User-Agent string |
| `timestamp` | Date | Default: `Date.now`, Indexed |

