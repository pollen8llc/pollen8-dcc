import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Rel8ProtectedRoute from '@/components/auth/Rel8ProtectedRoute';
import ServiceProviderProtectedRoute from '@/components/auth/ServiceProviderProtectedRoute';
import NonServiceProviderRoute from '@/components/auth/NonServiceProviderRoute';

// Lazy load components
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Profile = lazy(() => import('@/pages/Profile'));
const ProfileEditPage = lazy(() => import('@/pages/ProfileEditPage'));
const ProfileSetupPage = lazy(() => import('@/pages/ProfileSetupPage'));
const ProfileSearchPage = lazy(() => import('@/pages/ProfileSearchPage'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const InvitePage = lazy(() => import('@/pages/InvitePage'));
const InvitesManagementPage = lazy(() => import('@/pages/InvitesManagementPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const DebuggerDashboard = lazy(() => import('@/pages/admin/DebuggerDashboard'));
const CoreLandingPage = lazy(() => import('@/pages/core/CoreLandingPage'));
const ArticleCreate = lazy(() => import('@/pages/core/ArticleCreate'));
const ArticleEdit = lazy(() => import('@/pages/core/ArticleEdit'));
const ArticleView = lazy(() => import('@/pages/core/ArticleView'));
const KnowledgeBase = lazy(() => import('@/pages/knowledge/KnowledgeBase'));
const ContentCreator = lazy(() => import('@/pages/knowledge/ContentCreator'));
const PostWizard = lazy(() => import('@/pages/knowledge/PostWizard'));
const UserKnowledgeResource = lazy(() => import('@/pages/knowledge/UserKnowledgeResource'));
const TagView = lazy(() => import('@/pages/core/TagView'));
const TopicsPage = lazy(() => import('@/pages/knowledge/TopicsPage'));
const Rel8tDashboard = lazy(() => import('@/pages/rel8t/Dashboard'));
const Rel8tContacts = lazy(() => import('@/pages/rel8t/Contacts'));
const Rel8tContactCreate = lazy(() => import('@/pages/rel8t/ContactCreate'));
const Rel8tContactEdit = lazy(() => import('@/pages/rel8t/ContactEdit'));
const Rel8tCategories = lazy(() => import('@/pages/rel8t/Categories'));
const Rel8tRelationships = lazy(() => import('@/pages/rel8t/Relationships'));
const Rel8tRelationshipWizard = lazy(() => import('@/pages/rel8t/RelationshipWizard'));
const Rel8tImportContacts = lazy(() => import('@/pages/rel8t/ImportContacts'));
const Rel8tTriggerWizard = lazy(() => import('@/pages/rel8t/TriggerWizard'));
const Rel8tSettings = lazy(() => import('@/pages/rel8t/Settings'));
const Rel8tEmailTest = lazy(() => import('@/pages/rel8t/EmailTest'));
const OrganizerDashboard = lazy(() => import('@/pages/OrganizerDashboard'));
const DotConnectorDashboard = lazy(() => import('@/pages/DotConnectorDashboard'));
const Modul8Dashboard = lazy(() => import('@/pages/modul8/Modul8Dashboard'));
const EnhancedModul8Dashboard = lazy(() => import('@/pages/modul8/EnhancedModul8Dashboard'));
const ServiceRequestForm = lazy(() => import('@/pages/modul8/ServiceRequestForm'));
const ServiceRequestDetails = lazy(() => import('@/pages/modul8/ServiceRequestDetails'));
const ServiceProviderSetup = lazy(() => import('@/pages/modul8/setup/ServiceProviderSetup'));
const OrganizerSetup = lazy(() => import('@/pages/modul8/setup/OrganizerSetup'));
const DomainProviders = lazy(() => import('@/pages/modul8/DomainProviders'));
const Labr8Landing = lazy(() => import('@/pages/labr8/Labr8Landing'));
const Labr8Auth = lazy(() => import('@/pages/labr8/Labr8Auth'));
const Labr8Dashboard = lazy(() => import('@/pages/labr8/Labr8Dashboard'));
const SpotifyLabr8Dashboard = lazy(() => import('@/pages/modul8/SpotifyLabr8Dashboard'));
const Labr8Setup = lazy(() => import('@/pages/labr8/Labr8Setup'));
const Labr8RequestDetails = lazy(() => import('@/pages/labr8/Labr8RequestDetails'));
const ProjectDetails = lazy(() => import('@/pages/labr8/ProjectDetails'));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes location={location} key={location.pathname}>
          {/* Core Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          {/* Profile Routes */}
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/search" element={<ProfileSearchPage />} />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/setup" 
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />

          {/* Invite Routes */}
          <Route path="/invite/:code" element={<InvitePage />} />
          <Route 
            path="/admin/invites" 
            element={
              <ProtectedRoute>
                <InvitesManagementPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/debugger" 
            element={
              <ProtectedRoute>
                <DebuggerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Core Content Routes */}
          <Route path="/core" element={<CoreLandingPage />} />
          <Route 
            path="/core/article/create" 
            element={
              <ProtectedRoute>
                <ArticleCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/core/article/edit/:id" 
            element={
              <ProtectedRoute>
                <ArticleEdit />
              </ProtectedRoute>
            } 
          />
          <Route path="/core/article/:id" element={<ArticleView />} />
          <Route path="/core/tag/:tag" element={<TagView />} />

          {/* Knowledge Base Routes */}
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route 
            path="/knowledge/creator" 
            element={
              <ProtectedRoute>
                <ContentCreator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/knowledge/wizard" 
            element={
              <ProtectedRoute>
                <PostWizard />
              </ProtectedRoute>
            } 
          />
          <Route path="/knowledge/resource/:id" element={<UserKnowledgeResource />} />
          <Route path="/knowledge/topics" element={<TopicsPage />} />

          {/* Rel8 Routes */}
          <Route path="/rel8/auth" element={<Auth />} />
          <Route 
            path="/rel8/dashboard" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tDashboard />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/contacts" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tContacts />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/contact/create" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tContactCreate />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/contact/edit/:id" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tContactEdit />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/categories" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tCategories />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/relationships" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tRelationships />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/relationship/wizard" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tRelationshipWizard />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/import" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tImportContacts />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/trigger/wizard" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tTriggerWizard />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/settings" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tSettings />
              </Rel8ProtectedRoute>
            } 
          />
          <Route 
            path="/rel8/emailtest" 
            element={
              <Rel8ProtectedRoute>
                <Rel8tEmailTest />
              </Rel8ProtectedRoute>
            } 
          />

          {/* Organizer Routes */}
          <Route 
            path="/organizer/dashboard" 
            element={
              <ProtectedRoute>
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Dot Connector Routes */}
          <Route 
            path="/dotconnector/dashboard" 
            element={
              <ProtectedRoute>
                <DotConnectorDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Modul8 Routes */}
          <Route path="/modul8/auth" element={<Auth />} />
          <Route path="/modul8/dashboard" element={<Modul8Dashboard />} />
          <Route path="/modul8/enhanced-dashboard" element={<EnhancedModul8Dashboard />} />
          <Route path="/modul8/service-request/create" element={<ServiceRequestForm />} />
          <Route path="/modul8/service-request/:id" element={<ServiceRequestDetails />} />
          <Route path="/modul8/setup/service-provider" element={<NonServiceProviderRoute><ServiceProviderSetup /></NonServiceProviderRoute>} />
          <Route path="/modul8/setup/organizer" element={<OrganizerSetup />} />
          <Route path="/modul8/domain/:domainId" element={<DomainProviders />} />

          {/* Labr8 Routes */}
          <Route path="/labr8" element={<Labr8Landing />} />
          <Route path="/labr8/auth" element={<Labr8Auth />} />
          <Route 
            path="/labr8/dashboard" 
            element={
              <ServiceProviderProtectedRoute>
                <SpotifyLabr8Dashboard />
              </ServiceProviderProtectedRoute>
            } 
          />
          <Route path="/labr8/setup" element={<Labr8Setup />} />
          <Route path="/labr8/request/:id" element={<Labr8RequestDetails />} />
          <Route path="/labr8/project/:id" element={<ProjectDetails />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
