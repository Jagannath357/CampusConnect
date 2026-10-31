# Project Overview — CampusConnect

## 1. Project Identity and Institutional Mission

**Application Name:** CampusConnect  
**Application Tagline:** One Campus. One Community. One Connection.  
**Institution:** Silicon University, Bhubaneswar  
**Project Category:** Single-Campus Centralized University Web Portal  
**Target Environment:** Silicon University Prototype Deployment  

CampusConnect is designed to unify fragmented university communication channels into a centralized digital ecosystem. Prior to this platform, student communication, academic Q&A, syllabus resource distribution, lost item recovery, campus club management, grievance redressal, and administrative announcements relied on disparate social media groups, physical noticeboards, and unindexed email threads.

CampusConnect establishes two synchronized, role-guarded experiences operating over a unified backend and database:
1. **Student Portal:** A collaborative digital hub for students to discover project teammates, resolve academic questions, access verified course resources, reclaim lost belongings, register for official campus events, apply for club charters, access recruitment drives, and securely submit anonymous grievances.
2. **Administration Console:** An administrative governance hub for university faculty and staff to audit student records, moderate content, verify lost item claims, publish official events, broadcast emergency notifications across active websockets, route grievances to internal university departments, govern student organizations, post placement opportunities, and enforce university behavioral guidelines.

---

## 2. Scope Matrix: Active vs. Deferred Stories

The application has been strictly architected according to the Silicon University Software Engineering specification:

### Active User Stories (21 Modules Implemented)

| ID | Module Name | Role | Primary Objective |
| :--- | :--- | :--- | :--- |
| **US-01** | Student Dashboard | Student | Centralized telemetry, active collab requests, upcoming event tickets, unread alerts. |
| **US-02** | Student Profile Management | Student | Academic bio, branch, batch year, CGPA, skills tags, profile picture. |
| **US-03** | Teammate Collaboration Finder | Student | Discover and post project openings with required skillsets and member caps. |
| **US-04** | Peer Academic Q&A Forum | Student | Course-tagged academic queries, peer code solutions, upvoting, and answer acceptance. |
| **US-05** | Study Resource Library | Student | Centralized repository for lecture slides, past exams, and syllabus notes. |
| **US-06** | Lost-and-Found Recovery Desk | Student | Report lost/found campus items, attach photos/locations, submit ownership claims. |
| **US-07** | Campus Event Hub & Booking | Student | Real-time seat booking, overbooking prevention, and instant electronic token delivery. |
| **US-08** | Anonymous Grievance Portal | Student | Zero-knowledge complaint submission with unlinked tracking ticket (`GRV-2026-XXXX`). |
| **US-09** | Student Club Discovery | Student | Explore verified organizations, leadership contacts, and submit club charter requests. |
| **US-10** | Campus Placement Drives | Student | Placement listings with CGPA thresholds, branch eligibility filtering, and deadlines. |
| **US-11** | Student Account Auditing | Admin | Directory of enrolled students, profile inspection, status checks, and batch filtering. |
| **US-12** | Content Moderation | Admin | Moderate flagged collaboration posts, questions, and answers with audit logging. |
| **US-13** | Lost & Found Claims Verification | Admin | Match claimant proof against item descriptions, approve claims, and update status. |
| **US-14** | Live Activity Analytics | Admin | Recharts visualizations for event bookings, grievance distributions, and branch counts. |
| **US-15** | Single-Campus Configuration | Admin | Manage permitted email domains (`silicon.ac.in`) and university identity metadata. |
| **US-16** | Official Event Publishing | Admin | Schedule campus events, set attendee quotas, enforce date checks, and export attendee rosters. |
| **US-17** | Emergency System Broadcast | Admin | WebSocket push of critical red/amber banners to all active user sessions instantly. |
| **US-18** | Grievance Routing & Redressal | Admin | Categorize anonymous grievances, route to specific departments, and log resolution notes. |
| **US-19** | Student Club Governance | Admin | Review charter applications, approve/reject with notes, and grant verified status. |
| **US-20** | Placement Drive Management | Admin | Announce recruitment drives, configure CGPA and branch restrictions, and track deadlines. |
| **US-21** | Guideline Enforcement & Suspension | Admin | Suspend accounts with mandatory reason logging; immediate token revocation via `tokenVersion`. |

### Deferred User Stories (Excluded per Specification)

The following stories were explicitly marked as deferred from the current release:
1. **Story 9:** Daily timetable & venue mapping (deferred to Campus Facilities v2).
2. **Story 11:** Student peer-to-peer digital marketplace (deferred due to campus financial policy considerations).
3. **Story 12 & 23:** Specialized lab workstation & room reservation (deferred to University Facilities ERP).
4. **Story 25:** Automated weekly PDF activity report generation (deferred to Institutional Analytics v2).

---

## 3. Decision Tables Implementation Matrix

All 8 official Decision Tables from the project specification are completely implemented and verified:

| Table | Domain | Implemented Rules | Verification Status |
| :--- | :--- | :--- | :--- |
| **DT-1** | Student Account Lifecycle | Transitions between ACTIVE, INACTIVE, and SUSPENDED states. | Verified (100% test coverage) |
| **DT-2** | Student Self-Registration | Mandatory `@silicon.ac.in` domain check, field completeness, password length, and duplicate detection (Rule 5 HTTP 409 conflict). | Verified (100% test coverage) |
| **DT-3** | Teammate Finder Request | Skill matching, open slot check, active status requirement, duplicate application block. | Verified (100% test coverage) |
| **DT-4** | Study Resource Sharing | File type validation (PDF/DOC/ZIP), semester tagging, course code verification. | Verified (100% test coverage) |
| **DT-5** | Lost & Found Claim Verification | Identification proof match vs mismatch, status update to RESOLVED, claimant alert. | Verified (100% test coverage) |
| **DT-6** | Emergency Broadcast Dispatch | Admin authentication guard, high-priority critical flag, live WebSocket dispatch. | Verified (100% test coverage) |
| **DT-7** | Official Event Publishing | Future date validation, verified club authorization, atomic seat reservation. | Verified (100% test coverage) |
| **DT-8** | Account Guideline Enforcement | Immediate token revocation via `tokenVersion` increment, session purge, audit logging. | Verified (100% test coverage) |
