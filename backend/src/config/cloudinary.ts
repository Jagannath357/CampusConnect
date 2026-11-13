import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Ensure environment variables are loaded across all directory execution models
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const getCredentials = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'campusconnect-app';
  const apiKey = process.env.CLOUDINARY_API_KEY || '531317255214464';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'fSWl_XwNpf4KBPEfL1A75bmQx98';
  return { cloudName, apiKey, apiSecret };
};

export const configureCloudinary = (): boolean => {
  const { cloudName, apiKey, apiSecret } = getCredentials();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return Boolean(cloudName && apiKey && apiSecret);
};

// Initialize immediately on module load
configureCloudinary();

export const isCloudinaryConfigured = true;

export interface UploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format?: string;
  resourceType?: string;
  downloadUrl?: string;
}

export const getDownloadUrl = (
  publicId: string,
  format?: string,
  resourceType: 'image' | 'raw' | 'auto' = 'image',
  attachment: boolean = true
): string => {
  if (!publicId || publicId.startsWith('local_')) {
    return '';
  }

  try {
    configureCloudinary();
    const cleanPublicId = publicId.replace(/\.[^/.]+$/, '');
    return cloudinary.url(format ? `${cleanPublicId}.${format}` : publicId, {
      resource_type: resourceType as any,
      secure: true,
      flags: attachment ? 'attachment' : undefined,
    });
  } catch (err) {
    console.warn('[Cloudinary] Failed to generate download URL:', err);
    return '';
  }
};

export const uploadToStorage = async (
  file: Express.Multer.File,
  folder: string = 'campusconnect'
): Promise<UploadResult> => {
  const isImage = file.mimetype.startsWith('image/');
  const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
  const ext = path.extname(file.originalname).toLowerCase();
  const cleanExt = ext.replace('.', '');
  const cleanBase = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
  const uniqueName = `${cleanBase}_${Date.now()}`;

  configureCloudinary();

  try {
    return await new Promise<UploadResult>((resolve, reject) => {
      const uploadOptions: Record<string, any> = {
        folder: `campusconnect/${folder}`,
        resource_type: isImage ? 'image' : isPdf ? 'auto' : 'raw',
        public_id: uniqueName,
      };

      if (isPdf) {
        uploadOptions.format = 'pdf';
      } else if (isImage && cleanExt) {
        uploadOptions.format = cleanExt;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            console.error('[Cloudinary Upload Error]', error);
            return reject(error || new Error('Cloudinary upload stream returned empty result'));
          }

          console.log(`[Cloudinary Upload Success] Public ID: ${result.public_id}, URL: ${result.secure_url}`);

          const fileFormat = result.format || cleanExt;
          const resolvedResourceType = (result.resource_type as 'image' | 'raw' | 'auto') || (isImage ? 'image' : 'raw');
          const downloadUrl = getDownloadUrl(result.public_id, fileFormat, resolvedResourceType, true) || result.secure_url;

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes || file.size,
            format: fileFormat,
            resourceType: resolvedResourceType,
            downloadUrl,
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  } catch (cloudinaryError: any) {
    console.error('[Cloudinary Upload Exception - Falling back to local storage]:', cloudinaryError?.message || cloudinaryError);

    // Fallback to local storage if network blocked
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const localFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadDir, localFileName);

    fs.writeFileSync(filePath, file.buffer);

    const localUrl = `/uploads/${folder}/${localFileName}`;
    return {
      url: localUrl,
      publicId: `local_${folder}_${localFileName}`,
      bytes: file.size,
      format: cleanExt,
      resourceType: isImage ? 'image' : 'raw',
      downloadUrl: localUrl,
    };
  }
};

export const uploadBufferToStorage = async (
  buffer: Buffer,
  filename: string,
  mimetype: string,
  folder: string = 'campusconnect'
): Promise<UploadResult> => {
  return uploadToStorage(
    {
      buffer,
      originalname: filename,
      mimetype,
      size: buffer.length,
      fieldname: 'file',
      encoding: '7bit',
      destination: '',
      filename,
      path: '',
      stream: null as any,
    },
    folder
  );
};

export const deleteFromStorage = async (
  publicId: string,
  resourceType: 'image' | 'raw' | 'video' | 'auto' = 'image'
): Promise<void> => {
  if (!publicId) return;
  if (publicId.startsWith('local_')) {
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

  try {
    configureCloudinary();
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType as any });
    console.log(`[Cloudinary Destroy] Successfully removed asset ${publicId}`);
  } catch (e) {
    console.warn('Failed to delete cloudinary file:', e);
  }
};

export default cloudinary;
