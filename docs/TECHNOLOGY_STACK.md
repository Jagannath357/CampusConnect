# Technology Stack — CampusConnect

## 1. Overview of Technology Decisions

The CampusConnect platform is built using a modern, scalable, and strongly-typed technology stack. TypeScript is enforced across both client and server codebases to ensure end-to-end type safety, prevent runtime reference errors, and maintain strict contract synchronization between API payloads and client state.

---

## 2. Frontend Technology Stack

| Layer / Library | Version | Role in Architecture |
| :--- | :--- | :--- |
| **React** | 18.3.1 | Core component-based declarative view layer. |
| **TypeScript** | 5.8.2 | Static typing, interface contracts, and compiler validation. |
| **Vite** | 5.4.14 | High-performance build tool, ESM development server, Rollup bundling. |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework for responsive layout design. |
| **Lucide React** | 0.477.0 | Icon library providing accessible SVG iconography. |
| **React Router DOM** | 6.30.0 | Client-side routing, protected route guards, and nested layouts. |
| **TanStack Query (React Query)** | 5.67.1 | Asynchronous server state caching, background refetching, and pagination. |
| **React Hook Form** | 7.54.2 | High-performance uncontrolled form state management with low re-renders. |
| **Zod** | 3.24.2 | Schema validation for user inputs and API responses. |
| **Recharts** | 2.15.1 | Composable SVG data visualizations (Bar Charts, Pie Charts). |
| **Axios** | 1.8.1 | Promise-based HTTP client with request/response interceptors for JWT. |
| **Socket.IO Client** | 4.8.1 | Real-time bi-directional WebSocket client for notifications and emergency alerts. |
| **Vitest & React Testing Library** | 3.0.8 / 16.2.0 | Unit and component integration testing in a `jsdom` virtual browser environment. |

---

## 3. Backend Technology Stack

| Layer / Library | Version | Role in Architecture |
| :--- | :--- | :--- |
| **Node.js** | v20+ / v22+ | Asynchronous event-driven server runtime environment. |
| **Express.js** | 5.x | Web application framework for RESTful routing and middleware. |
| **TypeScript** | 5.8.2 | Typed backend controllers, models, validators, and utility functions. |
| **MongoDB Atlas / MongoDB Community** | v8.0.4 | Document-oriented NoSQL database for flexible data persistence. |
| **Mongoose ODM** | 8.12.1 | Schema modeling, compound indexes, middleware hooks, and atomic operations. |
| **JSON Web Tokens (jsonwebtoken)** | 9.0.2 | Stateless, digitally signed user authentication tokens with expiration. |
| **bcryptjs** | 3.0.2 | Secure cryptographic password hashing with 10 salt rounds. |
| **Socket.IO** | 4.8.1 | Real-time WebSocket server with rooms (`user_${id}`, `role_ADMIN`). |
| **Zod** | 3.24.2 | Declarative server-side request body and query parameter validation middleware. |
| **Helmet** | 8.0.0 | HTTP response headers security middleware (CSP, XSS protection, HSTS). |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing control with configurable client origins. |
| **Express Rate Limit** | 7.5.0 | IP-based request throttling to prevent brute-force attacks and abuse. |
| **Multer** | 1.4.5-lts.1 | Multipart/form-data handler for secure file uploads. |
| **Cloudinary SDK** | 2.5.1 | Cloud asset storage for images and documents with automatic local disk fallback. |
| **Vitest** | 3.0.8 | Test runner with mongodb-memory-server for unit and decision table tests. |

---

## 4. Database & Storage Architecture

### MongoDB Mongoose ODM
- **Document Model:** Flexible JSON documents representing university entities (e.g. users, questions, events, claims).
- **Compound Indexes:** Optimized query execution and uniqueness enforcement (e.g., `{ eventId: 1, studentId: 1 }` on `EventRegistration` to prevent duplicate event reservations).
- **Atomic Operations:** Critical state changes (such as event seat decrements) use atomic `findOneAndUpdate({ _id, availableSeats: { $gt: 0 } }, { $inc: { availableSeats: -1 } })` to eliminate race conditions under concurrent requests.

### Media & Document Storage
- **Cloudinary Storage:** Primary cloud storage provider for user avatars, lost item photographs, event banners, and academic PDFs.
- **Local Filesystem Fallback:** When Cloudinary credentials are not configured or cloud services are unreachable, the system automatically falls back to storing uploads locally in `/uploads` on the backend server, exposing them via an Express static file route.
