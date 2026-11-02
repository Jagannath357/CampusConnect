import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { LostFoundItem } from '../models/LostFoundItem.js';
import { OwnershipClaim } from '../models/OwnershipClaim.js';
import { Notification } from '../models/Notification.js';
import { uploadToStorage } from '../config/cloudinary.js';
import { emitNotificationToUser } from '../sockets/socketManager.js';

export const getItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { type, locationCategory, status, search, page = '1', limit = '10' } = req.query;

    const query: any = {};

    if (type) {
      query.type = type;
    }

    if (locationCategory) {
      query.locationCategory = locationCategory;
    }

    if (status) {
      query.status = status;
    } else {
      // Students see approved and pending verification items
      query.status = { $in: ['APPROVED', 'PENDING_VERIFICATION', 'RESOLVED'] };
    }

    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { locationCategory: { $regex: search, $options: 'i' } },
        { locationDetails: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await LostFoundItem.countDocuments(query);
    const items = await LostFoundItem.find(query)
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Lost and found items retrieved.',
      data: items,
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
      message: 'Failed to retrieve lost and found items.',
    });
  }
};

export const getItemById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await LostFoundItem.findById(id).populate('reporterId', 'name email');

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
      return;
    }

    // If caller is admin or reporter, fetch claims on this item
    let claims: any[] = [];
    if (
      req.user?.role === 'ADMIN' ||
      item.reporterId._id.toString() === req.user?.userId
    ) {
      claims = await OwnershipClaim.find({ itemId: id })
        .populate('claimantId', 'name email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      message: 'Item retrieved.',
      data: { item, claims },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve item details.',
    });
  }
};

export const createItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { type, itemName, locationCategory, locationDetails, description, dateOccurred } =
      req.body;

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (req.file) {
      const uploadResult = await uploadToStorage(req.file, 'lost-found');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const item = await LostFoundItem.create({
      reporterId: req.user?.userId,
      type,
      itemName,
      locationCategory,
      locationDetails,
      description,
      dateOccurred: dateOccurred ? new Date(dateOccurred) : new Date(),
      status: 'PENDING_VERIFICATION', // SRS Module 5: Defaults to Pending Verification
      imageUrl,
      imagePublicId,
    });

    res.status(201).json({
      success: true,
      message: 'Item report submitted successfully. It will be verified by campus admin.',
      data: item,
    });
  } catch (error) {
    console.error('[Create Item Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit item report.',
    });
  }
};

export const submitClaim = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { claimDescription, proofDetails } = req.body;

    const item = await LostFoundItem.findById(id);
    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Target item not found.',
      });
      return;
    }

    let proofFileUrl: string | undefined;
    if (req.file) {
      const uploadResult = await uploadToStorage(req.file, 'claims');
      proofFileUrl = uploadResult.url;
    }

    const claim = await OwnershipClaim.create({
      itemId: id,
      claimantId: req.user?.userId,
      claimDescription,
      proofDetails,
      proofFileUrl,
      status: 'PENDING',
    });

    // Notify the reporter that someone claimed their item
    if (item.reporterId.toString() !== req.user?.userId) {
      const notification = await Notification.create({
        recipientId: item.reporterId,
        title: 'New Ownership Claim Submitted',
        message: `An ownership claim was submitted for your reported item: "${item.itemName}".`,
        type: 'CLAIM',
        link: `/lost-found/${item._id}`,
      });
      emitNotificationToUser(item.reporterId.toString(), notification);
    }

    res.status(201).json({
      success: true,
      message: 'Ownership claim submitted successfully. Admin will review your supporting evidence.',
      data: claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit ownership claim.',
    });
  }
};

export const getMySubmissionsAndClaims = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const myItems = await LostFoundItem.find({ reporterId: req.user?.userId }).sort({
      createdAt: -1,
    });
    const myClaims = await OwnershipClaim.find({ claimantId: req.user?.userId })
      .populate('itemId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Submissions and claims retrieved.',
      data: {
        myItems,
        myClaims,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve submissions and claims.',
    });
  }
};

