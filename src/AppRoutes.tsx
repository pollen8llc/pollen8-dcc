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
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <ProfileEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/setup"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <ProfileSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <ProfileSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connections"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <ConnectionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <JoinCommunities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invites"
        element={
          <ProtectedRoute roleEnum={UserRole.ORGANIZER}>
            <InvitesManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Community Routes */}
      <Route
        path="/community/create"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <CreateCommunity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community/:id/create-profile"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <CreateCommunityProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roleEnum={UserRole.ORGANIZER}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/debugger"
        element={
          <ProtectedRoute roleEnum={UserRole.ADMIN}>
            <DebuggerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer"
        element={
          <ProtectedRoute roleEnum={UserRole.ORGANIZER}>
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dot-connector"
        element={
          <ProtectedRoute roleEnum={UserRole.ORGANIZER}>
            <DotConnectorDashboard />
          </ProtectedRoute>
        }
      />

      {/* REL8T Routes */}
      <Route
        path="/rel8t/dashboard"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/contacts"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <Contacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/contacts/create"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <ContactCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/contacts/:id/edit"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <ContactEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/contacts/import"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <ImportContacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/groups"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <Groups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/relationships"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <Relationships />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/wizard"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <RelationshipWizard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/settings"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rel8t/notifications"
        element={
          <ProtectedRoute roleEnum={UserRole.MEMBER}>
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
