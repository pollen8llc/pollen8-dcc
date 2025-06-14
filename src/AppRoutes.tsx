
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

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
const ArticleView = lazy(() => import("@/pages/knowledge/ArticleView"));

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
const ServiceProviderSetup = lazy(() => import("@/pages/modul8/setup/ServiceProviderSetup"));
const OrganizerSetup = lazy(() => import("@/pages/modul8/setup/OrganizerSetup"));
const ServiceRequestForm = lazy(() => import("@/pages/modul8/ServiceRequestForm"));
const ServiceRequestDetails = lazy(() => import("@/pages/modul8/ServiceRequestDetails"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/welcome" element={<DotConnectorDashboard />} />
          
          {/* Profile routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/setup" element={<ProfileSetupPage />} />
          <Route path="/profile/search" element={<ProfileSearchPage />} />
          
          {/* Organizer routes */}
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/invites" element={<InvitesManagementPage />} />
          <Route path="/invite/:code" element={<InvitePage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/debugger" element={<DebuggerDashboard />} />
          
          {/* Knowledge base routes */}
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/knowledge/resources" element={<UserKnowledgeResource />} />
          <Route path="/knowledge/topics" element={<TopicsPage />} />
          <Route path="/knowledge/create" element={<ContentCreator />} />
          <Route path="/knowledge/article/:id" element={<ArticleView />} />
          
          {/* REL8 routes */}
          <Route path="/rel8" element={<Rel8Dashboard />} />
          <Route path="/rel8t" element={<Rel8Dashboard />} />
          <Route path="/rel8/contacts" element={<Contacts />} />
          <Route path="/rel8t/contacts" element={<Contacts />} />
          <Route path="/rel8/contacts/create" element={<ContactCreate />} />
          <Route path="/rel8t/contacts/create" element={<ContactCreate />} />
          <Route path="/rel8/contacts/:id/edit" element={<ContactEdit />} />
          <Route path="/rel8t/contacts/:id/edit" element={<ContactEdit />} />
          <Route path="/rel8/relationships" element={<Relationships />} />
          <Route path="/rel8t/relationships" element={<Relationships />} />
          <Route path="/rel8/categories" element={<Categories />} />
          <Route path="/rel8t/categories" element={<Categories />} />
          <Route path="/rel8/settings" element={<Rel8Settings />} />
          <Route path="/rel8t/settings" element={<Rel8Settings />} />
          <Route path="/rel8/wizard" element={<RelationshipWizard />} />
          <Route path="/rel8t/wizard" element={<RelationshipWizard />} />
          <Route path="/rel8/import" element={<ImportContacts />} />
          <Route path="/rel8t/import" element={<ImportContacts />} />
          <Route path="/rel8/triggers/wizard" element={<TriggerWizard />} />
          <Route path="/rel8t/triggers/wizard" element={<TriggerWizard />} />
          <Route path="/rel8/test-email" element={<EmailTest />} />
          <Route path="/rel8t/test-email" element={<EmailTest />} />

          {/* Modul8 routes */}
          <Route path="/modul8" element={<Modul8Dashboard />} />
          <Route path="/modul8/setup/provider" element={<ServiceProviderSetup />} />
          <Route path="/modul8/setup/organizer" element={<OrganizerSetup />} />
          <Route path="/modul8/request/new" element={<ServiceRequestForm />} />
          <Route path="/modul8/request/:id" element={<ServiceRequestDetails />} />
          
          <Route path="/docs" element={<Documentation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ErrorBoundary>
  );
}

export default AppRoutes;
