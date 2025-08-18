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
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const ProfileEditPage = lazy(() => import("@/pages/ProfileEditPage"));
const ProfileSetupPage = lazy(() => import("@/pages/ProfileSetupPage"));

const Documentation = lazy(() => import("@/pages/Documentation"));
const FeaturesPage = lazy(() => import("@/pages/FeaturesPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const DotConnectorDashboard = lazy(() => import("@/pages/DotConnectorDashboard"));
const OrganizerDashboard = lazy(() => import("@/pages/OrganizerDashboard"));
const InvitesManagementPage = lazy(() => import("@/pages/InvitesManagementPage"));
const InvitePage = lazy(() => import("@/pages/InvitePage"));
const Settings = lazy(() => import("@/pages/Settings"));

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
const TagView = lazy(() => import("@/pages/core/TagView"));

// REL8 pages
const Rel8Dashboard = lazy(() => import("@/pages/rel8t/Dashboard"));
const Contacts = lazy(() => import("@/pages/rel8t/Contacts"));
const ContactCreate = lazy(() => import("@/pages/rel8t/ContactCreate"));
const ContactEdit = lazy(() => import("@/pages/rel8t/ContactEdit"));
const Categories = lazy(() => import("@/pages/rel8t/Categories"));
const Rel8Settings = lazy(() => import("@/pages/rel8t/Settings"));
const RelationshipWizard = lazy(() => import("@/pages/rel8t/RelationshipWizard"));
const ImportContacts = lazy(() => import("@/pages/rel8t/ImportContacts"));
const TriggerWizard = lazy(() => import("@/pages/rel8t/TriggerWizard"));
const EmailTest = lazy(() => import("@/pages/rel8t/EmailTest"));
const Triggers = lazy(() => import("@/pages/rel8t/Triggers"));
const BuildRapport = lazy(() => import("@/pages/rel8t/BuildRapport"));

// A10D pages
const A10DDashboard = lazy(() => import("@/pages/a10d/A10DDashboard"));
const A10DProfileDetails = lazy(() => import("@/pages/a10d/A10DProfileDetails"));
const A10DImport = lazy(() => import("@/pages/a10d/A10DImport"));
const A10DImportCSV = lazy(() => import("@/pages/a10d/A10DImportCSV"));
const A10DImportEmail = lazy(() => import("@/pages/a10d/A10DImportEmail"));
const A10DImportPhone = lazy(() => import("@/pages/a10d/A10DImportPhone"));
const A10DImportWebsite = lazy(() => import("@/pages/a10d/A10DImportWebsite"));

// Modul8 pages - Updated for new flow
const Modul8Dashboard = lazy(() => import("@/pages/modul8/Modul8Dashboard"));
const Modul8Projects = lazy(() => import("@/pages/modul8/Modul8Projects"));
const Modul8Partners = lazy(() => import("@/pages/modul8/Modul8Partners"));
const DomainDirectory = lazy(() => import("@/pages/modul8/DomainDirectory"));
const ServiceRequestForm = lazy(() => import("@/pages/modul8/ServiceRequestForm"));
const Modul8RequestDetails = lazy(() => import("@/pages/modul8/Modul8RequestDetails"));
const ServiceProviderSetup = lazy(() => import("@/pages/modul8/setup/ServiceProviderSetup"));
const OrganizerSetup = lazy(() => import("@/pages/modul8/setup/OrganizerSetup"));

// LAB-R8 pages - Updated for new flow
const Labr8Landing = lazy(() => import("@/pages/labr8/Labr8Landing"));
const Labr8Auth = lazy(() => import("@/pages/labr8/Labr8Auth"));
const Labr8Setup = lazy(() => import("@/pages/labr8/Labr8Setup"));
const Labr8Dashboard = lazy(() => import("@/pages/labr8/Labr8Dashboard"));
const Labr8RequestDetails = lazy(() => import("@/pages/labr8/Labr8RequestDetails"));
const Labr8ProjectStatusNew = lazy(() => import("@/pages/labr8/Labr8ProjectStatusNew"));

// Loading component
const AppLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<AppLoadingSpinner />}>
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
          
          {/* Add new Settings route */}
          <Route path="/settings" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          
          {/* Profile routes - Protected from service providers - FIXED ORDER */}
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
          <Route path="/profile/:userId" element={
            <NonServiceProviderRoute>
              <ProfilePage />
            </NonServiceProviderRoute>
          } />
          <Route path="/profile" element={
            <NonServiceProviderRoute>
              <ProfilePage />
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
          <Route path="/knowledge/my-resources" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <UserKnowledgeResource />
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
          <Route path="/knowledge/tags/:tag" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <TagView />
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
          <Route path="/rel8/triggers" element={
            <NonServiceProviderRoute>
              <Triggers />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8t/triggers" element={
            <NonServiceProviderRoute>
              <Triggers />
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
          <Route path="/rel8/build-rapport" element={
            <NonServiceProviderRoute>
              <BuildRapport />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8t/build-rapport" element={
            <NonServiceProviderRoute>
              <BuildRapport />
            </NonServiceProviderRoute>
          } />

          {/* Modul8 Routes */}
          <Route path="/modul8" element={<Modul8Dashboard />} />
          <Route path="/modul8/dashboard" element={<Modul8Dashboard />} />
          <Route path="/modul8/projects" element={<Modul8Projects />} />
          <Route path="/modul8/partners" element={<Modul8Partners />} />
          <Route path="/modul8/dashboard/directory" element={<DomainDirectory />} />
          <Route path="/modul8/dashboard/request/new" element={<ServiceRequestForm />} />
          <Route path="/modul8/dashboard/request/:requestId" element={<Modul8RequestDetails />} />
          <Route path="/modul8/setup/organizer" element={<OrganizerSetup />} />

          {/* Labr8 Routes - Updated */}
          <Route path="/labr8" element={<Labr8Landing />} />
          <Route path="/labr8/auth" element={<Labr8Auth />} />
          <Route path="/labr8/setup" element={<ServiceProviderSetup />} />
          <Route path="/labr8/dashboard" element={<ServiceProviderProtectedRoute><Labr8Dashboard /></ServiceProviderProtectedRoute>} />
          <Route path="/labr8/inbox" element={<ServiceProviderProtectedRoute><Labr8Dashboard /></ServiceProviderProtectedRoute>} />
          <Route path="/labr8/dashboard/request/:requestId" element={<ServiceProviderProtectedRoute><Labr8RequestDetails /></ServiceProviderProtectedRoute>} />

          {/* Documentation and Features - Accessible to all */}
          <Route path="/docs" element={
            <NonServiceProviderRoute>
              <Documentation />
            </NonServiceProviderRoute>
          } />
          <Route path="/features" element={
            <NonServiceProviderRoute>
              <FeaturesPage />
            </NonServiceProviderRoute>
          } />
          
          {/* A10D Community Tracker Routes */}
          <Route path="/a10d" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DDashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/import" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DImport />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/import/csv" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DImportCSV />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/import/email" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DImportEmail />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/import/phone" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DImportPhone />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/import/website" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DImportWebsite />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/profile/:profileId" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DProfileDetails />
              </ProtectedRoute>
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
