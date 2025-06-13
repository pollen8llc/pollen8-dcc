import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ProfileEditPage = lazy(() => import('@/pages/ProfileEditPage'));
const ProfileSetupPage = lazy(() => import('@/pages/ProfileSetupPage'));
const KnowledgeResources = lazy(() => import('@/pages/knowledge/KnowledgeResources'));
const KnowledgeArticle = lazy(() => import('@/pages/knowledge/KnowledgeArticle'));
const KnowledgeCreate = lazy(() => import('@/pages/knowledge/KnowledgeCreate'));
const KnowledgeEdit = lazy(() => import('@/pages/knowledge/KnowledgeEdit'));
const CommunityList = lazy(() => import('@/pages/communities/CommunityList'));
const CommunityDetails = lazy(() => import('@/pages/communities/CommunityDetails'));
const CommunityCreate = lazy(() => import('@/pages/communities/CommunityCreate'));
const CommunityEdit = lazy(() => import('@/pages/communities/CommunityEdit'));
const CommunitySettingsPage = lazy(() => import('@/pages/communities/CommunitySettingsPage'));
const CommunityDashboard = lazy(() => import('@/pages/communities/CommunityDashboard'));
const CommunityMembers = lazy(() => import('@/pages/communities/CommunityMembers'));
const CommunityAnalytics = lazy(() => import('@/pages/communities/CommunityAnalytics'));
const CommunityBranding = lazy(() => import('@/pages/communities/CommunityBranding'));
const CommunityKnowledge = lazy(() => import('@/pages/communities/CommunityKnowledge'));
const CommunityEvents = lazy(() => import('@/pages/communities/CommunityEvents'));
const CommunityJobs = lazy(() => import('@/pages/communities/CommunityJobs'));
const CommunityAnnouncements = lazy(() => import('@/pages/communities/CommunityAnnouncements'));
const CommunityOrganizerProfile = lazy(() => import('@/pages/communities/CommunityOrganizerProfile'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminCommunities = lazy(() => import('@/pages/admin/AdminCommunities'));
const AdminKnowledge = lazy(() => import('@/pages/admin/AdminKnowledge'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminPermissions = lazy(() => import('@/pages/admin/AdminPermissions'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const BillingPage = lazy(() => import('@/pages/BillingPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
import Dashboard from '@/pages/rel8t/Dashboard';
import Contacts from '@/pages/rel8t/Contacts';
import ImportContacts from '@/pages/rel8t/ImportContacts';
import Relationships from '@/pages/rel8t/Relationships';
import Settings from '@/pages/rel8t/Settings';
import TriggerWizard from '@/pages/rel8t/TriggerWizard';
import Categories from '@/pages/rel8t/Categories';
import RelationshipWizard from '@/pages/rel8t/RelationshipWizard';
import EmailTest from '@/pages/rel8t/EmailTest';
import ContactCreate from '@/pages/rel8t/ContactCreate';
import ContactEdit from "@/pages/rel8t/ContactEdit";

const AppRoutes: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  
  // Protected route component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (!currentUser) {
      return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
  };
  
  // Admin route component
  const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (!currentUser?.role || currentUser.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  // REL8 Protected route component
  const Rel8ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (!currentUser) {
      return <Navigate to="/auth?redirectTo=/rel8" replace />;
    }
    return <>{children}</>;
  };
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
        <Route path="/profile/setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
        
        {/* Knowledge Routes */}
        <Route path="/knowledge/resources" element={<ProtectedRoute><KnowledgeResources /></ProtectedRoute>} />
        <Route path="/knowledge/article/:id" element={<ProtectedRoute><KnowledgeArticle /></ProtectedRoute>} />
        <Route path="/knowledge/create" element={<ProtectedRoute><KnowledgeCreate /></ProtectedRoute>} />
        <Route path="/knowledge/edit/:id" element={<ProtectedRoute><KnowledgeEdit /></ProtectedRoute>} />
        
        {/* Community Routes */}
        <Route path="/communities" element={<ProtectedRoute><CommunityList /></ProtectedRoute>} />
        <Route path="/communities/:id" element={<ProtectedRoute><CommunityDetails /></ProtectedRoute>} />
        <Route path="/communities/create" element={<ProtectedRoute><CommunityCreate /></ProtectedRoute>} />
        <Route path="/communities/edit/:id" element={<ProtectedRoute><CommunityEdit /></ProtectedRoute>} />
        <Route path="/communities/:id/settings" element={<ProtectedRoute><CommunitySettingsPage /></ProtectedRoute>} />
        <Route path="/communities/:id/dashboard" element={<ProtectedRoute><CommunityDashboard /></ProtectedRoute>} />
        <Route path="/communities/:id/members" element={<ProtectedRoute><CommunityMembers /></ProtectedRoute>} />
        <Route path="/communities/:id/analytics" element={<ProtectedRoute><CommunityAnalytics /></ProtectedRoute>} />
        <Route path="/communities/:id/branding" element={<ProtectedRoute><CommunityBranding /></ProtectedRoute>} />
        <Route path="/communities/:id/knowledge" element={<ProtectedRoute><CommunityKnowledge /></ProtectedRoute>} />
        <Route path="/communities/:id/events" element={<ProtectedRoute><CommunityEvents /></ProtectedRoute>} />
        <Route path="/communities/:id/jobs" element={<ProtectedRoute><CommunityJobs /></ProtectedRoute>} />
        <Route path="/communities/:id/announcements" element={<ProtectedRoute><CommunityAnnouncements /></ProtectedRoute>} />
	      <Route path="/communities/:id/organizer-profile" element={<ProtectedRoute><CommunityOrganizerProfile /></ProtectedRoute>} />
        
        {/* Billing Routes */}
        <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/communities" element={<AdminRoute><AdminCommunities /></AdminRoute>} />
        <Route path="/admin/knowledge" element={<AdminRoute><AdminKnowledge /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/permissions" element={<AdminRoute><AdminPermissions /></AdminRoute>} />

        {/* REL8 Routes */}
        <Route path="/rel8" element={<Rel8ProtectedRoute><Dashboard /></Rel8ProtectedRoute>} />
        <Route path="/rel8/contacts" element={<Rel8ProtectedRoute><Contacts /></Rel8ProtectedRoute>} />
        <Route path="/rel8/contacts/create" element={<Rel8ProtectedRoute><ContactCreate /></Rel8ProtectedRoute>} />
        <Route path="/rel8/contacts/:id/edit" element={<Rel8ProtectedRoute><ContactEdit /></Rel8ProtectedRoute>} />
        <Route path="/rel8/contacts/import" element={<Rel8ProtectedRoute><ImportContacts /></Rel8ProtectedRoute>} />
        <Route path="/rel8/relationships" element={<Rel8ProtectedRoute><Relationships /></Rel8ProtectedRoute>} />
        <Route path="/rel8/wizard" element={<Rel8ProtectedRoute><RelationshipWizard /></Rel8ProtectedRoute>} />
        <Route path="/rel8/triggers" element={<Rel8ProtectedRoute><Settings /></Rel8ProtectedRoute>} />
        <Route path="/rel8/triggers/wizard" element={<Rel8ProtectedRoute><TriggerWizard /></Rel8ProtectedRoute>} />
        <Route path="/rel8/categories" element={<Rel8ProtectedRoute><Categories /></Rel8ProtectedRoute>} />
        <Route path="/rel8/settings" element={<Rel8ProtectedRoute><Settings /></Rel8ProtectedRoute>} />
        <Route path="/rel8/email-test" element={<Rel8ProtectedRoute><EmailTest /></Rel8ProtectedRoute>} />

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
