import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ServiceProviderProtectedRoute from "@/components/auth/ServiceProviderProtectedRoute";
import NonServiceProviderRoute from "@/components/auth/NonServiceProviderRoute";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Profile = lazy(() => import("@/pages/Profile"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const ProfileEditPage = lazy(() => import("@/pages/ProfileEditPage"));
const ProfileSetupPage = lazy(() => import("@/pages/ProfileSetupPage"));
const ProfileSearchPage = lazy(() => import("@/pages/ProfileSearchPage"));
const Documentation = lazy(() => import("@/pages/Documentation"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const DotConnectorDashboard = lazy(() => import("@/pages/DotConnectorDashboard"));
const OrganizerDashboard = lazy(() => import("@/pages/OrganizerDashboard"));
const InvitesManagementPage = lazy(() => import("@/pages/InvitesManagementPage"));
const InvitePage = lazy(() => import("@/pages/InvitePage"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const DebuggerDashboard = lazy(() => import("@/pages/admin/DebuggerDashboard"));

// Knowledge base pages
const KnowledgeBase = lazy(() => import("@/pages/knowledge/KnowledgeBase"));
const UserKnowledgeResource = lazy(() => import("@/pages/knowledge/UserKnowledgeResource"));
const TopicsPage = lazy(() => import("@/pages/knowledge/TopicsPage"));
const ContentCreator = lazy(() => import("@/pages/knowledge/ContentCreator"));
const PostWizard = lazy(() => import("@/pages/knowledge/PostWizard"));
const ArticleView = lazy(() => import("@/pages/knowledge/ArticleView"));
const ArticleEdit = lazy(() => import("@/pages/core/ArticleEdit"));

// REL8 pages
const Rel8Dashboard = lazy(() => import("@/pages/rel8t/Dashboard"));
const Contacts = lazy(() => import("@/pages/rel8t/Contacts"));
const ContactCreate = lazy(() => import("@/pages/rel8t/ContactCreate"));
const ContactEdit = lazy(() => import("@/pages/rel8t/ContactEdit"));
const Relationships = lazy(() => import("@/pages/rel8t/Relationships"));
const Categories = lazy(() => import("@/pages/rel8t/Categories"));
const Rel8Settings = lazy(() => import("@/pages/rel8t/Settings"));
const RelationshipWizard = lazy(() => import("@/pages/rel8t/RelationshipWizard"));
const ImportContacts = lazy(() => import("@/pages/rel8t/ImportContacts"));
const TriggerWizard = lazy(() => import("@/pages/rel8t/TriggerWizard"));
const EmailTest = lazy(() => import("@/pages/rel8t/EmailTest"));

// Modul8 pages
const Modul8Dashboard = lazy(() => import("@/pages/modul8/Modul8Dashboard"));
const DomainProviders = lazy(() => import("@/pages/modul8/DomainProviders"));
const ServiceProviderSetup = lazy(() => import("@/pages/modul8/setup/ServiceProviderSetup"));
const OrganizerSetup = lazy(() => import("@/pages/modul8/setup/OrganizerSetup"));
const ProviderRequestPortal = lazy(() => import("@/pages/modul8/ProviderRequestPortal"));
const ServiceRequestDetails = lazy(() => import("@/pages/modul8/ServiceRequestDetails"));
const RequestStatus = lazy(() => import("./pages/modul8/RequestStatus"));

// LAB-R8 pages
const Labr8Landing = lazy(() => import("@/pages/labr8/Labr8Landing"));
const Labr8Auth = lazy(() => import("@/pages/labr8/Labr8Auth"));
const Labr8Setup = lazy(() => import("@/pages/labr8/Labr8Setup"));
const ModernLabr8Dashboard = lazy(() => import("@/pages/labr8/ModernLabr8Dashboard"));
const Labr8RequestStatus = lazy(() => import("@/pages/labr8/Labr8RequestStatus"));
const Labr8ProjectDetails = lazy(() => import("@/pages/labr8/Labr8ProjectDetails"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={
              <NonServiceProviderRoute>
                <Auth />
              </NonServiceProviderRoute>
            } />
            <Route path="/onboarding" element={
              <NonServiceProviderRoute>
                <Onboarding />
              </NonServiceProviderRoute>
            } />
            <Route path="/welcome" element={
              <NonServiceProviderRoute>
                <DotConnectorDashboard />
              </NonServiceProviderRoute>
            } />
            
            {/* Profile routes - Protected from service providers */}
            <Route path="/profile" element={
              <NonServiceProviderRoute>
                <Profile />
              </NonServiceProviderRoute>
            } />
            <Route path="/profile/:userId" element={
              <NonServiceProviderRoute>
                <ProfilePage />
              </NonServiceProviderRoute>
            } />
            <Route path="/profile/edit" element={
              <NonServiceProviderRoute>
                <ProfileEditPage />
              </NonServiceProviderRoute>
            } />
            <Route path="/profile/setup" element={
              <NonServiceProviderRoute>
                <ProfileSetupPage />
              </NonServiceProviderRoute>
            } />
            <Route path="/profile/search" element={
              <NonServiceProviderRoute>
                <ProfileSearchPage />
              </NonServiceProviderRoute>
            } />
            
            {/* Organizer routes - Protected from service providers */}
            <Route path="/organizer" element={
              <NonServiceProviderRoute>
                <OrganizerDashboard />
              </NonServiceProviderRoute>
            } />
            <Route path="/invites" element={
              <NonServiceProviderRoute>
                <InvitesManagementPage />
              </NonServiceProviderRoute>
            } />
            <Route path="/invite/:code" element={
              <NonServiceProviderRoute>
                <InvitePage />
              </NonServiceProviderRoute>
            } />
            
            {/* Admin routes - Protected from service providers */}
            <Route path="/admin" element={
              <NonServiceProviderRoute>
                <AdminDashboard />
              </NonServiceProviderRoute>
            } />
            <Route path="/admin/debugger" element={
              <NonServiceProviderRoute>
                <DebuggerDashboard />
              </NonServiceProviderRoute>
            } />
            
            {/* Knowledge base routes - Protected from service providers */}
            <Route path="/knowledge" element={
              <NonServiceProviderRoute>
                <ProtectedRoute>
                  <KnowledgeBase />
                </ProtectedRoute>
              </NonServiceProviderRoute>
            } />
            <Route path="/knowledge/resources" element={
              <NonServiceProviderRoute>
                <ProtectedRoute>
                  <UserKnowledgeResource />
                </ProtectedRoute>
              </NonServiceProviderRoute>
            } />
            <Route path="/knowledge/topics" element={
              <NonServiceProviderRoute>
                <ProtectedRoute>
                  <TopicsPage />
                </ProtectedRoute>
              </NonServiceProviderRoute>
            } />
            <Route path="/knowledge/create" element={
              <NonServiceProviderRoute>
                <ProtectedRoute>
                  <ContentCreator />
                </ProtectedRoute>
              </NonServiceProviderRoute>
            } />
            <Route path="/knowledge/create/:type" element={
              <NonServiceProviderRoute>
                <ProtectedRoute>
                  <PostWizard />
                </ProtectedRoute>
              </NonServiceProviderRoute>
            } />
            <Route path="/knowledge/article/:id" element={
              <NonServiceProviderRoute>
                <ProtectedRoute>
                  <ArticleView />
                </ProtectedRoute>
              </NonServiceProviderRoute>
            } />
            <Route path="/knowledge/article/:id/edit" element={
              <NonServiceProviderRoute>
                <ProtectedRoute>
                  <ArticleEdit />
                </ProtectedRoute>
              </NonServiceProviderRoute>
            } />
            
            {/* REL8 routes - Protected from service providers */}
            <Route path="/rel8" element={
              <NonServiceProviderRoute>
                <Rel8Dashboard />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t" element={
              <NonServiceProviderRoute>
                <Rel8Dashboard />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/contacts" element={
              <NonServiceProviderRoute>
                <Contacts />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/contacts" element={
              <NonServiceProviderRoute>
                <Contacts />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/contacts/create" element={
              <NonServiceProviderRoute>
                <ContactCreate />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/contacts/create" element={
              <NonServiceProviderRoute>
                <ContactCreate />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/contacts/:id/edit" element={
              <NonServiceProviderRoute>
                <ContactEdit />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/contacts/:id/edit" element={
              <NonServiceProviderRoute>
                <ContactEdit />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/relationships" element={
              <NonServiceProviderRoute>
                <Relationships />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/relationships" element={
              <NonServiceProviderRoute>
                <Relationships />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/categories" element={
              <NonServiceProviderRoute>
                <Categories />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/categories" element={
              <NonServiceProviderRoute>
                <Categories />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/settings" element={
              <NonServiceProviderRoute>
                <Rel8Settings />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/settings" element={
              <NonServiceProviderRoute>
                <Rel8Settings />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/wizard" element={
              <NonServiceProviderRoute>
                <RelationshipWizard />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/wizard" element={
              <NonServiceProviderRoute>
                <RelationshipWizard />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/import" element={
              <NonServiceProviderRoute>
                <ImportContacts />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/import" element={
              <NonServiceProviderRoute>
                <ImportContacts />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/triggers/wizard" element={
              <NonServiceProviderRoute>
                <TriggerWizard />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/triggers/wizard" element={
              <NonServiceProviderRoute>
                <TriggerWizard />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8/test-email" element={
              <NonServiceProviderRoute>
                <EmailTest />
              </NonServiceProviderRoute>
            } />
            <Route path="/rel8t/test-email" element={
              <NonServiceProviderRoute>
                <EmailTest />
              </NonServiceProviderRoute>
            } />

            {/* Modul8 routes - Protected from service providers */}
            <Route path="/modul8" element={
              <NonServiceProviderRoute>
                <Modul8Dashboard />
              </NonServiceProviderRoute>
            } />
            <Route path="/modul8/domain/:domainId" element={
              <NonServiceProviderRoute>
                <DomainProviders />
              </NonServiceProviderRoute>
            } />
            <Route path="/modul8/setup/provider" element={
              <NonServiceProviderRoute>
                <ServiceProviderSetup />
              </NonServiceProviderRoute>
            } />
            <Route path="/modul8/setup/organizer" element={
              <NonServiceProviderRoute>
                <OrganizerSetup />
              </NonServiceProviderRoute>
            } />
            <Route path="/modul8/provider/:providerId/request" element={
              <NonServiceProviderRoute>
                <ProviderRequestPortal />
              </NonServiceProviderRoute>
            } />
            <Route path="/modul8/request/:id" element={
              <NonServiceProviderRoute>
                <ServiceRequestDetails />
              </NonServiceProviderRoute>
            } />
            <Route path="/modul8/provider/:providerId/:requestId/status" element={
              <NonServiceProviderRoute>
                <RequestStatus />
              </NonServiceProviderRoute>
            } />
            
            {/* LAB-R8 Routes */}
            <Route path="/labr8" element={<Labr8Landing />} />
            <Route path="/labr8/auth" element={<Labr8Auth />} />
            <Route path="/labr8/setup" element={
              <ProtectedRoute>
                <Labr8Setup />
              </ProtectedRoute>
            } />
            <Route path="/labr8/dashboard" element={
              <ServiceProviderProtectedRoute>
                <ModernLabr8Dashboard />
              </ServiceProviderProtectedRoute>
            } />
            <Route path="/labr8/:requestId/status" element={
              <ServiceProviderProtectedRoute>
                <Labr8RequestStatus />
              </ServiceProviderProtectedRoute>
            } />
            <Route path="/labr8/project/:projectId" element={
              <ServiceProviderProtectedRoute>
                <Labr8ProjectDetails />
              </ServiceProviderProtectedRoute>
            } />
            
            {/* Documentation and 404 - Accessible to all */}
            <Route path="/docs" element={
              <NonServiceProviderRoute>
                <Documentation />
              </NonServiceProviderRoute>
            } />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ErrorBoundary>
  );
};

export default AppRoutes;
