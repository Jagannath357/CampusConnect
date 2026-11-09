import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { CollaborationPost } from '../models/CollaborationPost.js';
import { AcademicQuestion } from '../models/AcademicQuestion.js';
import { AcademicAnswer } from '../models/AcademicAnswer.js';
import { AcademicResource } from '../models/AcademicResource.js';
import { LostFoundItem } from '../models/LostFoundItem.js';
import { OwnershipClaim } from '../models/OwnershipClaim.js';
import { Event } from '../models/Event.js';
import { EventRegistration } from '../models/EventRegistration.js';
import { Grievance } from '../models/Grievance.js';
import { EmergencyAlert } from '../models/EmergencyAlert.js';
import { Club } from '../models/Club.js';
import { ClubApplication } from '../models/ClubApplication.js';
import { Placement } from '../models/Placement.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { UserSession } from '../models/UserSession.js';
import { SuspensionRecord } from '../models/SuspensionRecord.js';
import { SystemConfiguration } from '../models/SystemConfiguration.js';
import { Notification } from '../models/Notification.js';
import { recordAdminAudit } from '../middleware/audit.js';
import { emitEmergencyBroadcast, emitNotificationToUser } from '../sockets/socketManager.js';
import { uploadToStorage } from '../config/cloudinary.js';

// MODULE 14: Live Activity Analytics & Overview Stats
export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const [
      totalStudents,
      activeStudents,
      suspendedStudents,
      totalCollabPosts,
      totalQuestions,
      totalResources,
      totalLostFound,
      pendingVerificationItems,
      totalEvents,
      totalRegistrations,
      pendingGrievances,
      totalVerifiedClubs,
      activePlacements,
    ] = await Promise.all([
      User.countDocuments({ role: 'STUDENT' }),
      User.countDocuments({ role: 'STUDENT', status: 'ACTIVE' }),
      User.countDocuments({ role: 'STUDENT', status: 'SUSPENDED' }),
      CollaborationPost.countDocuments(),
      AcademicQuestion.countDocuments(),
      AcademicResource.countDocuments(),
      LostFoundItem.countDocuments(),
      LostFoundItem.countDocuments({ status: 'PENDING_VERIFICATION' }),
      Event.countDocuments(),
      EventRegistration.countDocuments({ status: 'CONFIRMED' }),
      Grievance.countDocuments({ status: { $in: ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS'] } }),
      Club.countDocuments({ isVerified: true }),
      Placement.countDocuments({ status: 'ACTIVE' }),
    ]);

    // Analytics charts aggregation
    // 1. Registrations per event (top 5)
    const eventStats = await EventRegistration.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: '$eventId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'eventInfo',
        },
      },
      { $unwind: '$eventInfo' },
      {
        $project: {
          name: '$eventInfo.title',
          registrations: '$count',
          capacity: '$eventInfo.maxCapacity',
        },
      },
    ]);

    // 2. Grievances by category
    const grievancesByCategory = await Grievance.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    // 3. Students by branch
    const studentsByBranch = await StudentProfile.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { branch: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Dashboard analytics aggregated.',
      data: {
        summary: {
          totalStudents,
          activeStudents,
          suspendedStudents,
          totalCollabPosts,
          totalQuestions,
          totalResources,
          totalLostFound,
          pendingVerificationItems,
          totalEvents,
          totalRegistrations,
          pendingGrievances,
          totalVerifiedClubs,
          activePlacements,
        },
        charts: {
          eventStats,
          grievancesByCategory,
          studentsByBranch,
        },
      },
    });
  } catch (error) {
    console.error('[Dashboard Stats Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to aggregate dashboard analytics.',
    });
  }
};

// MODULE 11: Student Account Auditing
export const getStudents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { search, department, batchYear, status, page = '1', limit = '10' } = req.query;

    const userQuery: any = { role: 'STUDENT' };

    if (status) {
      userQuery.status = status;
    }

    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(userQuery);
    const users = await User.find(userQuery)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Populate student profiles
    const userIds = users.map((u) => u._id);
    const profileQuery: any = { userId: { $in: userIds } };
    if (department) profileQuery.department = department;
    if (batchYear) profileQuery.batchYear = parseInt(batchYear as string, 10);

    const profiles = await StudentProfile.find(profileQuery);
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    const combined = users.map((user) => ({
      user,
      profile: profileMap.get(user._id.toString()) || null,
    }));

    res.status(200).json({
      success: true,
      message: 'Students retrieved.',
      data: combined,
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
      message: 'Failed to retrieve student accounts.',
    });
  }
};

export const getStudentDetails = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, role: 'STUDENT' }).select('-passwordHash');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
      return;
    }

    const profile = await StudentProfile.findOne({ userId: id });
    const suspensions = await SuspensionRecord.find({ studentId: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Student details retrieved.',
      data: { user, profile, suspensions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve student details.',
    });
  }
};

// MODULE 21: Guideline Enforcement & User Suspension (Decision Table 8)
export const suspendStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason, startDate, endDate } = req.body;
    const adminId = req.user!.userId;

    // Decision Table 8 - Rule 3: Target student account exists?
    const student = await User.findOne({ _id: id, role: 'STUDENT' });
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Target student account not found.',
      });
      return;
    }

    // Decision Table 8 - Rule 1 Actions:
    // 1. Set account status to Suspended
    student.status = 'SUSPENDED';

    // 2. Invalidate active JWT/session tokens immediately by incrementing tokenVersion
    student.tokenVersion = (student.tokenVersion || 0) + 1;
    await student.save();

    // Remove active sessions from UserSession collection
    await UserSession.deleteMany({ userId: id });

    // Record suspension entry
    const suspension = await SuspensionRecord.create({
      studentId: student._id,
      suspendedBy: adminId,
      reason,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      isActive: true,
    });

    // Record append-only administrative audit log
    await recordAdminAudit(
      adminId,
      'USER_SUSPEND',
      'User',
      student._id.toString(),
      { reason, startDate, endDate, suspensionId: suspension._id },
      req
    );

    res.status(200).json({
      success: true,
      message:
        'Student account has been suspended and all active authentication tokens have been immediately revoked.',
      data: {
        userId: student._id,
        status: student.status,
        tokenVersion: student.tokenVersion,
        suspension,
      },
    });
  } catch (error) {
    console.error('[Suspend Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to suspend student account.',
    });
  }
};

export const reactivateStudent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reactivationNotes } = req.body;
    const adminId = req.user!.userId;

    const student = await User.findOne({ _id: id, role: 'STUDENT' });
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
      return;
    }

    student.status = 'ACTIVE';
    await student.save();

    await SuspensionRecord.updateMany(
      { studentId: id, isActive: true },
      {
        $set: {
          isActive: false,
          reactivatedBy: adminId,
          reactivatedAt: new Date(),
          reactivationNotes: reactivationNotes || 'Reactivated by campus administrator.',
        },
      }
    );

    await recordAdminAudit(
      adminId,
      'USER_REACTIVATE',
      'User',
      student._id.toString(),
      { reactivationNotes },
      req
    );

    res.status(200).json({
      success: true,
      message: 'Student account has been reactivated successfully.',
      data: {
        userId: student._id,
        status: student.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate student account.',
    });
  }
};

export const getSuspensionHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const records = await SuspensionRecord.find()
      .populate('studentId', 'name email')
      .populate('suspendedBy', 'name email')
      .populate('reactivatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Suspension history retrieved.',
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve suspension history.',
    });
  }
};

// MODULE 12: Content Moderation
export const getModerationContent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const posts = await CollaborationPost.find({ isModerated: true })
      .populate('creatorId', 'name email')
      .sort({ updatedAt: -1 });

    const questions = await AcademicQuestion.find({ isModerated: true })
      .populate('authorId', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Moderated content retrieved.',
      data: { posts, questions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve moderated content.',
    });
  }
};

export const moderateContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const contentType = String(req.params.contentType);
    const id = String(req.params.id);
    const { reason, action = 'REMOVE' } = req.body;
    const adminId = req.user!.userId;

    const isModerated = action === 'REMOVE';

    if (contentType === 'collaboration') {
      const post = await CollaborationPost.findByIdAndUpdate(
        id,
        { isModerated },
        { new: true }
      );
      if (!post) {
        res.status(404).json({ success: false, message: 'Post not found.' });
        return;
      }
    } else if (contentType === 'question') {
      const q = await AcademicQuestion.findByIdAndUpdate(
        id,
        { isModerated },
        { new: true }
      );
      if (!q) {
        res.status(404).json({ success: false, message: 'Question not found.' });
        return;
      }
    } else if (contentType === 'answer') {
      const a = await AcademicAnswer.findByIdAndUpdate(
        id,
        { isModerated },
        { new: true }
      );
      if (!a) {
        res.status(404).json({ success: false, message: 'Answer not found.' });
        return;
      }
    } else {
      res.status(400).json({ success: false, message: 'Invalid content type.' });
      return;
    }

    await recordAdminAudit(
      adminId,
      'CONTENT_MODERATE',
      contentType,
      id,
      { action, reason },
      req
    );

    res.status(200).json({
      success: true,
      message: `Content ${isModerated ? 'removed from student feed' : 'restored'} successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to moderate content.',
    });
  }
};

// MODULE 13: Lost-and-Found Ownership Verification (Decision Table 5)
export const getAdminLostFoundItems = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, type } = req.query;
    const query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const items = await LostFoundItem.find(query)
      .populate('reporterId', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    const claims = await OwnershipClaim.find()
      .populate('itemId')
      .populate('claimantId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const claimantUserIds = claims.map((c: any) => c.claimantId?._id).filter(Boolean);
    const profiles = await StudentProfile.find({ userId: { $in: claimantUserIds } }).lean();
    const profileMap = new Map(profiles.map((p: any) => [p.userId.toString(), p]));

    const enrichedClaims = claims.map((claim: any) => ({
      ...claim,
      claimantProfile: claim.claimantId?._id
        ? profileMap.get(claim.claimantId._id.toString()) || null
        : null,
    }));

    res.status(200).json({
      success: true,
      message: 'Lost and found administrative items retrieved.',
      data: { items, claims: enrichedClaims },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve items.',
    });
  }
};

export const verifyLostFoundItem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { claimId, resolutionNotes, evidenceMatches = true } = req.body;
    const adminId = req.user!.userId;

    // Decision Table 5 - Rule 4: Target item exists?
    const item = await LostFoundItem.findById(id);
    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Target lost/found item not found.',
      });
      return;
    }

    // Decision Table 5 - Rule 2: Evidence does not match?
    if (!evidenceMatches) {
      // Retain item in PENDING_VERIFICATION
      if (claimId) {
        const rejectedClaim = await OwnershipClaim.findByIdAndUpdate(
          claimId,
          {
            status: 'REJECTED',
            reviewedBy: adminId,
            reviewedAt: new Date(),
            reviewNotes: resolutionNotes || 'Claim rejected: Submitted proof does not match reported item.',
          },
          { new: true }
        );

        if (rejectedClaim) {
          const notification = await Notification.create({
            recipientId: rejectedClaim.claimantId,
            title: 'Ownership Claim Rejected',
            message: `Your ownership claim for "${item.itemName}" was reviewed: ${
              resolutionNotes || 'Submitted proof did not match the reported item.'
            }`,
            type: 'CLAIM',
            link: `/lost-found/${item._id}`,
          });
          emitNotificationToUser(rejectedClaim.claimantId.toString(), notification);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Claim rejected. Item retained in Pending Verification status.',
        data: { itemStatus: item.status },
      });
      return;
    }

    // Decision Table 5 - Rule 1 Actions:
    // 1. Change item status to Resolved
    // 2. Append admin ID and resolution timestamp
    item.status = 'RESOLVED';
    item.resolvedBy = adminId as any;
    item.resolvedAt = new Date();
    item.resolutionNotes = resolutionNotes || 'Ownership verified and approved by campus administrator.';
    await item.save();

    // If claim approved, update claim
    let claimantId = null;
    if (claimId) {
      const claim = await OwnershipClaim.findByIdAndUpdate(
        claimId,
        {
          status: 'APPROVED',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          reviewNotes: resolutionNotes,
        },
        { new: true }
      );
      if (claim) {
        claimantId = claim.claimantId.toString();
      }

      // Reject any other pending claims on this item
      const otherClaims = await OwnershipClaim.find({
        itemId: item._id,
        _id: { $ne: claimId },
        status: 'PENDING',
      });

      for (const other of otherClaims) {
        other.status = 'REJECTED';
        other.reviewedBy = adminId as any;
        other.reviewedAt = new Date();
        other.reviewNotes = 'Item was verified and released to another verified claimant.';
        await other.save();

        const notif = await Notification.create({
          recipientId: other.claimantId,
          title: 'Ownership Claim Update',
          message: `Your ownership claim for "${item.itemName}" was not approved because ownership was verified for another claimant.`,
          type: 'CLAIM',
          link: `/lost-found/${item._id}`,
        });
        emitNotificationToUser(other.claimantId.toString(), notif);
      }
    }

    // 3. Send resolution alert to claimant
    if (claimantId) {
      const notification = await Notification.create({
        recipientId: claimantId,
        title: 'Ownership Claim Verified & Resolved!',
        message: `Your ownership claim for "${item.itemName}" was approved by administration. You may collect your item.`,
        type: 'CLAIM',
        link: `/lost-found/${item._id}`,
      });
      emitNotificationToUser(claimantId, notification);
    }

    await recordAdminAudit(
      adminId,
      'LOST_FOUND_RESOLVE',
      'LostFoundItem',
      item._id.toString(),
      { resolutionNotes, claimId },
      req
    );

    res.status(200).json({
      success: true,
      message: 'Item ownership verified. Marked as Resolved.',
      data: item,
    });
  } catch (error) {
    console.error('[Verify Lost/Found Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify lost/found item.',
    });
  }
};

// MODULE 16: Official Event Publishing (Decision Table 7)
export const createOfficialEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      organizer,
      organizerClubId,
      maxCapacity,
      status = 'PUBLISHED',
    } = req.body;
    const adminId = req.user!.userId;

    // Decision Table 7 - Check event date (not in past)
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      res.status(400).json({
        success: false,
        message: 'Invalid event date: Cannot schedule an official event in the past.',
      });
      return;
    }

    // If created on behalf of a club, check club verification (Decision Table 7 - Rule 2)
    if (organizerClubId) {
      const club = await Club.findById(organizerClubId);
      if (!club || !club.isVerified) {
        res.status(403).json({
          success: false,
          message: 'Blocked: Only verified student clubs can publish official campus events.',
        });
        return;
      }
    }

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;
    if (req.file) {
      const uploadResult = await uploadToStorage(req.file, 'events');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const event = await Event.create({
      title,
      description,
      category,
      date: eventDate,
      startTime,
      endTime,
      venue,
      organizer,
      organizerClubId: organizerClubId || undefined,
      createdBy: adminId,
      maxCapacity,
      availableSeats: maxCapacity,
      status,
      imageUrl,
      imagePublicId,
    });

    await recordAdminAudit(
      adminId,
      'EVENT_PUBLISH',
      'Event',
      event._id.toString(),
      { title, date, venue, maxCapacity },
      req
    );

    res.status(201).json({
      success: true,
      message: 'Official campus event published successfully.',
      data: event,
    });
  } catch (error) {
    console.error('[Create Event Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create official event.',
    });
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = req.user!.userId;

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    // Handle image update if supplied
    if (req.file) {
      const uploadResult = await uploadToStorage(req.file, 'events');
      event.imageUrl = uploadResult.url;
      event.imagePublicId = uploadResult.publicId;
    }

    // If maxCapacity updated, adjust availableSeats proportionally
    if (req.body.maxCapacity && req.body.maxCapacity !== event.maxCapacity) {
      const bookedCount = event.maxCapacity - event.availableSeats;
      event.maxCapacity = req.body.maxCapacity;
      event.availableSeats = Math.max(0, event.maxCapacity - bookedCount);
    }

    Object.assign(event, req.body);
    await event.save();

    await recordAdminAudit(adminId, 'EVENT_UPDATE', 'Event', event._id.toString(), req.body, req);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event.',
    });
  }
};

export const getEventRegistrations = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const registrations = await EventRegistration.find({ eventId: id, status: 'CONFIRMED' })
      .populate('studentId', 'name email')
      .sort({ registeredAt: -1 });

    const studentIds = registrations.map((r) => r.studentId._id);
    const profiles = await StudentProfile.find({ userId: { $in: studentIds } });
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    const combined = registrations.map((r) => ({
      registrationToken: r.registrationToken,
      registeredAt: r.registeredAt,
      student: r.studentId,
      profile: profileMap.get(r.studentId._id.toString()) || null,
    }));

    res.status(200).json({
      success: true,
      message: 'Registrations retrieved.',
      data: combined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations.',
    });
  }
};

// MODULE 17: Emergency System Broadcast (Decision Table 6)
export const broadcastEmergencyAlert = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Decision Table 6 - Rule 2 & 3: User authenticated and role is Admin
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Only authorized campus administrators can dispatch emergency alerts.',
      });
      return;
    }

    const { title, message, isCritical = true, expiresAt } = req.body;
    const adminId = req.user.userId;

    // Decision Table 6 - Rule 1 Actions:
    // 1. Apply high-priority critical flag
    const alert = await EmergencyAlert.create({
      title,
      message,
      issuedBy: adminId,
      isCritical: Boolean(isCritical),
      broadcastAt: new Date(),
      active: true,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    const populatedAlert = await EmergencyAlert.findById(alert._id).populate('issuedBy', 'name email');

    // 2. Broadcast through active WebSocket channels with full details
    emitEmergencyBroadcast({
      _id: alert._id,
      id: alert._id,
      title: alert.title,
      message: alert.message,
      isCritical: alert.isCritical,
      active: alert.active,
      broadcastAt: alert.broadcastAt,
      issuedBy: populatedAlert?.issuedBy || { name: 'Silicon University Administration' },
    });

    // Record administrative audit log
    await recordAdminAudit(
      adminId,
      'EMERGENCY_BROADCAST',
      'EmergencyAlert',
      alert._id.toString(),
      { title, message, isCritical },
      req
    );

    res.status(201).json({
      success: true,
      message: 'Emergency alert dispatched to all active connected portal sessions.',
      data: alert,
    });
  } catch (error) {
    console.error('[Emergency Broadcast Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to broadcast emergency alert.',
    });
  }
};

export const getEmergencyAlerts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const alerts = await EmergencyAlert.find()
      .populate('issuedBy', 'name email')
      .sort({ broadcastAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Emergency alerts history retrieved.',
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve emergency alerts.',
    });
  }
};

export const dismissEmergencyAlert = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);
    await EmergencyAlert.findByIdAndUpdate(id, { active: false });

    await recordAdminAudit(req.user!.userId, 'EMERGENCY_DISMISS', 'EmergencyAlert', id, {}, req);

    res.status(200).json({
      success: true,
      message: 'Emergency alert dismissed.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to dismiss alert.',
    });
  }
};

// MODULE 18: Grievance Routing and Management
export const getAdminGrievances = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, category, department, search, page = '1', limit = '15' } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (department) query.assignedDepartment = department;

    if (search) {
      query.$or = [
        { trackingTicket: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const total = await Grievance.countDocuments(query);
    // Preserves complete anonymity - NO user joins
    const grievances = await Grievance.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Anonymous grievances retrieved.',
      data: grievances,
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
      message: 'Failed to retrieve grievances.',
    });
  }
};

export const updateGrievanceStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignedDepartment, assignedAdminNotes, note } = req.body;
    const adminId = req.user!.userId;

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      res.status(404).json({ success: false, message: 'Grievance not found.' });
      return;
    }

    grievance.status = status;
    if (assignedDepartment) grievance.assignedDepartment = assignedDepartment;
    if (assignedAdminNotes) grievance.assignedAdminNotes = assignedAdminNotes;

    const timelineNote =
      note ||
      `Status changed to ${status}${assignedDepartment ? ` and assigned to ${assignedDepartment}` : ''}.`;

    grievance.statusTimeline.push({
      status,
      note: timelineNote,
      updatedAt: new Date(),
    });

    await grievance.save();

    await recordAdminAudit(
      adminId,
      'GRIEVANCE_UPDATE',
      'Grievance',
      grievance.trackingTicket,
      { status, assignedDepartment, timelineNote },
      req
    );

    res.status(200).json({
      success: true,
      message: 'Grievance progress updated successfully.',
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update grievance.',
    });
  }
};

// MODULE 19: Student Organization Governance
export const getAdminClubApplications = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { status = 'PENDING' } = req.query;
    const query: any = {};
    if (status !== 'ALL') query.status = status;

    const applications = await ClubApplication.find(query)
      .populate('proposedLeadStudentId', 'name email')
      .sort({ createdAt: -1 });

    const verifiedClubs = await Club.find().populate('leadStudentId', 'name email').sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: 'Club governance data retrieved.',
      data: { applications, verifiedClubs },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve club applications.',
    });
  }
};

export const reviewClubApplication = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    const adminId = req.user!.userId;

    const application = await ClubApplication.findById(id);
    if (!application) {
      res.status(404).json({ success: false, message: 'Club application not found.' });
      return;
    }

    application.status = status;
    application.reviewedBy = adminId as any;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes;
    await application.save();

    let createdClub = null;
    if (status === 'APPROVED') {
      const code = application.clubName.replace(/[^A-Za-z0-9]/g, '').substring(0, 10).toUpperCase();

      createdClub = await Club.create({
        name: application.clubName,
        code,
        category: application.category,
        description: application.description,
        leadStudentId: application.proposedLeadStudentId,
        leadStudentName: application.proposedLeadStudentName,
        isVerified: true,
        verifiedBy: adminId,
        verifiedAt: new Date(),
        membershipInfo: application.objectives,
        contactEmail: application.contactEmail,
      });

      // Notify the proposed lead student
      const notification = await Notification.create({
        recipientId: application.proposedLeadStudentId,
        title: 'Club Application Approved!',
        message: `Congratulations! Your application for "${application.clubName}" was approved. Your club is now officially verified.`,
        type: 'INFO',
        link: `/clubs/${createdClub._id}`,
      });
      emitNotificationToUser(application.proposedLeadStudentId.toString(), notification);
    } else {
      const notification = await Notification.create({
        recipientId: application.proposedLeadStudentId,
        title: 'Club Application Review Update',
        message: `Your application for "${application.clubName}" was reviewed. Status: REJECTED. Notes: ${reviewNotes || 'See administration for details.'}`,
        type: 'INFO',
        link: '/clubs',
      });
      emitNotificationToUser(application.proposedLeadStudentId.toString(), notification);
    }

    await recordAdminAudit(
      adminId,
      'CLUB_REVIEW',
      'ClubApplication',
      application._id.toString(),
      { status, clubName: application.clubName, reviewNotes },
      req
    );

    res.status(200).json({
      success: true,
      message: `Club application marked as ${status}.`,
      data: { application, club: createdClub },
    });
  } catch (error) {
    console.error('[Review Club Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process club application.',
    });
  }
};

// MODULE 20: Placement Notification Management
export const getAdminPlacements = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const placements = await Placement.find()
      .populate('publishedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Placements retrieved for administration.',
      data: placements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve placements.',
    });
  }
};

export const createPlacement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      companyName,
      jobTitle,
      jobDescription,
      minimumCgpa,
      eligibleBranches,
      packageDetails,
      location,
      applicationDeadline,
      applicationUrl,
      contactEmail,
    } = req.body;
    const adminId = req.user!.userId;

    const placement = await Placement.create({
      companyName,
      jobTitle,
      jobDescription,
      minimumCgpa,
      eligibleBranches: eligibleBranches.map((b: string) => b.trim().toUpperCase()),
      packageDetails,
      location,
      applicationDeadline: new Date(applicationDeadline),
      applicationUrl,
      contactEmail,
      status: 'ACTIVE',
      publishedBy: adminId,
    });

    await recordAdminAudit(
      adminId,
      'PLACEMENT_CREATE',
      'Placement',
      placement._id.toString(),
      { companyName, jobTitle, minimumCgpa, eligibleBranches },
      req
    );

    res.status(201).json({
      success: true,
      message: 'Placement drive published successfully.',
      data: placement,
    });
  } catch (error) {
    console.error('[Create Placement Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create placement opportunity.',
    });
  }
};

export const updatePlacement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const adminId = req.user!.userId;

    const placement = await Placement.findById(id);
    if (!placement) {
      res.status(404).json({ success: false, message: 'Placement not found.' });
      return;
    }

    if (req.body.eligibleBranches) {
      req.body.eligibleBranches = req.body.eligibleBranches.map((b: string) => b.trim().toUpperCase());
    }

    Object.assign(placement, req.body);
    await placement.save();

    await recordAdminAudit(adminId, 'PLACEMENT_UPDATE', 'Placement', id, req.body, req);

    res.status(200).json({
      success: true,
      message: 'Placement drive updated.',
      data: placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update placement.',
    });
  }
};

// MODULE 15: Single-Campus Configuration Control
export const getSystemConfigurations = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    let configs = await SystemConfiguration.find().sort({ key: 1 });

    // Seed defaults if not yet present
    if (configs.length === 0) {
      await SystemConfiguration.create([
        {
          key: 'allowedEmailDomains',
          value: ['silicon.ac.in'],
          description: 'Official university email domains allowed for student self-registration.',
        },
        {
          key: 'campusIdentity',
          value: {
            institutionName: 'Silicon University',
            campusLocation: 'Bhubaneswar, Odisha',
            tagline: 'One Campus. One Community. One Connection.',
            contactSupportEmail: 'support@silicon.ac.in',
          },
          description: 'General university identity display settings.',
        },
      ]);
      configs = await SystemConfiguration.find().sort({ key: 1 });
    }

    res.status(200).json({
      success: true,
      message: 'System configurations retrieved.',
      data: configs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system configurations.',
    });
  }
};

export const updateSystemConfiguration = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const key = String(req.params.key);
    const { value, description } = req.body;
    const adminId = req.user!.userId;

    const config = await SystemConfiguration.findOneAndUpdate(
      { key },
      {
        value,
        description,
        updatedBy: adminId,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    await recordAdminAudit(
      adminId,
      'CONFIG_UPDATE',
      'SystemConfiguration',
      key,
      { key, value },
      req
    );

    res.status(200).json({
      success: true,
      message: `System configuration "${key}" updated successfully.`,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update system configuration.',
    });
  }
};

// AUDIT LOGS
export const getAuditLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { actionType, page = '1', limit = '20' } = req.query;
    const query: any = {};
    if (actionType) query.actionType = actionType;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await AdminAuditLog.countDocuments(query);
    const logs = await AdminAuditLog.find(query)
      .populate('adminId', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Admin audit logs retrieved.',
      data: logs,
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
      message: 'Failed to retrieve audit logs.',
    });
  }
};
