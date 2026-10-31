import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import {
  User,
  StudentProfile,
  Event,
  EventRegistration,
  Placement,
  LostFoundItem,
  OwnershipClaim,
  Club,
  Grievance,
  SystemConfiguration,
} from '../src/models/index.js';
import { hashPassword } from '../src/utils/password.js';
import { signToken } from '../src/utils/jwt.js';

const app = createApp();

describe('CampusConnect Decision Tables & Business Rules Test Suite', () => {
  let adminUser: any;
  let studentUser: any;
  let adminToken: string;
  let studentToken: string;

  beforeEach(async () => {
    // Seed system config for permitted domains
    await SystemConfiguration.create({
      key: 'allowedEmailDomains',
      value: ['silicon.ac.in'],
      description: 'Allowed domains',
    });

    // Create Admin User
    const adminHash = await hashPassword('Admin@Silicon2026');
    adminUser = await User.create({
      name: 'Admin Test',
      email: 'admin.test@silicon.ac.in',
      passwordHash: adminHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      tokenVersion: 0,
    });
    adminToken = signToken({
      userId: adminUser._id.toString(),
      email: adminUser.email,
      role: adminUser.role,
      tokenVersion: adminUser.tokenVersion,
    });

    // Create Student User
    const studentHash = await hashPassword('Student@Silicon2026');
    studentUser = await User.create({
      name: 'Rahul Das',
      email: 'rahul.das@silicon.ac.in',
      passwordHash: studentHash,
      role: 'STUDENT',
      status: 'ACTIVE',
      tokenVersion: 0,
    });
    await StudentProfile.create({
      userId: studentUser._id,
      rollNumber: '22BCSE999',
      department: 'CSE',
      batchYear: 2026,
      cgpa: 8.5,
      skills: ['TypeScript', 'React'],
    });
    studentToken = signToken({
      userId: studentUser._id.toString(),
      email: studentUser.email,
      role: studentUser.role,
      tokenVersion: studentUser.tokenVersion,
    });
  });

  // ------------------------------------------------------------------------
  // DECISION TABLE 1: Authentication & Role-Based Access Control
  // ------------------------------------------------------------------------
  describe('Decision Table 1: Authentication & RBAC', () => {
    it('Rule 1: Valid Student credentials -> grant Student access', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'rahul.das@silicon.ac.in', password: 'Student@Silicon2026' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('STUDENT');
      expect(res.body.data.token).toBeDefined();
    });

    it('Rule 2: Valid Admin credentials -> grant Admin access', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin.test@silicon.ac.in', password: 'Admin@Silicon2026' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('ADMIN');
    });

    it('Rule 3: Invalid credentials -> reject authentication (HTTP 401)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'rahul.das@silicon.ac.in', password: 'WrongPassword999' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Rule 4 & 5: Suspended account -> reject access (HTTP 403)', async () => {
      studentUser.status = 'SUSPENDED';
      await studentUser.save();

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'rahul.das@silicon.ac.in', password: 'Student@Silicon2026' });

      expect(res.status).toBe(403);
      expect(res.body.accountStatus).toBe('SUSPENDED');
    });

    it('Role Protection: Student attempting Admin endpoint -> return HTTP 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // ------------------------------------------------------------------------
  // DECISION TABLE 2: Student Account Registration
  // ------------------------------------------------------------------------
  describe('Decision Table 2: Student Account Registration', () => {
    it('Rule 1: Allowed domain, complete info, valid password, no duplicate -> create account', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Priya Verma',
        email: 'priya.verma@silicon.ac.in',
        password: 'Password@2026',
        confirmPassword: 'Password@2026',
        department: 'ECE',
        batchYear: 2026,
        rollNumber: '22BECE111',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('STUDENT');
    });

    it('Rule 2: Invalid university email domain -> show invalid domain error', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Attacker External',
        email: 'attacker@gmail.com',
        password: 'Password@2026',
        confirmPassword: 'Password@2026',
        department: 'CSE',
        batchYear: 2026,
        rollNumber: '22BCSE888',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('silicon.ac.in');
    });

    it('Rule 3: Missing information -> show validation error', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: '',
        email: 'priya2@silicon.ac.in',
        password: 'Password@2026',
        confirmPassword: 'Password@2026',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('Rule 4: Weak password -> show password error', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test Weak',
        email: 'weak.student@silicon.ac.in',
        password: 'weak',
        confirmPassword: 'weak',
        department: 'CSE',
        batchYear: 2026,
        rollNumber: '22BCSE777',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Password');
    });

    it('Rule 5: Duplicate account already exists -> show duplicate-account error (HTTP 409)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Rahul Duplicate',
        email: 'rahul.das@silicon.ac.in', // Already registered in beforeEach
        password: 'Password@2026',
        confirmPassword: 'Password@2026',
        department: 'CSE',
        batchYear: 2026,
        rollNumber: '22BCSE998',
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('already exists');
    });
  });

  // ------------------------------------------------------------------------
  // DECISION TABLE 3: Campus Event Seat Reservation
  // ------------------------------------------------------------------------
  describe('Decision Table 3: Campus Event Seat Reservation', () => {
    let testEvent: any;

    beforeEach(async () => {
      testEvent = await Event.create({
        title: 'Algorithms Workshop',
        description: 'Hands on dynamic programming session',
        category: 'Workshop',
        date: new Date(Date.now() + 86400000),
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        venue: 'Lab 1',
        organizer: 'CSE Dept',
        createdBy: adminUser._id,
        maxCapacity: 1,
        availableSeats: 1,
        status: 'PUBLISHED',
      });
    });

    it('Rule 1: Authenticated student, available seat, no duplicate -> create registration & token', async () => {
      const res = await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.registrationToken).toBeDefined();
      expect(res.body.data.remainingSeats).toBe(0);

      // Verify DB seat count decremented
      const checkEvent = await Event.findById(testEvent._id);
      expect(checkEvent?.availableSeats).toBe(0);
    });

    it('Rule 2: Event full (availableSeats = 0) -> show full-capacity message', async () => {
      // First booking fills the 1 seat
      await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      // Second student tries to book
      const student2 = await User.create({
        name: 'Second Student',
        email: 'student2@silicon.ac.in',
        passwordHash: 'hash',
        role: 'STUDENT',
        status: 'ACTIVE',
        tokenVersion: 0,
      });
      const token2 = signToken({
        userId: student2._id.toString(),
        email: student2.email,
        role: student2.role,
        tokenVersion: student2.tokenVersion,
      });

      const res = await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('maximum capacity');
    });

    it('Rule 3: Unauthenticated user -> reject booking (HTTP 401)', async () => {
      const res = await request(app).post(`/api/events/${testEvent._id}/register`);
      expect(res.status).toBe(401);
    });

    it('Rule 4: Duplicate booking -> reject duplicate booking (HTTP 409)', async () => {
      // Make capacity 10 so seat is not the barrier
      testEvent.maxCapacity = 10;
      testEvent.availableSeats = 10;
      await testEvent.save();

      // First booking
      await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      // Second booking attempt by same student
      const res = await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('Duplicate booking');
    });
  });

  // ------------------------------------------------------------------------
  // DECISION TABLE 4: Placement Job Eligibility
  // ------------------------------------------------------------------------
  describe('Decision Table 4: Placement Job Eligibility', () => {
    beforeEach(async () => {
      // Job 1: CSE eligible, min CGPA 8.0 (Student has CSE and 8.5 -> ELIGIBLE)
      await Placement.create({
        companyName: 'Eligible Corp',
        jobTitle: 'Backend Dev',
        jobDescription: 'Node & TS engineering',
        minimumCgpa: 8.0,
        eligibleBranches: ['CSE'],
        applicationDeadline: new Date(Date.now() + 864000000),
        status: 'ACTIVE',
        publishedBy: adminUser._id,
      });

      // Job 2: ME/CE only (Student is CSE -> INELIGIBLE branch)
      await Placement.create({
        companyName: 'Civil Infra Ltd',
        jobTitle: 'Structural Trainee',
        jobDescription: 'Field structural planning',
        minimumCgpa: 7.0,
        eligibleBranches: ['CE', 'ME'],
        applicationDeadline: new Date(Date.now() + 864000000),
        status: 'ACTIVE',
        publishedBy: adminUser._id,
      });

      // Job 3: CSE eligible, but min CGPA 9.5 (Student has 8.5 -> INSUFFICIENT CGPA)
      await Placement.create({
        companyName: 'High CGPA Research',
        jobTitle: 'Research Scientist',
        jobDescription: 'R&D role',
        minimumCgpa: 9.5,
        eligibleBranches: ['CSE'],
        applicationDeadline: new Date(Date.now() + 864000000),
        status: 'ACTIVE',
        publishedBy: adminUser._id,
      });
    });

    it('Rule 1, 2, 3: Strictly filter by branch and CGPA on backend', async () => {
      const res = await request(app)
        .get('/api/placements')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const items = res.body.data.placements;
      expect(items.length).toBe(1);
      expect(items[0].companyName).toBe('Eligible Corp');
    });

    it('Rule 4: Unauthenticated user -> reject / require authentication', async () => {
      const res = await request(app).get('/api/placements');
      expect(res.status).toBe(401);
    });
  });

  // ------------------------------------------------------------------------
  // DECISION TABLE 5: Lost & Found Ownership Verification
  // ------------------------------------------------------------------------
  describe('Decision Table 5: Lost & Found Ownership Verification', () => {
    let lostItem: any;

    beforeEach(async () => {
      lostItem = await LostFoundItem.create({
        reporterId: studentUser._id,
        type: 'LOST',
        itemName: 'Titan Watch',
        locationCategory: 'Hostel',
        description: 'Silver metallic watch',
        status: 'PENDING_VERIFICATION',
      });
    });

    it('Rule 1: Authorized Admin, item exists, evidence matches -> resolve item, record Admin ID & timestamp', async () => {
      const res = await request(app)
        .post(`/api/admin/lost-found/${lostItem._id}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          resolutionNotes: 'Matched serial number from invoice.',
          evidenceMatches: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('RESOLVED');
      expect(res.body.data.resolvedBy).toBe(adminUser._id.toString());
      expect(res.body.data.resolvedAt).toBeDefined();
    });

    it('Rule 2: Evidence does not match -> retain item in Pending Verification', async () => {
      const res = await request(app)
        .post(`/api/admin/lost-found/${lostItem._id}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          resolutionNotes: 'Invoice serial does not match item.',
          evidenceMatches: false,
        });

      expect(res.status).toBe(200);
      const checkItem = await LostFoundItem.findById(lostItem._id);
      expect(checkItem?.status).toBe('PENDING_VERIFICATION');
    });

    it('Rule 3: Unauthorized non-admin -> reject operation (HTTP 403)', async () => {
      const res = await request(app)
        .post(`/api/admin/lost-found/${lostItem._id}/verify`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ evidenceMatches: true });

      expect(res.status).toBe(403);
    });

    it('Rule 4: Target item does not exist -> show 404 item not found', async () => {
      const fakeId = new User()._id.toString();
      const res = await request(app)
        .post(`/api/admin/lost-found/${fakeId}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ resolutionNotes: 'test', evidenceMatches: true });

      expect(res.status).toBe(404);
    });
  });

  // ------------------------------------------------------------------------
  // DECISION TABLE 6: Emergency Alert Broadcast
  // ------------------------------------------------------------------------
  describe('Decision Table 6: Emergency Alert Broadcast', () => {
    it('Rule 1: Authenticated Admin and valid alert -> mark critical and broadcast', async () => {
      const res = await request(app)
        .post('/api/admin/emergency/broadcast')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Campus Cyclone Warning Alert',
          message: 'All afternoon laboratory classes suspended due to weather advisory.',
          isCritical: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isCritical).toBe(true);
    });

    it('Rule 2: Non-Admin student user -> reject broadcast request (HTTP 403)', async () => {
      const res = await request(app)
        .post('/api/admin/emergency/broadcast')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Fake Student Broadcast',
          message: 'Campus is closed today.',
        });

      expect(res.status).toBe(403);
    });

    it('Rule 3: Unauthenticated user -> reject request (HTTP 401)', async () => {
      const res = await request(app)
        .post('/api/admin/emergency/broadcast')
        .send({ title: 'Unauth Broadcast', message: 'Test message' });

      expect(res.status).toBe(401);
    });
  });

  // ------------------------------------------------------------------------
  // DECISION TABLE 7: Club Event Publishing Authorization
  // ------------------------------------------------------------------------
  describe('Decision Table 7: Club Event Publishing Authorization', () => {
    it('Rule 1: Verified club, valid future date -> allow publishing', async () => {
      const club = await Club.create({
        name: 'Silicon Developer Community',
        code: 'SDC',
        category: 'TECHNICAL',
        description: 'Open source club',
        leadStudentId: studentUser._id,
        leadStudentName: studentUser.name,
        isVerified: true,
        contactEmail: 'sdc@silicon.ac.in',
      });

      const futureDate = new Date(Date.now() + 864000000);
      const res = await request(app)
        .post('/api/admin/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Official Dev Conclave',
          description: 'Community gathering',
          category: 'Technical',
          date: futureDate.toISOString(),
          startTime: '10:00 AM',
          endTime: '04:00 PM',
          venue: 'Main Hall',
          organizer: 'SDC',
          organizerClubId: club._id.toString(),
          maxCapacity: 100,
          status: 'PUBLISHED',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('PUBLISHED');
    });

    it('Rule 2: Unverified club -> block publishing (HTTP 403)', async () => {
      const unverifiedClub = await Club.create({
        name: 'Unverified Rogue Club',
        code: 'URC',
        category: 'SOCIAL',
        description: 'Unverified group',
        leadStudentId: studentUser._id,
        leadStudentName: studentUser.name,
        isVerified: false,
        contactEmail: 'unverified@silicon.ac.in',
      });

      const res = await request(app)
        .post('/api/admin/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Unverified Club Event',
          description: 'Event description for testing unverified club event publishing restriction.',
          category: 'Social',
          date: new Date(Date.now() + 864000000).toISOString(),
          startTime: '10:00 AM',
          endTime: '04:00 PM',
          venue: 'Field',
          organizer: 'URC',
          organizerClubId: unverifiedClub._id.toString(),
          maxCapacity: 50,
          status: 'PUBLISHED',
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Only verified student clubs');
    });

    it('Rule 3: Past event date -> reject with invalid date error', async () => {
      const pastDate = new Date(Date.now() - 864000000);
      const res = await request(app)
        .post('/api/admin/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Past Event',
          description: 'Cannot be in past',
          category: 'Technical',
          date: pastDate.toISOString(),
          startTime: '10:00 AM',
          endTime: '04:00 PM',
          venue: 'Room 101',
          organizer: 'Admin',
          maxCapacity: 50,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('past');
    });
  });

  // ------------------------------------------------------------------------
  // DECISION TABLE 8: Student Account Suspension & Immediate Revocation
  // ------------------------------------------------------------------------
  describe('Decision Table 8: Student Account Suspension', () => {
    it('Rule 1: Authorized Admin suspends student -> update status & immediately invalidate active JWTs', async () => {
      // Verify student token works before suspension
      const preCheck = await request(app)
        .get('/api/profiles/me')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(preCheck.status).toBe(200);

      // Admin suspends student
      const res = await request(app)
        .post(`/api/admin/students/${studentUser._id}/suspend`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reason: 'Severe violation of university code of conduct.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('SUSPENDED');

      // CRITICAL: Request with the OLD token must now be immediately rejected (tokenVersion mismatch / suspended)
      const postCheck = await request(app)
        .get('/api/profiles/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect([401, 403]).toContain(postCheck.status);
    });

    it('Rule 2: Unauthorized student requesting suspension -> reject (HTTP 403)', async () => {
      const res = await request(app)
        .post(`/api/admin/students/${studentUser._id}/suspend`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ reason: 'Malicious' });

      expect(res.status).toBe(403);
    });

    it('Rule 3: Missing student account -> show 404 account not found', async () => {
      const fakeId = new User()._id.toString();
      const res = await request(app)
        .post(`/api/admin/students/${fakeId}/suspend`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Test missing' });

      expect(res.status).toBe(404);
    });
  });

  // ------------------------------------------------------------------------
  // ANONYMOUS GRIEVANCE SUBMISSION
  // ------------------------------------------------------------------------
  describe('Module 7: Anonymous Grievance Submission', () => {
    it('Submits grievance anonymously without storing any user ID or IP, returns ticket', async () => {
      const res = await request(app).post('/api/grievances').send({
        category: 'Mess/Canteen',
        description: 'Cleanliness and water filter hygiene in Hostel 3 cafeteria needs urgent inspection.',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      const ticket = res.body.data.trackingTicket;
      expect(ticket).toMatch(/^GRV-2026-[A-Z0-9]+$/);

      // Verify DB record has NO user reference
      const grievance = await Grievance.findOne({ trackingTicket: ticket });
      expect(grievance).toBeDefined();
      expect((grievance as any).studentId).toBeUndefined();
      expect((grievance as any).userId).toBeUndefined();

      // Track status anonymously
      const trackRes = await request(app).get(`/api/grievances/track/${ticket}`);
      expect(trackRes.status).toBe(200);
      expect(trackRes.body.data.status).toBe('SUBMITTED');
    });
  });
});
