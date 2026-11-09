import { Router } from 'express';
import {
  getDashboardStats,
  getStudents,
  getStudentDetails,
  suspendStudent,
  reactivateStudent,
  getSuspensionHistory,
  getModerationContent,
  moderateContent,
  getAdminLostFoundItems,
  verifyLostFoundItem,
  createOfficialEvent,
  updateEvent,
  getEventRegistrations,
  broadcastEmergencyAlert,
  getEmergencyAlerts,
  dismissEmergencyAlert,
  getAdminGrievances,
  updateGrievanceStatus,
  getAdminClubApplications,
  reviewClubApplication,
  createClub,
  deleteClub,
  getAdminPlacements,
  createPlacement,
  updatePlacement,
  getSystemConfigurations,
  updateSystemConfiguration,
  getAuditLogs,
} from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import {
  suspendUserSchema,
  emergencyAlertSchema,
  updateGrievanceStatusSchema,
  createEventSchema,
  createPlacementSchema,
  reviewClubApplicationSchema,
  createClubSchema,
} from '../validators/index.js';

const router = Router();

// Strict RBAC: All administrative endpoints require valid ADMIN role!
router.use(authenticate, authorize('ADMIN'));

// MODULE 14: Analytics
router.get('/dashboard', getDashboardStats);

// MODULE 11: Student Auditing & Account Management
router.get('/students', getStudents);
router.get('/students/:id', getStudentDetails);

// MODULE 21: Guideline Enforcement & User Suspension (Decision Table 8)
router.post('/students/:id/suspend', validate(suspendUserSchema), suspendStudent);
router.post('/students/:id/reactivate', reactivateStudent);
router.get('/suspensions', getSuspensionHistory);

// MODULE 12: Content Moderation
router.get('/moderation', getModerationContent);
router.post('/moderation/:contentType/:id', moderateContent);

// MODULE 13: Lost-and-Found Verification (Decision Table 5)
router.get('/lost-found', getAdminLostFoundItems);
router.post('/lost-found/:id/verify', verifyLostFoundItem);

// MODULE 16: Official Event Publishing (Decision Table 7)
router.post('/events', upload.single('image'), validate(createEventSchema), createOfficialEvent);
router.put('/events/:id', upload.single('image'), updateEvent);
router.get('/events/:id/registrations', getEventRegistrations);

// MODULE 17: Emergency System Broadcast (Decision Table 6)
router.post('/emergency/broadcast', validate(emergencyAlertSchema), broadcastEmergencyAlert);
router.get('/emergency/history', getEmergencyAlerts);
router.patch('/emergency/:id/dismiss', dismissEmergencyAlert);

// MODULE 18: Grievance Routing and Management
router.get('/grievances', getAdminGrievances);
router.patch('/grievances/:id/status', validate(updateGrievanceStatusSchema), updateGrievanceStatus);

// MODULE 19: Student Organization Governance
router.get('/clubs/applications', getAdminClubApplications);
router.post('/clubs', validate(createClubSchema), createClub);
router.delete('/clubs/:id', deleteClub);
router.post(
  '/clubs/applications/:id/review',
  validate(reviewClubApplicationSchema),
  reviewClubApplication
);

// MODULE 20: Placement Notification Management
router.get('/placements', getAdminPlacements);
router.post('/placements', validate(createPlacementSchema), createPlacement);
router.put('/placements/:id', updatePlacement);

// MODULE 15: Single-Campus Configuration Control
router.get('/configuration', getSystemConfigurations);
router.put('/configuration/:key', updateSystemConfiguration);

// Administrative Audit Logs
router.get('/audit-logs', getAuditLogs);

export default router;

