import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ServiceProviderProtectedRoute from "@/components/auth/ServiceProviderProtectedRoute";
import NonServiceProviderRoute from "@/components/auth/NonServiceProviderRoute";
import OrganizerSetupGuard from "@/components/auth/OrganizerSetupGuard";

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
const InvitesDashboard = lazy(() => import("@/pages/organizer/InvitesDashboard"));
const InviteMicrosite = lazy(() => import("@/pages/InviteMicrosite"));
const InviteRedirect = lazy(() => import("@/components/invites/InviteRedirect"));
const Settings = lazy(() => import("@/pages/Settings"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const DebuggerDashboard = lazy(() => import("@/pages/admin/DebuggerDashboard"));
const AvatarGallery = lazy(() => import("@/pages/admin/AvatarGallery"));
const LexiconManagement = lazy(() => import("@/pages/admin/LexiconManagement"));
const EmailTester = lazy(() => import("@/pages/admin/EmailTester"));

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
const ContactProfile = lazy(() => import("@/pages/rel8t/ContactProfile"));
const Categories = lazy(() => import("@/pages/rel8/Categories"));
const Rel8Settings = lazy(() => import("@/pages/rel8/Settings"));
const RelationshipWizard = lazy(() => import("@/pages/rel8/RelationshipWizard"));
const TriggerWizard = lazy(() => import("@/pages/rel8/TriggerWizard"));
const EmailTest = lazy(() => import("@/pages/rel8/EmailTest"));
const Triggers = lazy(() => import("@/pages/rel8/Triggers"));
const BuildRapport = lazy(() => import("@/pages/rel8/BuildRapport"));
const Notifications = lazy(() => import("@/pages/rel8/Notifications"));

// REL8 Connect pages
const ConnectHub = lazy(() => import("@/pages/rel8/ConnectHub"));
const ConnectCreate = lazy(() => import("@/pages/rel8/ConnectCreate"));
const ConnectImport = lazy(() => import("@/pages/rel8/ConnectImport"));
const ConnectFind = lazy(() => import("@/pages/rel8/ConnectFind"));
const InvitesPage = lazy(() => import("@/pages/rel8/InvitesPage"));

// Nomin8 pages
const Nomin8Dashboard = lazy(() => import("@/pages/nmn8/Nomin8Dashboard"));
const Nomin8ContactsPage = lazy(() => import("@/pages/nmn8/Nomin8ContactsPage"));
const Nomin8Track = lazy(() => import("@/pages/nmn8/Nomin8Track"));
const Nomin8TrackConfig = lazy(() => import("@/pages/nmn8/Nomin8TrackConfig"));
const Nomin8Settings = lazy(() => import("@/pages/nmn8/Nomin8Settings"));
const Nomin8ProfileDetails = lazy(() => import("@/pages/nmn8/Nomin8ProfileDetails"));

// Evalu8 pages
const ContactEvaluationPage = lazy(() => import("@/pages/elavu8/ContactEvaluationPage"));
const Evalu8Dashboard = lazy(() => import("@/pages/Evalu8Dashboard"));

// Initi8 pages
const Initi8Dashboard = lazy(() => import("@/pages/initi8/Initi8Dashboard"));
const SearchProfiles = lazy(() => import("@/pages/initi8/SearchProfiles"));
const ManageVolunteers = lazy(() => import("@/pages/initi8/ManageVolunteers"));

// Import pages - moved from A10D
const ImportCSV = lazy(() => import("@/pages/ImportCSV"));
const ImportEmail = lazy(() => import("@/pages/ImportEmail"));
const ImportPhone = lazy(() => import("@/pages/ImportPhone"));
const ImportWebsite = lazy(() => import("@/pages/ImportWebsite"));

// Imports page
const Imports = lazy(() => import("@/pages/Imports"));

// ECO8 Community pages
const CommunitySetup = lazy(() => import("@/pages/eco8/CommunitySetup"));
const CommunityDirectory = lazy(() => import("@/pages/eco8/CommunityDirectory"));
const CommunityProfile = lazy(() => import("@/pages/eco8/CommunityProfile"));
const CommunityDashboard = lazy(() => import("@/pages/eco8/CommunityDashboard"));
const Eco8Dashboard = lazy(() => import("@/pages/eco8/Eco8Dashboard"));
const Eco8InvitesPage = lazy(() => import("@/pages/eco8/InvitesPage"));

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
const Labr8Profile = lazy(() => import("@/pages/labr8/Labr8Profile"));
const Labr8RequestDetails = lazy(() => import("@/pages/labr8/Labr8RequestDetails"));
const Labr8ProjectStatusNew = lazy(() => import("@/pages/labr8/Labr8ProjectStatusNew"));

// P8 Ecosystem Builder Pages
const Builder = lazy(() => import("@/pages/p8/Builder"));
const P8 = lazy(() => import("@/pages/p8/P8"));
const P8Loc8 = lazy(() => import("@/pages/p8/P8Loc8"));
const P8Asl = lazy(() => import("@/pages/p8/P8Asl"));
const P8Tags = lazy(() => import("@/pages/p8/P8Tags"));
const P8Links = lazy(() => import("@/pages/p8/P8Links"));
const P8Class = lazy(() => import("@/pages/p8/P8Class"));
const P8Dashboard = lazy(() => import("@/pages/p8/P8Dashboard"));

// Integrations Page (standalone)
const Intgr8 = lazy(() => import("@/pages/Intgr8"));

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
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/i/:linkId" element={<InviteMicrosite />} />
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
          <Route path="/organizer/invites" element={
            <NonServiceProviderRoute>
              <InvitesDashboard />
            </NonServiceProviderRoute>
          } />
          <Route path="/invites" element={
            <NonServiceProviderRoute>
              <InvitesDashboard />
            </NonServiceProviderRoute>
          } />
          <Route path="/invite/:code" element={<InviteRedirect />} />
          
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
          <Route path="/admin/avatars" element={
            <NonServiceProviderRoute>
              <AvatarGallery />
            </NonServiceProviderRoute>
          } />
          <Route path="/admin/lexicon" element={
            <NonServiceProviderRoute>
              <LexiconManagement />
            </NonServiceProviderRoute>
          } />
          <Route path="/admin/email-tester" element={
            <NonServiceProviderRoute>
              <EmailTester />
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
              <ProtectedRoute>
                <Rel8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/contacts" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/contacts/create" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ContactCreate />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/contacts/:id/edit" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ContactEdit />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/contactprofile/:id" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ContactProfile />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/categories" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/triggers" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Triggers />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/settings" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Rel8Settings />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/wizard" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <RelationshipWizard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/triggers/wizard" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <TriggerWizard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/test-email" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <EmailTest />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/build-rapport" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <BuildRapport />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/notifications" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />

          {/* REL8 Connect Hub and Sub-pages */}
          <Route path="/rel8/connect" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ConnectHub />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/connect/create" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ConnectCreate />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/connect/import" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ConnectImport />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/connect/find" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ConnectFind />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/rel8/invites" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <InvitesPage />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />

          {/* Import routes */}
          <Route path="/import" element={
            <NonServiceProviderRoute>
              <Imports />
            </NonServiceProviderRoute>
          } />
          <Route path="/imports" element={
            <NonServiceProviderRoute>
              <Imports />
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

          {/* Modul8 routes - Removed NonServiceProviderRoute to allow all authenticated users */}
          <Route path="/modul8" element={
            <ProtectedRoute>
              <Modul8Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/modul8/dashboard" element={
            <ProtectedRoute>
              <Modul8Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/modul8/projects" element={
            <ProtectedRoute>
              <Modul8Projects />
            </ProtectedRoute>
          } />
          <Route path="/modul8/partners" element={
            <ProtectedRoute>
              <Modul8Partners />
            </ProtectedRoute>
          } />
          <Route path="/modul8/dashboard/directory" element={
            <ProtectedRoute>
              <DomainDirectory />
            </ProtectedRoute>
          } />
          <Route path="/modul8/dashboard/request/new" element={
            <ProtectedRoute>
              <OrganizerSetupGuard>
                <ServiceRequestForm />
              </OrganizerSetupGuard>
            </ProtectedRoute>
          } />
          <Route path="/modul8/dashboard/request/:requestId" element={
            <ProtectedRoute>
              <Modul8RequestDetails />
            </ProtectedRoute>
          } />
          <Route path="/modul8/setup/organizer" element={
            <ProtectedRoute>
              <OrganizerSetup />
            </ProtectedRoute>
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
          <Route path="/labr8/profile" element={
            <ServiceProviderProtectedRoute>
              <Labr8Profile />
            </ServiceProviderProtectedRoute>
          } />
          <Route path="/labr8/inbox" element={
            <ServiceProviderProtectedRoute>
              <Labr8Dashboard />
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

          {/* Nomin8 routes */}
          <Route path="/nmn8" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Nomin8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/nmn8/dashboard" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Nomin8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/nmn8/contacts" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Nomin8ContactsPage />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/nmn8/manage/config/:contactId" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Nomin8TrackConfig />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/nmn8/settings" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Nomin8Settings />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/nmn8/import" element={
            <NonServiceProviderRoute>
              <Imports />
            </NonServiceProviderRoute>
          } />
          <Route path="/nmn8/profile/:profileId" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Nomin8ProfileDetails />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />

          {/* Elavu8 routes */}
          <Route path="/elavu8/:contactId" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ContactEvaluationPage />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />

          {/* Initi8 routes - Allow all authenticated users */}
          <Route path="/initi8" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Initi8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/initi8/dashboard" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Initi8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/initi8/search" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <SearchProfiles />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/initi8/volunteers" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <ManageVolunteers />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />

          {/* Evalu8 routes */}
          <Route path="/analytics" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Evalu8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />

          {/* ECO8 Community routes */}
          <Route path="/eco8" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Eco8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/eco8/dashboard" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Eco8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/eco8/directory" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <CommunityDirectory />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/eco8/setup" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <CommunitySetup />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/eco8/community/:id" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <CommunityProfile />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/eco8/invites" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Eco8InvitesPage />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/eco8/community-dashboard/:id" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <CommunityDashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />

          {/* P8 Ecosystem Builder Routes */}
          <Route path="/builder" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Builder />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/p8" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <P8 />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/p8/loc8" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <P8Loc8 />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/p8/asl" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <P8Asl />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/p8/tags" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <P8Tags />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/p8/links" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <P8Links />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/p8/class" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <P8Class />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          <Route path="/p8/dashboard" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <P8Dashboard />
              </ProtectedRoute>
            </NonServiceProviderRoute>
          } />
          
          {/* Standalone Integrations Page */}
          <Route path="/intgr8" element={
            <ProtectedRoute>
              <Intgr8 />
            </ProtectedRoute>
          } />

          {/* Documentation and Features pages */}
          <Route path="/docs" element={
            <NonServiceProviderRoute>
              <ProtectedRoute>
                <Documentation />
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
