
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

// Pages
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserRole } from "./models/types";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DebuggerDashboard from "./pages/admin/DebuggerDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CommunityProfile from "./pages/CommunityProfile";
import CreateCommunity from "./pages/CreateCommunity";
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import JoinCommunities from "./pages/JoinCommunities";
import Onboarding from "./pages/Onboarding";
import ConnectionsPage from "./pages/ConnectionsPage";
import ProfileSearchPage from "./pages/ProfileSearchPage";
import InvitePage from "./pages/InvitePage";
import InvitesManagementPage from "./pages/InvitesManagementPage";
import ProfilePage from "./pages/ProfilePage";
import Documentation from "./pages/Documentation";
import CreateCommunityProfile from "./pages/CreateCommunityProfile";
import DotConnectorDashboard from "./pages/DotConnectorDashboard";

// REL8T Pages
import RelationshipWizard from "./pages/rel8t/RelationshipWizard";
import Contacts from "./pages/rel8t/Contacts";
import ContactCreate from "./pages/rel8t/ContactCreate";
import ContactEdit from "./pages/rel8t/ContactEdit";
import Groups from "./pages/rel8t/Groups";
import Dashboard from "./pages/rel8t/Dashboard";
import ImportContacts from "./pages/rel8t/ImportContacts";
import Relationships from "./pages/rel8t/Relationships";
import Settings from "./pages/rel8t/Settings";
import Notifications from "./pages/rel8t/Notifications";

const AppRoutes = () => {
  const { currentUser } = useUser();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />  {/* Using our new landing page */}
      <Route path="/communities" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/community/:id" element={<CommunityProfile />} />
      <Route path="/invite/:code" element={<InvitePage />} />
      <Route path="/documentation" element={<Documentation />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            {currentUser ? <Navigate to={`/profile/${currentUser.id}`} replace /> : <Profile />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ProfileEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/setup"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ProfileSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles/search"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ProfileSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connections"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ConnectionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <JoinCommunities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invites"
        element={
          <ProtectedRoute role={UserRole.ORGANIZER}>
            <InvitesManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Community Routes */}
      <Route
        path="/community/create"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <CreateCommunity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community/:id/edit"
        element={
          <ProtectedRoute role={UserRole.ORGANIZER}>
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community/:id/create-profile"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <CreateCommunityProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role={UserRole.ORGANIZER}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/debugger"
        element={
          <ProtectedRoute role={UserRole.ADMIN}>
            <DebuggerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer"
        element={
          <ProtectedRoute role={UserRole.ORGANIZER}>
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dot-connector"
        element={
          <ProtectedRoute role={UserRole.ORGANIZER}>
            <DotConnectorDashboard />
          </ProtectedRoute>
        }
      />

      {/* REL8 Routes */}
      <Route
        path="/rel8/dashboard"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/contacts"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <Contacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/contacts/create"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ContactCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/contacts/:id/edit"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ContactEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/contacts/import"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ImportContacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/groups"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <Groups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/relationships"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <Relationships />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/wizard"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <RelationshipWizard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/settings"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8/notifications"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
