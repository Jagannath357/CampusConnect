# Testing Strategy & Automated Test Suite — CampusConnect

## 1. Testing Philosophy & Test Matrix

CampusConnect employs automated tests spanning backend unit tests, Decision Table rule verification, concurrency protection tests, and frontend UI component tests.

All tests run in isolated environments without touching production databases:
- **Backend:** Vitest with `mongodb-memory-server` (in-memory MongoDB instance).
- **Frontend:** Vitest with `jsdom` (headless DOM) and `@testing-library/react`.

---

## 2. Backend Automated Test Suite (30 Tests)

Located in `backend/tests/decisionTables.test.ts`.

### Decision Table Coverage

| Decision Table | Test Name | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **DT-1: Account Status** | Rule 1: Active student access | HTTP 200 on authenticated endpoint | Passed |
| **DT-1: Account Status** | Rule 2: Suspended student blocked | HTTP 403 Forbidden | Passed |
| **DT-2: Registration** | Rule 1: Permitted @silicon.ac.in domain | HTTP 201 Created | Passed |
| **DT-2: Registration** | Rule 2: Disallowed non-university domain | HTTP 400 Bad Request | Passed |
| **DT-2: Registration** | Rule 3: Missing required fields | HTTP 400 Validation Error | Passed |
| **DT-2: Registration** | Rule 4: Weak password (< 8 chars) | HTTP 400 Validation Error | Passed |
| **DT-2: Registration** | Rule 5: Duplicate email address | HTTP 409 Conflict | Passed |
| **DT-3: Teammate Finder** | Rule 1: Valid application to open post | HTTP 201 Application Created | Passed |
| **DT-3: Teammate Finder** | Rule 2: Duplicate application by same student | HTTP 400 Duplicate Blocked | Passed |
| **DT-3: Teammate Finder** | Rule 3: Application to non-existent post | HTTP 404 Not Found | Passed |
| **DT-4: Study Resources** | Rule 1: Valid PDF resource upload | HTTP 201 Created | Passed |
| **DT-4: Study Resources** | Rule 2: Disallowed executable/binary file | HTTP 400 File Filter Rejected | Passed |
| **DT-5: Lost & Found** | Rule 1: Valid ownership claim submitted | HTTP 201 Claim Created | Passed |
| **DT-5: Lost & Found** | Rule 2: Admin verifies claim matching proof | HTTP 200 Item RESOLVED | Passed |
| **DT-5: Lost & Found** | Rule 3: Evidence does not match | HTTP 200 Retained in PENDING | Passed |
| **DT-5: Lost & Found** | Rule 4: Claim for non-existent item | HTTP 404 Not Found | Passed |
| **DT-6: Emergency Broadcast**| Rule 1: Authorized admin dispatches alert | HTTP 201 Alert Broadcasted | Passed |
| **DT-6: Emergency Broadcast**| Rule 2: Student attempts emergency dispatch | HTTP 403 Forbidden | Passed |
| **DT-6: Emergency Broadcast**| Rule 3: Unauthenticated request blocked | HTTP 401 Unauthorized | Passed |
| **DT-7: Official Events** | Rule 1: Admin publishes valid future event | HTTP 201 Event Published | Passed |
| **DT-7: Official Events** | Rule 2: Non-verified club event creation | HTTP 403 Forbidden | Passed |
| **DT-7: Official Events** | Rule 3: Event scheduled in past date | HTTP 400 Bad Request | Passed |
| **DT-7: Official Events** | Rule 4: Atomic seat booking decrements quota | HTTP 201 Token Issued | Passed |
| **DT-7: Official Events** | Rule 5: Overbooking block (0 seats left) | HTTP 400 Sold Out | Passed |
| **DT-7: Official Events** | Rule 6: Duplicate registration block | HTTP 400 Already Registered | Passed |
| **DT-8: Suspension** | Rule 1: Admin suspends student | HTTP 200 Status SUSPENDED | Passed |
| **DT-8: Suspension** | Rule 1: Active token invalidated immediately | HTTP 401 / 403 on next call | Passed |
| **DT-8: Suspension** | Rule 2: Reactivation restores access | HTTP 200 Status ACTIVE | Passed |
| **Special: Grievance** | Pure anonymity (zero user references) | HTTP 201 GRV-2026-XXXX Ticket | Passed |
| **Special: Placements** | Branch and CGPA eligibility filtering | HTTP 200 Filtered Roster | Passed |

---

## 3. Frontend Automated Test Suite (6 Tests)

Located in `frontend/src/__tests__/App.test.tsx`.

1. **StatusBadge Rendering:** Validates that status strings (`ACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`, `RESOLVED`) map to accessible badges with appropriate Tailwind color classes.
2. **StatCard Metrics:** Verifies that metric titles, values, subtitles, and icons render accurately.
3. **EmptyState Interaction:** Confirms that empty state cards render default icons, custom messages, and trigger callback functions upon button click.
4. **LoadingSpinner Customization:** Verifies spinner accessibility, CSS animation classes (`animate-spin`), and customizable size parameters.
5. **ConfirmDialog Lifecycle:** Verifies that the confirmation modal displays warning text, handles confirmation callbacks, handles cancellation/dismissal, and unmounts when closed.
6. **LandingPage Institutional Identity:** Validates presence of "CampusConnect", "Silicon University", official tagline "One Campus. One Community. One Connection.", and primary login/registration buttons.

---

## 4. Running the Tests

```bash
# Run backend tests (in-memory MongoDB)
cd backend
npm run test

# Run frontend unit tests
cd frontend
npm run test

# Run all test suites from project root
npm run test
```

