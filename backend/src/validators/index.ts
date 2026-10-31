import { z } from 'zod';

// Authentication & Registration
export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
      email: z.string().email('Invalid email address').trim().toLowerCase(),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one digit'),
      confirmPassword: z.string(),
      department: z.string().min(2, 'Department is required').trim(),
      batchYear: z.coerce.number().min(2020).max(2035, 'Invalid graduation batch year'),
      rollNumber: z.string().min(2, 'Roll number is required').trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Profile
export const updateProfileSchema = z.object({
  body: z.object({
    contactNumber: z.string().optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    skills: z.array(z.string()).optional(),
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    cgpa: z.coerce.number().min(0).max(10).optional(),
  }),
});

// Collaboration
export const createCollabSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(120),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    domain: z.string().min(2, 'Domain is required'),
    requiredSkills: z.array(z.string()).min(1, 'At least one skill is required'),
    vacancyCount: z.coerce.number().min(1, 'Vacancy count must be at least 1').default(1),
    vacancyDescription: z.string().optional(),
    contactInfo: z.string().min(3, 'Contact info is required'),
    tags: z.array(z.string()).default([]),
  }),
});

export const updateCollabSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(120).optional(),
    description: z.string().min(20).optional(),
    domain: z.string().optional(),
    requiredSkills: z.array(z.string()).optional(),
    vacancyCount: z.coerce.number().min(1).optional(),
    vacancyDescription: z.string().optional(),
    contactInfo: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['OPEN', 'CLOSED']).optional(),
  }),
});

// Academic Q&A
export const createQuestionSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Question title must be at least 5 characters').max(150),
    description: z.string().min(15, 'Please provide more details in the description'),
    subjectCode: z.string().min(2, 'Subject code is required').trim().toUpperCase(),
    subjectCategory: z.string().min(2, 'Subject category is required').trim(),
    tags: z.array(z.string()).default([]),
  }),
});

export const createAnswerSchema = z.object({
  body: z.object({
    content: z.string().min(5, 'Answer must be at least 5 characters'),
  }),
});

// Academic Resource
export const createResourceSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Resource title must be at least 3 characters').max(150),
    courseCode: z.string().min(2, 'Course code is required').trim().toUpperCase(),
    category: z.string().min(2, 'Category is required').trim(),
    description: z.string().optional(),
  }),
});

// Lost and Found
export const createLostFoundSchema = z.object({
  body: z.object({
    type: z.enum(['LOST', 'FOUND']),
    itemName: z.string().min(3, 'Item name must be at least 3 characters').max(120),
    locationCategory: z.string().min(2, 'Location category is required'),
    locationDetails: z.string().optional(),
    description: z.string().min(10, 'Please provide more details in the description'),
    dateOccurred: z.string().optional(),
  }),
});

export const createClaimSchema = z.object({
  body: z.object({
    claimDescription: z.string().min(10, 'Claim description must be at least 10 characters'),
    proofDetails: z.string().min(10, 'Proof details must be at least 10 characters'),
  }),
});

// Campus Events
export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Event title must be at least 5 characters').max(150),
    description: z.string().min(15, 'Event description must be at least 15 characters'),
    category: z.string().min(2, 'Category is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    venue: z.string().min(2, 'Venue is required'),
    organizer: z.string().min(2, 'Organizer is required'),
    organizerClubId: z.string().optional(),
    maxCapacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).default('PUBLISHED'),
  }),
});

// Grievances
export const createGrievanceSchema = z.object({
  body: z.object({
    category: z.string().min(2, 'Grievance category is required'),
    description: z.string().min(20, 'Grievance description must be at least 20 characters'),
  }),
});

// Clubs
export const applyClubSchema = z.object({
  body: z.object({
    clubName: z.string().min(3, 'Club name must be at least 3 characters'),
    category: z.enum(['TECHNICAL', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'SOCIAL']),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    objectives: z.string().min(20, 'Objectives must be at least 20 characters'),
    facultyAdvisorName: z.string().min(2, 'Faculty advisor name is required'),
    facultyAdvisorEmail: z.string().email('Invalid faculty advisor email'),
    contactEmail: z.string().email('Invalid contact email'),
  }),
});

// Placements
export const createPlacementSchema = z.object({
  body: z.object({
    companyName: z.string().min(2, 'Company name is required'),
    jobTitle: z.string().min(2, 'Job title is required'),
    jobDescription: z.string().min(20, 'Job description must be at least 20 characters'),
    minimumCgpa: z.coerce.number().min(0).max(10),
    eligibleBranches: z.array(z.string()).min(1, 'At least one eligible branch required'),
    packageDetails: z.string().optional(),
    location: z.string().optional(),
    applicationDeadline: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid deadline' }),
    applicationUrl: z.string().url('Invalid application URL').optional().or(z.literal('')),
    contactEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  }),
});

// Admin actions
export const suspendUserSchema = z.object({
  body: z.object({
    reason: z.string().min(5, 'Reason must be at least 5 characters'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const emergencyAlertSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Alert title must be at least 5 characters').max(150),
    message: z.string().min(10, 'Alert message must be at least 10 characters').max(1000),
    isCritical: z.boolean().default(true),
    expiresAt: z.string().optional(),
  }),
});

export const updateGrievanceStatusSchema = z.object({
  body: z.object({
    status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']),
    assignedDepartment: z.string().optional(),
    assignedAdminNotes: z.string().optional(),
  }),
});

export const resolveLostFoundSchema = z.object({
  body: z.object({
    resolutionNotes: z.string().min(3, 'Resolution notes are required'),
    claimId: z.string().optional(),
  }),
});

export const reviewClubApplicationSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
    reviewNotes: z.string().optional(),
  }),
});
