
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ServiceProviderProtectedRoute from '@/components/auth/ServiceProviderProtectedRoute';
import NonServiceProviderRoute from '@/components/auth/NonServiceProviderRoute';
import Rel8ProtectedRoute from '@/components/auth/Rel8ProtectedRoute';
import { UserRole } from '@/models/types';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const ProfileSetup = lazy(() => import('@/pages/ProfileSetupPage'));
const KnowledgeResources = lazy(() => import('@/pages/knowledge/KnowledgeBase'));
const UserManagement = lazy(() => import('@/pages/admin/AdminDashboard'));
const CommunityManagement = lazy(() => import('@/pages/admin/AdminDashboard'));
const CommunityCreation = lazy(() => import('@/pages/admin/AdminDashboard'));
const InviteManagement = lazy(() => import('@/pages/InvitesManagementPage'));
const UserProfile = lazy(() => import('@/pages/ProfilePage'));
const RMSPage = lazy(() => import('@/pages/rel8t/Dashboard'));
const QuestionPost = lazy(() => import('@/pages/knowledge/PostWizard'));
const PollPost = lazy(() => import('@/pages/knowledge/PostWizard'));
const ArticlePost = lazy(() => import('@/pages/knowledge/PostWizard'));
const KnowledgeDetail = lazy(() => import('@/pages/knowledge/ArticleView'));

// Modul8 Pages
const ModernModul8Dashboard = lazy(() => import('@/pages/modul8/ModernModul8Dashboard'));
const ProviderDirectory = lazy(() => import('@/pages/modul8/ProviderDirectory'));
const RequestWizard = lazy(() => import('@/pages/modul8/RequestWizard'));
const ModernProjectStatusView = lazy(() => import('@/pages/modul8/ModernProjectStatusView'));
const OrganizerSetup = lazy(() => import('@/pages/modul8/OrganizerSetup'));
const Labr8RequestStatus = lazy(() => import('@/pages/labr8/Labr8RequestStatus'));

// LAB-R8 Pages
const Labr8Auth = lazy(() => import('@/pages/labr8/Labr8Auth'));
const Labr8Setup = lazy(() => import('@/pages/labr8/Labr8Setup'));
const ProviderInbox = lazy(() => import('@/pages/labr8/ProviderInbox'));
const ProjectWorkspace = lazy(() => import('@/pages/labr8/ProjectWorkspace'));
const Labr8Landing = lazy(() => import('@/pages/labr8/Labr8Landing'));
const LabR8ModernProjectStatusView = lazy(() => import('@/pages/labr8/ModernProjectStatusView'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<NonServiceProviderRoute><Auth /></NonServiceProviderRoute>} />
        
        {/* LAB-R8 Service Provider Routes */}
        <Route path="/labr8" element={<Labr8Landing />} />
        <Route path="/labr8/auth" element={<Labr8Auth />} />
        <Route path="/labr8/setup" element={<ServiceProviderProtectedRoute><Labr8Setup /></ServiceProviderProtectedRoute>} />
        <Route path="/labr8/inbox" element={<ServiceProviderProtectedRoute><ProviderInbox /></ServiceProviderProtectedRoute>} />
        <Route path="/labr8/project" element={<ServiceProviderProtectedRoute><ProjectWorkspace /></ServiceProviderProtectedRoute>} />
        <Route path="/labr8/request/:requestId/status" element={<ServiceProviderProtectedRoute><LabR8ModernProjectStatusView /></ServiceProviderProtectedRoute>} />
        <Route path="/labr8/:providerId/:requestId/status" element={<ServiceProviderProtectedRoute><Labr8RequestStatus /></ServiceProviderProtectedRoute>} />
        
        {/* Profile setup - accessible to all authenticated users */}
        <Route path="/profile/setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        
        {/* Knowledge resources - main platform for non-service providers */}
        <Route path="/knowledge/resources" element={<NonServiceProviderRoute><ProtectedRoute><KnowledgeResources /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/knowledge/post/question" element={<NonServiceProviderRoute><ProtectedRoute><QuestionPost /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/knowledge/post/poll" element={<NonServiceProviderRoute><ProtectedRoute><PollPost /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/knowledge/post/article" element={<NonServiceProviderRoute><ProtectedRoute><ArticlePost /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/knowledge/:id" element={<NonServiceProviderRoute><ProtectedRoute><KnowledgeDetail /></ProtectedRoute></NonServiceProviderRoute>} />
        
        {/* Modul8 Routes - for organizers */}
        <Route path="/modul8" element={<NonServiceProviderRoute><ProtectedRoute><ModernModul8Dashboard /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/modul8/directory" element={<NonServiceProviderRoute><ProtectedRoute><ProviderDirectory /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/modul8/request" element={<NonServiceProviderRoute><ProtectedRoute><RequestWizard /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/modul8/status" element={<NonServiceProviderRoute><ProtectedRoute><ModernProjectStatusView /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/modul8/request/:requestId/status" element={<NonServiceProviderRoute><ProtectedRoute><ModernProjectStatusView /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/modul8/setup/organizer" element={<NonServiceProviderRoute><ProtectedRoute><OrganizerSetup /></ProtectedRoute></NonServiceProviderRoute>} />
        
        {/* Admin routes */}
        <Route path="/admin/users" element={<NonServiceProviderRoute><ProtectedRoute role={UserRole.ADMIN}><UserManagement /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/admin/communities" element={<NonServiceProviderRoute><ProtectedRoute role={UserRole.ADMIN}><CommunityManagement /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/admin/community/create" element={<NonServiceProviderRoute><ProtectedRoute role={UserRole.ADMIN}><CommunityCreation /></ProtectedRoute></NonServiceProviderRoute>} />
        <Route path="/admin/invites" element={<NonServiceProviderRoute><ProtectedRoute role={UserRole.ADMIN}><InviteManagement /></ProtectedRoute></NonServiceProviderRoute>} />
        
        {/* User profile */}
        <Route path="/profile/:userId" element={<NonServiceProviderRoute><ProtectedRoute><UserProfile /></ProtectedRoute></NonServiceProviderRoute>} />
        
        {/* RMS - Relationship Management System */}
        <Route path="/rms" element={<NonServiceProviderRoute><Rel8ProtectedRoute><RMSPage /></Rel8ProtectedRoute></NonServiceProviderRoute>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
