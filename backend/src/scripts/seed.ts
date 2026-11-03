import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import {
  User,
  StudentProfile,
  CollaborationPost,
  AcademicQuestion,
  AcademicAnswer,
  AcademicResource,
  LostFoundItem,
  Event,
  EventRegistration,
  Grievance,
  Club,
  Placement,
  SystemConfiguration,
  Notification,
} from '../models/index.js';
import { hashPassword } from '../utils/password.js';
import { isCloudinaryConfigured, uploadBufferToStorage } from '../config/cloudinary.js';

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing development database collections...');

    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      CollaborationPost.deleteMany({}),
      AcademicQuestion.deleteMany({}),
      AcademicAnswer.deleteMany({}),
      AcademicResource.deleteMany({}),
      LostFoundItem.deleteMany({}),
      Event.deleteMany({}),
      EventRegistration.deleteMany({}),
      Grievance.deleteMany({}),
      Club.deleteMany({}),
      Placement.deleteMany({}),
      SystemConfiguration.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('⚙️ Seeding System Configurations...');
    await SystemConfiguration.create([
      {
        key: 'allowedEmailDomains',
        value: ['silicon.ac.in'],
        description: 'Allowed official university email domains for registration.',
      },
      {
        key: 'campusIdentity',
        value: {
          institutionName: 'Silicon University',
          campusLocation: 'Bhubaneswar, Odisha',
          tagline: 'One Campus. One Community. One Connection.',
          supportEmail: 'support@silicon.ac.in',
        },
        description: 'Single-campus portal identity values.',
      },
    ]);

    console.log('👤 Seeding Admin and Students...');
    const adminPasswordHash = await hashPassword('Admin@Silicon2026');
    const studentPasswordHash = await hashPassword('Student@Silicon2026');

    // 1. Admin Account
    const admin = await User.create({
      name: 'Dr. Pravat Kumar Panda',
      email: 'admin@silicon.ac.in',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      tokenVersion: 0,
    });

    // 2. Fictional Student Accounts
    const student1 = await User.create({
      name: 'Rohit Sharma',
      email: 'rohit.sharma@silicon.ac.in',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
      tokenVersion: 0,
    });
    const profile1 = await StudentProfile.create({
      userId: student1._id,
      rollNumber: '22BCSE101',
      department: 'CSE',
      batchYear: 2026,
      cgpa: 8.75,
      contactNumber: '+91 98765 43210',
      bio: 'Final year CSE undergraduate passionate about Full-Stack Web Development, Distributed Systems, and Hackathons.',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
      githubUrl: 'https://github.com/rohitsharma',
      linkedinUrl: 'https://linkedin.com/in/rohitsharma',
    });

    const student2 = await User.create({
      name: 'Sneha Patel',
      email: 'sneha.patel@silicon.ac.in',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
      tokenVersion: 0,
    });
    const profile2 = await StudentProfile.create({
      userId: student2._id,
      rollNumber: '22BECE045',
      department: 'ECE',
      batchYear: 2026,
      cgpa: 8.2,
      contactNumber: '+91 98765 43211',
      bio: 'ECE senior focusing on IoT, Embedded Systems, and Edge Computing hardware applications.',
      skills: ['Embedded C', 'IoT', 'Arduino', 'Python', 'PCB Design'],
      githubUrl: 'https://github.com/snehapatel',
      linkedinUrl: 'https://linkedin.com/in/snehapatel',
    });

    const student3 = await User.create({
      name: 'Ananya Das',
      email: 'ananya.das@silicon.ac.in',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
      tokenVersion: 0,
    });
    const profile3 = await StudentProfile.create({
      userId: student3._id,
      rollNumber: '23BIT012',
      department: 'IT',
      batchYear: 2027,
      cgpa: 9.1,
      contactNumber: '+91 98765 43212',
      bio: 'Pre-final year IT student interested in Machine Learning, Deep Learning research, and Open-Source projects.',
      skills: ['Python', 'PyTorch', 'Data Science', 'TensorFlow', 'FastAPI'],
      githubUrl: 'https://github.com/ananyadas',
      linkedinUrl: 'https://linkedin.com/in/ananyadas',
    });

    console.log('🏛️ Seeding Verified Clubs...');
    const club1 = await Club.create({
      name: 'Silicon Coding Community',
      code: 'SCC',
      category: 'TECHNICAL',
      description: 'The premier competitive programming and software engineering organization at Silicon University.',
      leadStudentId: student1._id,
      leadStudentName: student1.name,
      isVerified: true,
      verifiedBy: admin._id,
      verifiedAt: new Date(),
      membershipInfo: 'Open to all branches. Weekly algorithmic contests and hackathon mentoring.',
      contactEmail: 'scc@silicon.ac.in',
    });

    const club2 = await Club.create({
      name: 'Silicon Robotics Society',
      code: 'ROBO',
      category: 'TECHNICAL',
      description: 'Autonomous robotics, drone dynamics, and IoT hardware prototyping research lab.',
      leadStudentId: student2._id,
      leadStudentName: student2.name,
      isVerified: true,
      verifiedBy: admin._id,
      verifiedAt: new Date(),
      membershipInfo: 'Hands-on hardware development sessions every Saturday.',
      contactEmail: 'robotics@silicon.ac.in',
    });

    const club3 = await Club.create({
      name: 'Silicon Cultural & Arts Guild',
      code: 'SCAG',
      category: 'CULTURAL',
      description: 'Nurturing creative talent in music, drama, literature, fine arts, and annual cultural celebrations.',
      leadStudentId: student3._id,
      leadStudentName: student3.name,
      isVerified: true,
      verifiedBy: admin._id,
      verifiedAt: new Date(),
      membershipInfo: 'Auditions conducted each semester.',
      contactEmail: 'cultural@silicon.ac.in',
    });

    console.log('📅 Seeding Campus Events...');
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);
    const event1 = await Event.create({
      title: 'Silicon HackFest 2026: 36-Hour Hackathon',
      description: 'Annual inter-branch 36-hour hackathon focused on Web3, AI in Healthcare, and Smart Campus sustainability solutions. Exciting prizes and mentorship from top industry leaders.',
      category: 'Technical',
      date: futureDate1,
      startTime: '09:00 AM',
      endTime: '09:00 PM',
      venue: 'Auditorium Block & CSE Labs 1-4',
      organizer: 'Silicon Coding Community',
      organizerClubId: club1._id,
      createdBy: admin._id,
      maxCapacity: 150,
      availableSeats: 148,
      status: 'PUBLISHED',
    });

    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 14);
    const event2 = await Event.create({
      title: 'AI & Cloud Infrastructure Summit',
      description: 'Hands-on keynote and technical workshop demonstrating scalable microservices deployment on modern cloud architectures.',
      category: 'Workshop',
      date: futureDate2,
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      venue: 'Seminar Hall 2, Academic Complex',
      organizer: 'Silicon University Dept of CSE',
      createdBy: admin._id,
      maxCapacity: 100,
      availableSeats: 100,
      status: 'PUBLISHED',
    });

    // Seed sample registration for Rohit
    await EventRegistration.create({
      eventId: event1._id,
      studentId: student1._id,
      registrationToken: 'EVT-HF26-R101-9876',
      status: 'CONFIRMED',
      registeredAt: new Date(),
    });

    console.log('🤝 Seeding Project Collaboration Posts...');
    await CollaborationPost.create([
      {
        creatorId: student1._id,
        title: 'Looking for Frontend React Developer for Smart Campus IoT Portal',
        description: 'Our team is developing an IoT-based energy monitoring solution for hostel blocks for HackFest 2026. We need a strong React and Tailwind CSS developer to build interactive real-time telemetry dashboards.',
        domain: 'Web Development',
        requiredSkills: ['React', 'Tailwind CSS', 'TypeScript', 'Chart.js / Recharts'],
        vacancyCount: 1,
        vacancyDescription: 'Frontend UI/UX engineer comfortable with WebSocket streaming.',
        contactInfo: 'rohit.sharma@silicon.ac.in | WhatsApp: +91 9876543210',
        tags: ['HackFest2026', 'React', 'Frontend', 'IoT'],
        status: 'OPEN',
      },
      {
        creatorId: student2._id,
        title: 'Teammates Wanted: Autonomous Obstacle-Avoiding Drone Project',
        description: 'Building an autonomous quadcopter using ROS2 and OpenCV for campus aerial surveillance. Seeking 1 computer vision specialist and 1 embedded firmware programmer.',
        domain: 'Robotics',
        requiredSkills: ['Python', 'OpenCV', 'ROS2', 'C++'],
        vacancyCount: 2,
        vacancyDescription: '1 Computer Vision + 1 Hardware Controller specialist.',
        contactInfo: 'sneha.patel@silicon.ac.in',
        tags: ['Robotics', 'ROS2', 'OpenCV', 'Drone'],
        status: 'OPEN',
      },
    ]);

    console.log('❓ Seeding Academic Questions & Answers...');
    const question1 = await AcademicQuestion.create({
      authorId: student1._id,
      title: 'Difference between Process and Thread in Linux Kernel 6.x implementation',
      description: 'How does clone() system call differentiate thread creation from fork() regarding task_struct and virtual memory address space sharing?',
      subjectCode: 'CS302',
      subjectCategory: 'Computer Science',
      tags: ['OperatingSystems', 'Linux', 'Threads'],
      answerCount: 1,
    });

    await AcademicAnswer.create({
      questionId: question1._id,
      authorId: student3._id,
      content: 'In the Linux kernel, both processes and threads are represented by the unified `task_struct`. When `clone()` is invoked with `CLONE_VM`, `CLONE_FS`, `CLONE_FILES`, and `CLONE_SIGHAND` flags, the new task shares the virtual memory descriptor `mm_struct` of the caller, acting as a lightweight thread.',
    });

    console.log('📚 Seeding Academic Resources...');
    const seedPdf = async (relPath: string, sampleTitle: string, defaultName: string) => {
      const locations = [
        path.join(process.cwd(), 'uploads', relPath),
        path.join(process.cwd(), 'backend', 'uploads', relPath),
      ];
      const minimalPdf = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 100 >>\nstream\nBT\n/F1 16 Tf\n50 720 Td\n(${sampleTitle}) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000234 00000 n \n0000000383 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n460\n%%EOF\n`;
      for (const loc of locations) {
        const dir = path.dirname(loc);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        if (!fs.existsSync(loc)) fs.writeFileSync(loc, minimalPdf);
      }

      if (isCloudinaryConfigured) {
        try {
          const res = await uploadBufferToStorage(Buffer.from(minimalPdf), defaultName, 'application/pdf', 'resources');
          return { fileUrl: res.url, filePublicId: res.publicId };
        } catch (e) {
          console.warn('[Seed] Cloudinary seed upload fallback to local:', e);
        }
      }
      return { fileUrl: `/uploads/${relPath}`, filePublicId: `local_resources_${path.basename(relPath)}` };
    };

    const daaResource = await seedPdf('resources/sample-daa-notes.pdf', 'Silicon University - Design and Analysis of Algorithms', 'CS301_DAA_Comprehensive_Notes.pdf');
    const dspResource = await seedPdf('resources/sample-dsp-pyq.pdf', 'Silicon University - Digital Signal Processing Question Bank', 'EC401_DSP_Previous_5_Years_Solved.pdf');

    await AcademicResource.create([
      {
        uploaderId: student1._id,
        title: 'Design and Analysis of Algorithms (DAA) - Comprehensive Midterm Notes',
        courseCode: 'CS301',
        category: 'Lecture Notes',
        description: 'Complete handwritten and summarized lecture notes covering Asymptotic Notations, Master Theorem, Divide and Conquer, Greedy Algorithms, and Dynamic Programming.',
        fileUrl: daaResource.fileUrl,
        filePublicId: daaResource.filePublicId,
        fileName: 'CS301_DAA_Comprehensive_Notes.pdf',
        fileMimeType: 'application/pdf',
        fileSize: 2450000,
        downloadCount: 42,
      },
      {
        uploaderId: student2._id,
        title: 'Digital Signal Processing (DSP) - Previous Year Question Bank (2020-2025)',
        courseCode: 'EC401',
        category: 'PYQ',
        description: 'Solved university question papers with FFT, Butterworth filter design steps, and Z-transform derivations.',
        fileUrl: dspResource.fileUrl,
        filePublicId: dspResource.filePublicId,
        fileName: 'EC401_DSP_Previous_5_Years_Solved.pdf',
        fileMimeType: 'application/pdf',
        fileSize: 3100000,
        downloadCount: 28,
      },
    ]);

    console.log('🔍 Seeding Lost & Found Records...');
    await LostFoundItem.create([
      {
        reporterId: student3._id,
        type: 'LOST',
        itemName: 'Casio fx-991EX Scientific Calculator',
        locationCategory: 'Library',
        locationDetails: 'Left near 2nd floor reading hall table 14',
        description: 'Black Casio ClassWiz calculator with a blue Silicon University sticker on the back cover.',
        dateOccurred: new Date(),
        status: 'PENDING_VERIFICATION',
      },
      {
        reporterId: student1._id,
        type: 'FOUND',
        itemName: 'SanDisk 64GB USB 3.0 Flash Drive',
        locationCategory: 'Academic Block',
        locationDetails: 'Found in CSE Lab 2 workstation 18',
        description: 'Silver metallic pen drive containing programming assignments. Handed over to CSE lab assistant.',
        dateOccurred: new Date(),
        status: 'APPROVED',
      },
    ]);

    console.log('💼 Seeding Placement Opportunities...');
    const placementDeadline1 = new Date();
    placementDeadline1.setDate(placementDeadline1.getDate() + 20);

    await Placement.create([
      {
        companyName: 'Tata Consultancy Services (TCS Digital / Prime)',
        jobTitle: 'Systems Software Engineer (Digital & Prime Tracks)',
        jobDescription: 'Recruitment drive for graduating B.Tech engineers in Cloud Computing, AI, Full Stack Development, and Cyber Security. High-growth engineering opportunities with competitive compensation packages.',
        minimumCgpa: 7.0,
        eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'],
        packageDetails: '₹7.5 LPA - ₹9.0 LPA CTC',
        location: 'Bhubaneswar / Bangalore / Hyderabad / Pune',
        applicationDeadline: placementDeadline1,
        applicationUrl: 'https://nextstep.tcs.com',
        contactEmail: 'placements@silicon.ac.in',
        status: 'ACTIVE',
        publishedBy: admin._id,
      },
      {
        companyName: 'Microsoft R&D India',
        jobTitle: 'Software Engineering Full-Time Analyst',
        jobDescription: 'Core engineering role designing high-availability hyperscale cloud services for Azure, Office 365, and AI platform tooling.',
        minimumCgpa: 8.5,
        eligibleBranches: ['CSE', 'IT'],
        packageDetails: '₹22.5 LPA - ₹28.0 LPA CTC',
        location: 'Hyderabad / Bangalore',
        applicationDeadline: placementDeadline1,
        applicationUrl: 'https://careers.microsoft.com',
        contactEmail: 'placements@silicon.ac.in',
        status: 'ACTIVE',
        publishedBy: admin._id,
      },
    ]);

    console.log('📣 Seeding Notifications...');
    await Notification.create([
      {
        recipientId: student1._id,
        title: 'Registration Confirmed: Silicon HackFest 2026',
        message: 'Your registration token EVT-HF26-R101-9876 has been generated. View your badge on your profile.',
        type: 'EVENT',
        link: '/events',
      },
      {
        recipientId: student2._id,
        title: 'Welcome to CampusConnect!',
        message: 'Welcome to Silicon University\'s centralized student community portal.',
        type: 'INFO',
        link: '/dashboard',
      },
    ]);

    console.log('=======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('');
    console.log('🔑 Credentials to Log In:');
    console.log('   Admin:   admin@silicon.ac.in    | Password: Admin@Silicon2026');
    console.log('   Student: rohit.sharma@silicon.ac.in | Password: Student@Silicon2026');
    console.log('   Student: sneha.patel@silicon.ac.in  | Password: Student@Silicon2026');
    console.log('   Student: ananya.das@silicon.ac.in   | Password: Student@Silicon2026');
    console.log('=======================================================');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw error;
  }
};

if (process.argv[1]?.includes('seed')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async () => {
      await disconnectDB();
      process.exit(1);
    });
}
