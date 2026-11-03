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
  resourceType?: string;
  downloadUrl?: string;
}

export const getDownloadUrl = (
  publicId: string,
  format?: string,
  resourceType: 'image' | 'raw' | 'auto' = 'image',
  attachment: boolean = true
): string => {
  if (!isCloudinaryConfigured || !publicId || publicId.startsWith('local_')) {
    return '';
  }

  try {
    return cloudinary.utils.private_download_url(publicId, format || '', {
      resource_type: resourceType as any,
      type: 'upload',
      attachment,
    });
  } catch (err) {
    console.warn('[Cloudinary] Failed to generate private download URL:', err);
    return cloudinary.url(publicId, {
      resource_type: resourceType as any,
      secure: true,
      flags: attachment ? 'attachment' : undefined,
    });
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

  if (isCloudinaryConfigured) {
    const resourceType: 'image' | 'raw' | 'auto' = isImage || isPdf ? 'image' : 'raw';

    return new Promise((resolve, reject) => {
      const uploadOptions: Record<string, any> = {
        folder: `campusconnect/${folder}`,
        resource_type: resourceType,
      };

      if (isPdf) {
        uploadOptions.format = 'pdf';
        uploadOptions.public_id = uniqueName;
      } else if (isImage) {
        if (cleanExt) uploadOptions.format = cleanExt;
        uploadOptions.public_id = uniqueName;
      } else {
        // Raw documents (docx, pptx, xlsx, txt)
        uploadOptions.public_id = `${uniqueName}${ext}`;
        uploadOptions.resource_type = 'raw';
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload stream failed'));
          }

          const fileFormat = result.format || cleanExt;
          const resolvedResourceType = (result.resource_type as 'image' | 'raw' | 'auto') || resourceType;
          const downloadUrl = getDownloadUrl(result.public_id, fileFormat, resolvedResourceType, true);

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: fileFormat,
            resourceType: resolvedResourceType,
            downloadUrl,
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
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType as any });
    } catch (e) {
      console.warn('Failed to delete cloudinary file:', e);
    }
  }
};

export default cloudinary;

