export type UserRole = 'STUDENT' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  tokenVersion: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  _id: string;
  userId: string;
  rollNumber: string;
  department: string;
  batchYear: number;
  cgpa: number;
  contactNumber?: string;
  bio?: string;
  avatarUrl?: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationPost {
  _id: string;
  creatorId: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  domain: string;
  requiredSkills: string[];
  vacancyCount: number;
  vacancyDescription?: string;
  contactInfo: string;
  tags: string[];
  status: 'OPEN' | 'CLOSED';
  isModerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicQuestion {
  _id: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  subjectCode: string;
  subjectCategory: string;
  tags: string[];
  answerCount: number;
  isModerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicAnswer {
  _id: string;
  questionId: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  isModerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicResource {
  _id: string;
  uploaderId: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  courseCode: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileMimeType: string;
  fileSize: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LostFoundItem {
  _id: string;
  reporterId: {
    _id: string;
    name: string;
    email: string;
  };
  type: 'LOST' | 'FOUND';
  itemName: string;
  locationCategory: string;
  locationDetails?: string;
  description: string;
  imageUrl?: string;
  dateOccurred: string;
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'CLAIMED' | 'RESOLVED';
  resolvedBy?: {
    _id: string;
    name: string;
  };
  resolvedAt?: string;
  resolutionNotes?: string;
  claimCount?: number;
  hasUserClaimed?: boolean;
  userClaimStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  userClaimId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OwnershipClaim {
  _id: string;
  itemId: LostFoundItem | string;
  claimantId: {
    _id: string;
    name: string;
    email: string;
  };
  claimantProfile?: {
    rollNumber?: string;
    department?: string;
    batchYear?: number;
    contactNumber?: string;
    avatarUrl?: string;
  } | null;
  claimDescription: string;
  proofDetails: string;
  proofFileUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: {
    _id: string;
    name: string;
  };
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

export interface CampusEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  organizer: string;
  organizerClubId?: {
    _id: string;
    name: string;
    code: string;
  };
  maxCapacity: number;
  availableSeats: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  imageUrl?: string;
  isUserRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  _id: string;
  eventId: CampusEvent;
  studentId: User;
  registrationToken: string;
  status: 'CONFIRMED' | 'CANCELLED';
  registeredAt: string;
}

export interface GrievanceTimeline {
  status: string;
  note: string;
  updatedAt: string;
}

export interface Grievance {
  _id: string;
  trackingTicket: string;
  category: string;
  description: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  assignedDepartment?: string;
  assignedAdminNotes?: string;
  statusTimeline: GrievanceTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  _id: string;
  name: string;
  code: string;
  category: 'TECHNICAL' | 'CULTURAL' | 'SPORTS' | 'ACADEMIC' | 'SOCIAL';
  description: string;
  leadStudentId?: {
    _id: string;
    name: string;
    email: string;
  };
  leadStudentName?: string;
  logoUrl?: string;
  isVerified: boolean;
  verifiedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  verifiedAt?: string;
  membershipInfo?: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClubApplication {
  _id: string;
  clubName: string;
  category: 'TECHNICAL' | 'CULTURAL' | 'SPORTS' | 'ACADEMIC' | 'SOCIAL';
  description: string;
  proposedLeadStudentId: {
    _id: string;
    name: string;
    email: string;
  };
  proposedLeadStudentName: string;
  objectives: string;
  facultyAdvisorName: string;
  facultyAdvisorEmail: string;
  contactEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
  createdAt: string;
}

export interface Placement {
  _id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  minimumCgpa: number;
  eligibleBranches: string[];
  packageDetails?: string;
  location?: string;
  applicationDeadline: string;
  applicationUrl?: string;
  contactEmail?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  publishedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'INFO' | 'EVENT' | 'LOST_FOUND' | 'CLAIM' | 'PLACEMENT' | 'SYSTEM' | 'EMERGENCY';
  isRead: boolean;
  link?: string;
  metadata?: Record<string, any>;
  isCritical?: boolean;
  createdAt: string;
}

export interface EmergencyAlert {
  _id: string;
  id?: string;
  title: string;
  message: string;
  issuedBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  isCritical: boolean;
  broadcastAt: string;
  active: boolean;
  expiresAt?: string;
}

export interface AdminAuditLog {
  _id: string;
  adminId: {
    _id: string;
    name: string;
    email: string;
  };
  actionType: string;
  targetEntity: string;
  targetId?: string;
  actionDetails?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface SystemConfiguration {
  _id: string;
  key: string;
  value: any;
  description?: string;
  updatedAt: string;
}

