import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AcademicResource } from '../models/AcademicResource.js';
import { uploadToStorage, deleteFromStorage, getDownloadUrl, isCloudinaryConfigured } from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';

export const getResources = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { courseCode, category, search, page = '1', limit = '10' } = req.query;

    const query: any = {};

    if (courseCode) {
      query.courseCode = (courseCode as string).toUpperCase();
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await AcademicResource.countDocuments(query);
    const resources = await AcademicResource.find(query)
      .populate('uploaderId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Resources retrieved.',
      data: resources,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resources.',
    });
  }
};

export const getResourceById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await AcademicResource.findById(id).populate('uploaderId', 'name email');

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Resource retrieved.',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resource.',
    });
  }
};

export const uploadResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please attach a document or study material file.',
      });
      return;
    }

    const { title, courseCode, category, description } = req.body;

    const uploadResult = await uploadToStorage(req.file, 'resources');

    const resource = await AcademicResource.create({
      uploaderId: req.user?.userId,
      title,
      courseCode: courseCode.toUpperCase(),
      category,
      description,
      fileUrl: uploadResult.url,
      filePublicId: uploadResult.publicId,
      fileName: req.file.originalname,
      fileMimeType: req.file.mimetype,
      fileSize: uploadResult.bytes,
      downloadCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully.',
      data: resource,
    });
  } catch (error) {
    console.error('[Upload Resource Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resource document.',
    });
  }
};

export const trackDownload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await AcademicResource.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
      return;
    }

    let downloadUrl = resource.fileUrl;
    if (isCloudinaryConfigured && resource.filePublicId && !resource.filePublicId.startsWith('local_')) {
      const isPdf = resource.fileMimeType === 'application/pdf' || resource.fileName.toLowerCase().endsWith('.pdf');
      const isImage = resource.fileMimeType?.startsWith('image/');
      const ext = path.extname(resource.fileName).replace('.', '').toLowerCase();
      downloadUrl = getDownloadUrl(
        resource.filePublicId,
        ext || (isPdf ? 'pdf' : undefined),
        isPdf || isImage ? 'image' : 'raw',
        true
      ) || resource.fileUrl;
    }

    res.status(200).json({
      success: true,
      message: 'Download tracked.',
      data: {
        downloadUrl,
        fileUrl: resource.fileUrl,
        fileName: resource.fileName,
        downloadCount: resource.downloadCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to track download.',
    });
  }
};

export const downloadResourceFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await AcademicResource.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
      return;
    }

    // Check if local file
    if (resource.fileUrl.startsWith('/uploads/') || resource.filePublicId?.startsWith('local_')) {
      const relativePath = resource.fileUrl.replace(/^\/uploads\//, '');
      const possibleFilePaths = [
        path.join(process.cwd(), 'uploads', relativePath),
        path.join(process.cwd(), 'backend', 'uploads', relativePath),
        path.resolve(process.cwd(), '../uploads', relativePath),
      ];
      for (const fp of possibleFilePaths) {
        if (fs.existsSync(fp)) {
          res.download(fp, resource.fileName);
          return;
        }
      }
    }

    // Cloudinary file
    if (isCloudinaryConfigured && resource.filePublicId && !resource.filePublicId.startsWith('local_')) {
      const isPdf = resource.fileMimeType === 'application/pdf' || resource.fileName.toLowerCase().endsWith('.pdf');
      const isImage = resource.fileMimeType?.startsWith('image/');
      const ext = path.extname(resource.fileName).replace('.', '').toLowerCase();
      const signedDownloadUrl = getDownloadUrl(
        resource.filePublicId,
        ext || (isPdf ? 'pdf' : undefined),
        isPdf || isImage ? 'image' : 'raw',
        true
      );

      if (signedDownloadUrl) {
        res.redirect(signedDownloadUrl);
        return;
      }
    }

    res.redirect(resource.fileUrl);
  } catch (error) {
    console.error('[Download Resource File Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resource file.',
    });
  }
};

export const deleteResource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await AcademicResource.findById(id);

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
      return;
    }

    if (resource.uploaderId.toString() !== req.user?.userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this resource.',
      });
      return;
    }

    if (resource.filePublicId) {
      const isPdf = resource.fileMimeType === 'application/pdf' || resource.fileName.toLowerCase().endsWith('.pdf');
      const isImage = resource.fileMimeType?.startsWith('image/');
      await deleteFromStorage(resource.filePublicId, isPdf || isImage ? 'image' : 'raw');
    }

    await AcademicResource.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource.',
    });
  }
};

