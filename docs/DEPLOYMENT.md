# Production Deployment Guide — CampusConnect

## 1. Target Deployment Infrastructure

| Component | Platform | Configuration |
| :--- | :--- | :--- |
| **Frontend** | Vercel | Single-Page Application (SPA) with Vite build preset. |
| **Backend** | Render | Node.js web service running Express and Socket.IO. |
| **Database** | MongoDB Atlas | Managed cloud MongoDB cluster (M0 or dedicated). |
| **Media Assets** | Cloudinary | Cloud storage with global CDN distribution. |
| **Source Control** | GitHub | Main repository branch triggering CI/CD pipelines. |

---

## 2. Frontend Deployment (Vercel)

### Build Settings
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment Variables
```env
VITE_API_URL=https://campusconnect-backend.onrender.com/api
VITE_SOCKET_URL=https://campusconnect-backend.onrender.com
```

### SPA Routing Configuration (`vercel.json`)
Create `frontend/vercel.json` if needed to route all client requests to `index.html`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 3. Backend Deployment (Render)

### Service Settings
- **Environment:** Node
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node dist/server.js`
- **Plan:** Web Service

### Environment Variables
```env
NODE_ENV=production
PORT=10000
CLIENT_URL=https://campusconnect-silicon.vercel.app
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusconnect?retryWrites=true&w=majority
JWT_SECRET=production-grade-256bit-random-secret-key-silicon
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=500
CLOUDINARY_CLOUD_NAME=silicon-campusconnect
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 4. Post-Deployment Database Initialization

Once the backend is live and connected to MongoDB Atlas, execute the admin initialization script or seed script via the Render shell:

```bash
# In Render Shell or locally pointing to Atlas URI:
npm run bootstrap:admin
# Or for a complete sample dataset:
npm run seed
```

This ensures that the official administrator account (`admin@silicon.ac.in`) and initial allowed email domains (`silicon.ac.in`) are persisted in MongoDB Atlas.

