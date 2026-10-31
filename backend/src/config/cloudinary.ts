import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(
  cloudName && apiKey && apiSecret && cloudName !== 'your_cloudinary_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log('[Cloudinary] Configured with cloud name:', cloudName);
} else {
  console.log('[Cloudinary] Cloudinary not fully configured. Using local file storage fallback for uploads.');
}

export interface UploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format?: string;
}

export const uploadToStorage = async (
  file: Express.Multer.File,
  folder: string = 'campusconnect'
): Promise<UploadResult> => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `campusconnect/${folder}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // Fallback to local storage
  const uploadDir = path.join(process.cwd(), 'uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(file.originalname);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  fs.writeFileSync(filePath, file.buffer);

  const localUrl = `/uploads/${folder}/${uniqueName}`;
  return {
    url: localUrl,
    publicId: `local_${folder}_${uniqueName}`,
    bytes: file.size,
    format: ext.replace('.', ''),
  };
};

export const deleteFromStorage = async (publicId: string): Promise<void> => {
  if (publicId.startsWith('local_')) {
    // Local file cleanup
    try {
      const parts = publicId.split('_');
      if (parts.length >= 3) {
        const folder = parts[1];
        const filename = parts.slice(2).join('_');
        const filePath = path.join(process.cwd(), 'uploads', folder, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (e) {
      console.warn('Failed to delete local file:', e);
    }
    return;
  }

  if (isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.warn('Failed to delete cloudinary file:', e);
    }
  }
};

export default cloudinary;
