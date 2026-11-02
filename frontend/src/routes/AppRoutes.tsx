import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public & Auth Pages
import { LandingPage } from '../pages/auth/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';
import { SuspendedPage } from '../pages/auth/SuspendedPage';
import { NotFoundPage } from '../pages/auth/NotFoundPage';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { MyProfilePage } from '../pages/student/MyProfilePage';
import { CollaborationListPage } from '../pages/student/CollaborationListPage';
import { CollaborationDetailsPage } from '../pages/student/CollaborationDetailsPage';
import { CreateCollaborationPage } from '../pages/student/CreateCollaborationPage';
import { AcademicQnAListPage } from '../pages/student/AcademicQnAListPage';
import { QuestionDetailsPage } from '../pages/student/QuestionDetailsPage';
import { AskQuestionPage } from '../pages/student/AskQuestionPage';
import { AcademicResourcesPage } from '../pages/student/AcademicResourcesPage';
import { UploadResourcePage } from '../pages/student/UploadResourcePage';
import { LostFoundListPage } from '../pages/student/LostFoundListPage';
import { ReportLostFoundPage } from '../pages/student/ReportLostFoundPage';
import { LostFoundDetailsPage } from '../pages/student/LostFoundDetailsPage';
import { EventsListPage } from '../pages/student/EventsListPage';
import { EventDetailsPage } from '../pages/student/EventDetailsPage';
import { MyRegistrationsPage } from '../pages/student/MyRegistrationsPage';
import { GrievanceSubmitPage } from '../pages/student/GrievanceSubmitPage';
import { GrievanceTrackPage } from '../pages/student/GrievanceTrackPage';
import { ClubsListPage } from '../pages/student/ClubsListPage';
import { ClubDetailsPage } from '../pages/student/ClubDetailsPage';
import { ClubApplyPage } from '../pages/student/ClubApplyPage';
import { PlacementsListPage } from '../pages/student/PlacementsListPage';
import { NotificationsPage } from '../pages/student/NotificationsPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { StudentManagementPage } from '../pages/admin/StudentManagementPage';
import { StudentDetailsPage } from '../pages/admin/StudentDetailsPage';
import { SuspensionManagementPage } from '../pages/admin/SuspensionManagementPage';
import { ContentModerationPage } from '../pages/admin/ContentModerationPage';
import { LostFoundVerificationPage } from '../pages/admin/LostFoundVerificationPage';
import { AdminEventsPage } from '../pages/admin/AdminEventsPage';
import { CreateEventPage } from '../pages/admin/CreateEventPage';
import { EmergencyBroadcastPage } from '../pages/admin/EmergencyBroadcastPage';
import { AdminGrievancePage } from '../pages/admin/AdminGrievancePage';
import { ClubGovernancePage } from '../pages/admin/ClubGovernancePage';
import { AdminPlacementPage } from '../pages/admin/AdminPlacementPage';
import { LiveAnalyticsPage } from '../pages/admin/LiveAnalyticsPage';
import { SystemConfigurationPage } from '../pages/admin/SystemConfigurationPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/suspended" element={<SuspendedPage />} />

      {/* Public / Semi-public Grievance Tracking */}
      <Route path="/grievance/track" element={<GrievanceTrackPage />} />

      {/* Student Portal Protected Routes */}
      <Route element={<ProtectedRoute requiredRole="STUDENT" />}>
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/collaborations" element={<CollaborationListPage />} />
          <Route path="/collaborations/create" element={<CreateCollaborationPage />} />
          <Route path="/collaborations/:id" element={<CollaborationDetailsPage />} />
          <Route path="/questions" element={<AcademicQnAListPage />} />
          <Route path="/questions/ask" element={<AskQuestionPage />} />
          <Route path="/questions/:id" element={<QuestionDetailsPage />} />
          <Route path="/resources" element={<AcademicResourcesPage />} />
          <Route path="/resources/upload" element={<UploadResourcePage />} />
          <Route path="/lost-found" element={<LostFoundListPage />} />
          <Route path="/lost-found/report" element={<ReportLostFoundPage />} />
          <Route path="/lost-found/:id" element={<LostFoundDetailsPage />} />
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/my-registrations" element={<MyRegistrationsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/clubs" element={<ClubsListPage />} />
          <Route path="/clubs/apply" element={<ClubApplyPage />} />
          <Route path="/clubs/:id" element={<ClubDetailsPage />} />
          <Route path="/placements" element={<PlacementsListPage />} />
          <Route path="/grievance/submit" element={<GrievanceSubmitPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Admin Console Protected Routes */}
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentManagementPage />} />
          <Route path="/admin/students/:id" element={<StudentDetailsPage />} />
          <Route path="/admin/suspensions" element={<SuspensionManagementPage />} />
          <Route path="/admin/moderation" element={<ContentModerationPage />} />
          <Route path="/admin/lost-found" element={<LostFoundVerificationPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/events/create" element={<CreateEventPage />} />
          <Route path="/admin/events/new" element={<CreateEventPage />} />
          <Route path="/admin/emergency" element={<EmergencyBroadcastPage />} />
          <Route path="/admin/grievances" element={<AdminGrievancePage />} />
          <Route path="/admin/clubs" element={<ClubGovernancePage />} />
          <Route path="/admin/placements" element={<AdminPlacementPage />} />
          <Route path="/admin/analytics" element={<LiveAnalyticsPage />} />
          <Route path="/admin/configuration" element={<SystemConfigurationPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

