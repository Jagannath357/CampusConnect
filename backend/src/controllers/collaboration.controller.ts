import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { CollaborationPost } from '../models/CollaborationPost.js';
import { StudentProfile } from '../models/StudentProfile.js';

export const getPosts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { domain, skill, search, status = 'OPEN', page = '1', limit = '10' } = req.query;

    const query: any = { isModerated: false };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (domain) {
      query.domain = domain;
    }

    if (skill) {
      query.requiredSkills = { $in: [skill] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await CollaborationPost.countDocuments(query);
    const posts = await CollaborationPost.find(query)
      .populate('creatorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Collaboration posts retrieved.',
      data: posts,
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
      message: 'Failed to retrieve collaboration posts.',
    });
  }
};

export const getPostById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await CollaborationPost.findOne({ _id: id, isModerated: false }).populate(
      'creatorId',
      'name email'
    );

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Collaboration post not found.',
      });
      return;
    }

    // fetch creator's profile
    const profile = await StudentProfile.findOne({ userId: post.creatorId._id });

    res.status(200).json({
      success: true,
      message: 'Post retrieved.',
      data: { post, creatorProfile: profile },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve collaboration post.',
    });
  }
};

export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      domain,
      requiredSkills,
      vacancyCount,
      vacancyDescription,
      contactInfo,
      tags,
    } = req.body;

    const post = await CollaborationPost.create({
      creatorId: req.user?.userId,
      title,
      description,
      domain,
      requiredSkills,
      vacancyCount,
      vacancyDescription,
      contactInfo,
      tags,
      status: 'OPEN',
      isModerated: false,
    });

    res.status(201).json({
      success: true,
      message: 'Collaboration post published successfully.',
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create collaboration post.',
    });
  }
};

export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await CollaborationPost.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
      return;
    }

    // Enforce ownership check or Admin
    if (post.creatorId.toString() !== req.user?.userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this post.',
      });
      return;
    }

    Object.assign(post, req.body);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update post.',
    });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await CollaborationPost.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
      return;
    }

    // Enforce ownership check or Admin
    if (post.creatorId.toString() !== req.user?.userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this post.',
      });
      return;
    }

    await CollaborationPost.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete post.',
    });
  }
};

