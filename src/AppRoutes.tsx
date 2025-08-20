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
const RouteDiagnostic = lazy(() => import("@/pages/RouteDiagnostic"));
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
const Rel8Dashboard = lazy(() => import("@/pages/rel8/Dashboard"));
const Contacts = lazy(() => import("@/pages/rel8/Contacts"));
const ContactCreate = lazy(() => import("@/pages/rel8/ContactCreate"));
const ContactEdit = lazy(() => import("@/pages/rel8/ContactEdit"));
const Categories = lazy(() => import("@/pages/rel8/Categories"));
const Rel8Settings = lazy(() => import("@/pages/rel8/Settings"));
const RelationshipWizard = lazy(() => import("@/pages/rel8/RelationshipWizard"));
const TriggerWizard = lazy(() => import("@/pages/rel8/TriggerWizard"));
const EmailTest = lazy(() => import("@/pages/rel8/EmailTest"));
const Triggers = lazy(() => import("@/pages/rel8/Triggers"));
const BuildRapport = lazy(() => import("@/pages/rel8/BuildRapport"));

// A10D pages
const A10DDashboard = lazy(() => import("@/pages/a10d/A10DDashboard"));
const A10DTrack = lazy(() => import("@/pages/a10d/A10DTrack"));
const A10DProfileDetails = lazy(() => import("@/pages/a10d/A10DProfileDetails"));

// Import pages - moved from A10D
const ImportCSV = lazy(() => import("@/pages/ImportCSV"));
const ImportEmail = lazy(() => import("@/pages/ImportEmail"));
const ImportPhone = lazy(() => import("@/pages/ImportPhone"));
const ImportWebsite = lazy(() => import("@/pages/ImportWebsite"));

// Imports & Invites page
const ImportsAndInvites = lazy(() => import("@/pages/ImportsAndInvites"));

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
          <Route path="/rel8/contacts" element={
            <NonServiceProviderRoute>
              <Contacts />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/contacts/create" element={
            <NonServiceProviderRoute>
              <ContactCreate />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/contacts/:id/edit" element={
            <NonServiceProviderRoute>
              <ContactEdit />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/categories" element={
            <NonServiceProviderRoute>
              <Categories />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/triggers" element={
            <NonServiceProviderRoute>
              <Triggers />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/settings" element={
            <NonServiceProviderRoute>
              <Rel8Settings />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/wizard" element={
            <NonServiceProviderRoute>
              <RelationshipWizard />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/triggers/wizard" element={
            <NonServiceProviderRoute>
              <TriggerWizard />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/test-email" element={
            <NonServiceProviderRoute>
              <EmailTest />
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/build-rapport" element={
            <NonServiceProviderRoute>
              <BuildRapport />
            </NonServiceProviderRoute>
          } />

          {/* REL8 Import - now uses unified CSV import */}
          <Route path="/rel8/import" element={
            <NonServiceProviderRoute>
              <ImportCSV />
            </NonServiceProviderRoute>
          } />

          {/* Import routes */}
          <Route path="/import" element={
            <NonServiceProviderRoute>
              <ImportsAndInvites />
            </NonServiceProviderRoute>
          } />
          <Route path="/imports" element={
            <NonServiceProviderRoute>
              <ImportsAndInvites />
            </NonServiceProviderRoute>
          } />
          <Route path="/import/email" element={
            <NonServiceProviderRoute>
              <ImportEmail />
            </NonServiceProviderRoute>
          } />
          <Route path="/import/phone" element={
            <NonServiceProviderRoute>
              <ImportPhone />
            </NonServiceProviderRoute>
          } />
          <Route path="/import/website" element={
            <NonServiceProviderRoute>
              <ImportWebsite />
            </NonServiceProviderRoute>
          } />

          {/* Modul8 routes */}
          <Route path="/modul8" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Modul8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/modul8/dashboard" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Modul8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/modul8/projects" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Modul8Projects />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/modul8/partners" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Modul8Partners />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/modul8/domains" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <DomainDirectory />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/modul8/request" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ServiceRequestForm />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/modul8/request/:requestId" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Modul8RequestDetails />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/modul8/dashboard/request/:requestId" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Modul8RequestDetails />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/modul8/setup/organizer" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <OrganizerSetup />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />

          {/* Lab-R8 routes */}
          <Route path="/labr8" element={
            <Labr8Landing />
          } />
          <Route path="/labr8/auth" element={
            <Labr8Auth />
          } />
          <Route path="/labr8/setup" element={
            <ServiceProviderProtectedRoute>
              <Labr8Setup />
            </ServiceProviderProtectedRoute>
          } />
          <Route path="/labr8/dashboard" element={
            <ServiceProviderProtectedRoute>
              <Labr8Dashboard />
            </ServiceProviderProtectedRoute>
          } />
          <Route path="/labr8/request/:requestId" element={
            <ServiceProviderProtectedRoute>
              <Labr8RequestDetails />
            </ServiceProviderProtectedRoute>
          } />
          <Route path="/labr8/dashboard/request/:requestId" element={
            <ServiceProviderProtectedRoute>
              <Labr8RequestDetails />
            </ServiceProviderProtectedRoute>
          } />
          <Route path="/labr8/project/:id" element={
            <ServiceProviderProtectedRoute>
              <Labr8ProjectStatusNew />
            </ServiceProviderProtectedRoute>
          } />
          <Route path="/labr8/provider/setup" element={
            <ServiceProviderProtectedRoute>
              <ServiceProviderSetup />
            </ServiceProviderProtectedRoute>
          } />

          {/* Legacy A10D routes */}
          <Route path="/a10d" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DDashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/dashboard" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DDashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/track" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DTrack />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/import" element={
            <NonServiceProviderRoute>
              <ImportsAndInvites />
            </NonServiceProviderRoute>
          } />
          <Route path="/a10d/profile/:profileId" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <A10DProfileDetails />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          
          {/* Route Diagnostic Tool */}
          <Route path="/diagnostic" element={<RouteDiagnostic />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ErrorBoundary>
  );
};

export default AppRoutes;
