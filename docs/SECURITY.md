# Security Policies & Compliance — CampusConnect

## 1. Security Architecture Overview

CampusConnect implements defense-in-depth across the application lifecycle to protect institutional data, prevent unauthorized access, and ensure student privacy.

---

## 2. Security Controls & Implementations

### 1. HTTP Header Hardening (Helmet)
Express uses `helmet()` to set standard security headers:
- `Content-Security-Policy`: Restricts resource loading to trusted domains.
- `Strict-Transport-Security` (HSTS): Enforces HTTPS connections.
- `X-Frame-Options`: Prevents clickjacking by blocking iframe embedding.
- `X-Content-Type-Options`: Prevents MIME-type sniffing (`nosniff`).
- `X-DNS-Prefetch-Control`: Disables DNS prefetching to avoid data leakage.

### 2. Cross-Origin Resource Sharing (CORS)
- In development: Allows requests from `http://localhost:5173`.
- In production: Strictly whitelist-restricted to configured frontend deployment domains via the `CLIENT_URL` environment variable.

### 3. Rate Limiting & Abuse Prevention
Express Rate Limit protects API routes against brute-force credential stuffing and denial-of-service attempts:
- General endpoints: Max 500 requests per 15-minute window per IP.
- Authentication endpoints (`/api/auth/login`, `/api/auth/register`): Max 20 attempts per 15-minute window per IP.

### 4. Password Security
- Passwords are encrypted using `bcryptjs` with **10 salt rounds**.
- Plaintext passwords are never stored in the database or logged in application traces.
- Password requirements: Minimum 8 characters, requiring mixed alphanumeric characters.

### 5. Input Validation & Injection Prevention
- All incoming payloads (`req.body`, `req.query`, `req.params`) are strictly validated using **Zod schemas**.
- NoSQL injection is mitigated by Mongoose schema constraints, avoiding arbitrary raw `$where` clauses and using typed parameterized queries.

### 6. Anonymous Grievance Zero-Knowledge Protection
- The `Grievance` model explicitly excludes all `userId`, student references, or IP addresses.
- Submission logs do not record origin IP addresses for grievance endpoints.
- Redressal occurs solely via randomly generated alphanumeric tickets (`GRV-2026-XXXX`).

### 7. Immutable Administrative Audit Logging
- Every administrative action (`USER_SUSPEND`, `USER_REACTIVATE`, `CONTENT_MODERATE`, `LOST_FOUND_RESOLVE`, `EVENT_PUBLISH`, `EMERGENCY_BROADCAST`, `CONFIG_UPDATE`) is logged to the `AdminAuditLog` collection.
- Logs include administrator ID, timestamp, target entity, client IP address, User-Agent, and full request details.
- No update or delete endpoints exist for audit logs.

