# Student Modules Specification — CampusConnect

## 1. Overview of Student Portal

The Student Portal encompasses **10 interconnected modules** designed to streamline academic collaboration, extracurricular discovery, campus life, and institutional communication.

---

## 2. Module Workflows

### Module 1: Student Dashboard & Real-Time Feed
- **Path:** `/dashboard`
- **Features:**
  - Aggregated metric cards: My Active Collabs, Enrolled Events, Saved Resources, Unread Notifications.
  - Live activity feed showing newly published campus events and recent academic discussions.
  - Direct quick action buttons to post a project collaboration, ask an academic question, report lost items, or submit a grievance.

### Module 2: Student Profile & Academic Identity
- **Path:** `/profile`
- **Features:**
  - View and edit bio, branch/department (`CSE`, `ECE`, `EEE`, `IT`, etc.), batch year, and current CGPA.
  - Add and delete technical skill tags (e.g. React, Node.js, Python, Machine Learning).
  - Add external portfolio links: GitHub profile and LinkedIn profile.
  - Upload profile picture avatar with automatic cropping and Cloudinary/local storage integration.

### Module 3: Teammate Collaboration Finder (Decision Table 3)
- **Path:** `/collaborations`, `/collaborations/create`, `/collaborations/:id`
- **Rules (Decision Table 3):**
  - Project creator defines title, description, required skills, team size limit, and preferred branch.
  - Prospective teammates apply with a pitch and their skills.
  - Creator can accept or reject applications.
  - When accepted member count reaches `maxMembers`, the post status automatically transitions to `FILLED`.
  - Duplicate join applications from the same student are blocked with HTTP 400.

### Module 4: Peer Academic Q&A Forum
- **Path:** `/questions`, `/questions/ask`, `/questions/:id`
- **Features:**
  - Filter questions by department, course code (e.g. `CS201`, `EC302`), or search keywords.
  - Post formatted questions with markdown code blocks and optional image attachments.
  - Peer students post solutions; peers upvote helpful answers.
  - The question author can mark an answer as the **Accepted Answer** (verified solution).

### Module 5: Study Resource Library (Decision Table 4)
- **Path:** `/resources`, `/resources/upload`
- **Rules (Decision Table 4):**
  - Permitted file types: PDF, DOC, DOCX, PPT, PPTX, ZIP. Maximum file size: 20MB.
  - Resources require semester number (1–8), course code, course title, and department.
  - Categorized as `LECTURE_NOTES`, `QUESTION_PAPER`, `SYLLABUS`, `LAB_MANUAL`, or `REFERENCE_BOOK`.
  - Includes download tracking counter.

### Module 6: Lost-and-Found Recovery Desk (Decision Table 5)
- **Path:** `/lost-found`, `/lost-found/report`, `/lost-found/:id`
- **Rules (Decision Table 5):**
  - Report lost or found campus belongings with item name, category, location, date, and photo.
  - When a student spots their item, they submit an **Ownership Claim** with unique identifying proof.
  - Item status updates to `PENDING_VERIFICATION` upon claim submission.
  - Administrator reviews evidence in the admin console; upon approval, the item transitions to `RESOLVED` and the claimant receives an in-app notification.

### Module 7: Campus Event Hub & Seat Booking (Decision Table 7)
- **Path:** `/events`, `/events/:id`, `/events/my-registrations`
- **Rules (Decision Table 7):**
  - Discover upcoming workshops, hackathons, seminars, and cultural fests.
  - Shows real-time available seats and total capacity.
  - Atomic single-click seat booking decrements seat count atomically in MongoDB.
  - Generates a unique electronic ticket code: `REG-2026-XXXX`.
  - Compound index `{ eventId: 1, studentId: 1 }` prevents duplicate registrations.
  - Students can cancel registrations, automatically restoring the seat quota.

### Module 8: Zero-Knowledge Anonymous Grievance Portal
- **Path:** `/grievance/submit`, `/grievance/track`
- **Features:**
  - Category selection: `ACADEMIC`, `HOSTEL`, `INFRASTRUCTURE`, `ADMINISTRATIVE`, `HARASSMENT`, `OTHER`.
  - Detailed description with optional supporting evidence upload.
  - Zero reference to student identity or IP address is recorded.
  - Issues tracking code `GRV-2026-XXXX` for self-service timeline tracking.

### Module 9: Student Organization Discovery & Charter Application
- **Path:** `/clubs`, `/clubs/:id`, `/clubs/apply`
- **Features:**
  - Browse verified student clubs, read charter objectives, view faculty advisors and student leads.
  - Active students can submit an application for a new club charter, detailing proposed club name, category, mission, and lead contact.

### Module 10: Campus Recruitment & Placement Drives
- **Path:** `/placements`
- **Features:**
  - View active campus placement drives, job roles, CTC package, and deadlines.
  - Filter listings matching the student's department/branch.
  - Visual status indicator showing whether the student meets the minimum CGPA requirement.
