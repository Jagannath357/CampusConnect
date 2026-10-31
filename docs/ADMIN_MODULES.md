# Administrator Modules Specification — CampusConnect

## 1. Overview of Administrator Console

The Administrator Console provides authorized university faculty, proctors, and staff with centralized oversight over academic feeds, safety mechanisms, campus organizations, and system settings.

All administrative routes are protected by backend RBAC (`role === 'ADMIN'`) and log privileged operations to `AdminAuditLog`.

---

## 2. Module Workflows

### Module 11: Student Account Auditing & Lifecycle
- **Path:** `/admin/students`, `/admin/students/:id`
- **Features:**
  - Paginated student directory with search by name, email, department, and batch year.
  - Inspect student profile details, academic records, and past disciplinary history.
  - Filter accounts by status: `ACTIVE` vs `SUSPENDED`.

### Module 12: Content Moderation & Community Safety
- **Path:** `/admin/moderation`
- **Features:**
  - Monitor collaboration posts, academic questions, and peer answers flagged by automated checks or user reports.
  - Action buttons: "Remove Content" (soft deletes from student feeds) and "Restore Content".
  - Logs admin reason to `AdminAuditLog`.

### Module 13: Lost-and-Found Verification (Decision Table 5)
- **Path:** `/admin/lost-found`
- **Features:**
  - Inspect reported items and submitted student ownership claims.
  - Compare claimant proof description and evidence images against the original item post.
  - "Approve Claim" sets item status to `RESOLVED`, marks claim as `APPROVED`, attaches admin timestamp, and triggers a real-time notification to the claimant.
  - "Reject Claim" marks claim as `REJECTED`, retains item in `PENDING_VERIFICATION`, and notifies claimant with rejection notes.

### Module 14: Live Telemetry & Activity Analytics
- **Path:** `/admin/analytics`
- **Features:**
  - Aggregated system counters: total students, active vs suspended, event bookings, pending grievances, verified clubs, active placements.
  - Interactive Recharts visualizations:
    - Event turnout: Confirmed bookings vs Maximum capacity.
    - Grievance inflow by category distribution.
    - Student enrollment ratios by academic department.
  - Real-time refresh button.

### Module 15: Single-Campus Configuration Control (Decision Table 2)
- **Path:** `/admin/configuration`
- **Features:**
  - Manage `allowedEmailDomains`: Add, remove, and review permitted student registration domains (`silicon.ac.in`).
  - Configure campus identity parameters: Institution name, campus location, institutional tagline, and support contact email.
  - Updates persist immediately to MongoDB with audit logging.

### Module 16: Official Event Publishing (Decision Table 7)
- **Path:** `/admin/events`, `/admin/events/new`
- **Rules (Decision Table 7):**
  - Create campus events with title, category, date, time, venue, description, poster upload, and maximum capacity.
  - Date validation prevents scheduling events in the past.
  - If scheduled on behalf of a student club, verifies that the club is officially verified.
  - Export confirmed attendee roster with registration tokens.

### Module 17: Emergency System Broadcast (Decision Table 6)
- **Path:** `/admin/emergency`
- **Rules (Decision Table 6):**
  - Compose high-priority critical broadcasts (e.g. severe weather advisory, campus evacuation, examination rescheduling).
  - Flags: High-priority critical (red banner) vs advisory (amber banner).
  - Preview banner simulates exact appearance across student screens.
  - Confirmation dialog prevents accidental dispatch.
  - Dispatches via WebSocket (`emergency_alert`) to all connected browser sessions.
  - Active broadcast management with one-click deactivation/dismissal.

### Module 18: Anonymous Grievance Routing & Redressal
- **Path:** `/admin/grievances`
- **Features:**
  - Centralized table of submitted anonymous complaints.
  - Categorized into academic, hostel, infrastructure, harassment, or administrative.
  - Department routing: Assign tickets to Dean of Student Affairs, Examination Cell, Hostel Committee, Security Division, etc.
  - Status progression: `SUBMITTED` -> `UNDER_REVIEW` -> `ASSIGNED` -> `IN_PROGRESS` -> `RESOLVED` / `DISMISSED`.
  - Append timestamped resolution notes to the public status timeline.

### Module 19: Student Club Governance
- **Path:** `/admin/clubs`
- **Features:**
  - Review charter applications submitted by student leaders.
  - "Approve Charter" assigns a unique club code, generates an official verified `Club` record, and dispatches a congratulations notification to the student lead.
  - "Reject Charter" sends review feedback notes to the applicant.
  - View verified student clubs directory with lead student contacts.

### Module 20: Placement Notification Management
- **Path:** `/admin/placements`
- **Features:**
  - Publish recruitment drives with company name, job role, description, minimum CGPA requirement, eligible branches, CTC package, application link, and deadline.
  - Edit active listings or mark drives as closed when registration expires.

### Module 21: Guideline Enforcement & Suspension (Decision Table 8)
- **Path:** `/admin/suspensions`
- **Rules (Decision Table 8):**
  - Suspend student accounts violating academic integrity or campus conduct.
  - Mandatory suspension reason, start date, and optional end date.
  - Automatically sets student status to `SUSPENDED`.
  - Increments `user.tokenVersion`, immediately revoking all active JWT sessions.
  - Purges entries from `user_sessions`.
  - One-click account reactivation with administrative reactivation notes.
  - Complete historical log of all past disciplinary actions.
