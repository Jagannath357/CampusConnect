# File Upload Configuration — CampusConnect

## 1. Overview of File Storage Strategy

CampusConnect implements a dual-tier storage architecture designed to operate seamlessly in both cloud production environments and disconnected local development setups:

1. **Primary Cloud Tier:** Cloudinary CDN for cloud media asset hosting, responsive image transformations, and secure document storage.
2. **Local Filesystem Fallback:** When Cloudinary environment credentials are missing or the cloud API is unreachable, the system automatically falls back to local disk storage in `backend/uploads/`.

This ensures that development, offline testing, and automated test runners never fail due to third-party network or credential dependencies.

---

## 2. Multer In-Memory Buffering Configuration

File uploads are handled by Multer using memory storage:

```typescript
// backend/src/middleware/upload.ts
import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB maximum file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/x-zip-compressed',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});
```

---

## 3. Cloudinary Upload Engine & Fallback Mechanism

In `backend/src/config/cloudinary.ts`:

```typescript
export const uploadToStorage = async (
  file: Express.Multer.File,
  folder: string = 'general'
): Promise<UploadResult> => {
  // If Cloudinary credentials are fully configured, attempt cloud upload
  if (config.cloudinary.isConfigured) {
    try {
      return await uploadToCloudinary(file, folder);
    } catch (err) {
      console.warn('[Cloudinary Error] Falling back to local disk storage:', err);
      return await saveToLocalDisk(file, folder);
    }
  }

  // Fallback to local filesystem storage
  return await saveToLocalDisk(file, folder);
};
```

### Local Storage Mechanism
- Files are saved to `backend/uploads/<folder>/<filename>`.
- Filenames are generated using a timestamp and random suffix to avoid naming collisions:
  `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`
- The Express server serves local files statically at `/uploads`:
  ```typescript
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  ```

---

## 4. Production Cloudinary Configuration

To enable Cloudinary in production, set the following environment variables in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Uploaded documents and images will be securely hosted on Cloudinary under the `campusconnect/` folder with HTTPS delivery.

