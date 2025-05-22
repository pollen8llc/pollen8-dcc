
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
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import Onboarding from "./pages/Onboarding";
import ProfileSearchPage from "./pages/ProfileSearchPage";
import InvitePage from "./pages/InvitePage";
import InvitesManagementPage from "./pages/InvitesManagementPage";
import ProfilePage from "./pages/ProfilePage";
import Documentation from "./pages/Documentation";

// REL8T Pages
import RelationshipWizard from "./pages/rel8t/RelationshipWizard";
import Contacts from "./pages/rel8t/Contacts";
import ContactCreate from "./pages/rel8t/ContactCreate";
import ContactEdit from "./pages/rel8t/ContactEdit";
import Groups from "./pages/rel8t/Groups";
import Categories from "./pages/rel8t/Categories";
import Dashboard from "./pages/rel8t/Dashboard";
import ImportContacts from "./pages/rel8t/ImportContacts";
import Relationships from "./pages/rel8t/Relationships";
import Settings from "./pages/rel8t/Settings";
import Notifications from "./pages/rel8t/Notifications";
import DotConnectorDashboard from "./pages/DotConnectorDashboard";
import TriggerWizard from "./pages/rel8t/TriggerWizard";
import EmailTest from "./pages/rel8t/EmailTest";

// CORE Knowledge Base Pages - now redirecting to Knowledge pages
import ArticleView from "./pages/core/ArticleView";
import ArticleCreate from "./pages/core/ArticleCreate";
import ArticleEdit from "./pages/core/ArticleEdit";
import TagView from "./pages/core/TagView";

// Knowledge Base Pages
import KnowledgeBase from "./pages/knowledge/KnowledgeBase";
import { default as KnowledgeArticleView } from "./pages/knowledge/ArticleView";
import ContentCreator from "./pages/knowledge/ContentCreator";
import PostWizard from "./pages/knowledge/PostWizard";
import TopicsPage from "./pages/knowledge/TopicsPage";
import ResourcesPage from "./pages/knowledge/ResourcesPage";

const AppRoutes = () => {
  const { currentUser } = useUser();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/invite/:code" element={<InvitePage />} />
      <Route path="/documentation" element={<Documentation />} />

      {/* CORE Knowledge Base Routes - Redirects to Knowledge */}
      <Route path="/core" element={<Navigate to="/knowledge" replace />} />
      <Route path="/core/articles/:id" element={<ArticleView />} />
      <Route path="/core/tags/:tag" element={<TagView />} />
      <Route 
        path="/core/articles/new" 
        element={
          <ProtectedRoute role={UserRole.ORGANIZER}>
            <Navigate to="/knowledge/create" replace />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/core/articles/:id/edit" 
        element={
          <ProtectedRoute role={UserRole.ORGANIZER}>
            <ArticleEdit />
          </ProtectedRoute>
        } 
      />
      
      {/* Knowledge Base Routes */}
      <Route path="/knowledge" element={<KnowledgeBase />} />
      <Route path="/knowledge/:id" element={<KnowledgeArticleView />} />
      <Route path="/knowledge/create" element={<ContentCreator />} />
      <Route path="/knowledge/create/question" element={<PostWizard initialType="question" />} />
      <Route path="/knowledge/create/article" element={<PostWizard initialType="article" />} />
      <Route path="/knowledge/create/poll" element={<PostWizard initialType="poll" />} />
      <Route path="/knowledge/topics" element={<TopicsPage />} />
      <Route path="/knowledge/tags/:tag" element={<TagView />} />
      <Route 
        path="/knowledge/resources" 
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <ResourcesPage />
          </ProtectedRoute>
        }
      />

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

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role={UserRole.ADMIN}>
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
        path="/rel8/categories"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <Categories />
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
        path="/rel8/trigger-wizard"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <TriggerWizard />
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
      <Route
        path="/rel8/email-test"
        element={
          <ProtectedRoute role={UserRole.MEMBER}>
            <EmailTest />
          </ProtectedRoute>
        }
      />

      {/* Fallback route for /communities - redirect to profile search */}
      <Route path="/communities" element={<Navigate to="/profiles/search" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
