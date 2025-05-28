
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/UserContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Rel8ProtectedRoute from "@/components/auth/Rel8ProtectedRoute";

// Core Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

// Profile Pages
import ProfileSetupPage from "@/pages/ProfileSetupPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfileEditPage from "@/pages/ProfileEditPage";
import ProfileSearchPage from "@/pages/ProfileSearchPage";

// Knowledge Pages
import KnowledgeBase from "@/pages/knowledge/KnowledgeBase";
import ArticleView from "@/pages/knowledge/ArticleView";
import ContentCreator from "@/pages/knowledge/ContentCreator";
import PostWizard from "@/pages/knowledge/PostWizard";
import UserKnowledgeResource from "@/pages/knowledge/UserKnowledgeResource";
import TopicsPage from "@/pages/knowledge/TopicsPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import DebuggerDashboard from "@/pages/admin/DebuggerDashboard";

// Rel8t Pages
import Dashboard from "@/pages/rel8t/Dashboard";
import Contacts from "@/pages/rel8t/Contacts";
import ContactCreate from "@/pages/rel8t/ContactCreate";
import ContactEdit from "@/pages/rel8t/ContactEdit";
import Groups from "@/pages/rel8t/Groups";
import Categories from "@/pages/rel8t/Categories";
import Relationships from "@/pages/rel8t/Relationships";
import RelationshipWizard from "@/pages/rel8t/RelationshipWizard";
import Settings from "@/pages/rel8t/Settings";
import TriggerWizard from "@/pages/rel8t/TriggerWizard";
import Notifications from "@/pages/rel8t/Notifications";
import ImportContacts from "@/pages/rel8t/ImportContacts";

// Invite Pages
import InvitePage from "@/pages/InvitePage";
import InvitesManagementPage from "@/pages/InvitesManagementPage";

const AppRoutes = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/invite/:inviteCode" element={<InvitePage />} />
          
          {/* Profile routes */}
          <Route path="/profile/setup" element={
            <ProtectedRoute>
              <ProfileSetupPage />
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/profile/edit" element={
            <ProtectedRoute>
              <ProfileEditPage />
            </ProtectedRoute>
          } />
          <Route path="/profile/search" element={
            <ProtectedRoute>
              <ProfileSearchPage />
            </ProtectedRoute>
          } />

          {/* Knowledge Base routes */}
          <Route path="/knowledge/resources" element={
            <ProtectedRoute>
              <KnowledgeBase />
            </ProtectedRoute>
          } />
          <Route path="/knowledge/articles/:id" element={
            <ProtectedRoute>
              <ArticleView />
            </ProtectedRoute>
          } />
          <Route path="/knowledge/create" element={
            <ProtectedRoute>
              <ContentCreator />
            </ProtectedRoute>
          } />
          <Route path="/knowledge/wizard" element={
            <ProtectedRoute>
              <PostWizard />
            </ProtectedRoute>
          } />
          <Route path="/knowledge/user/:userId" element={
            <ProtectedRoute>
              <UserKnowledgeResource />
            </ProtectedRoute>
          } />
          <Route path="/knowledge/topics" element={
            <ProtectedRoute>
              <TopicsPage />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/debugger" element={
            <ProtectedRoute>
              <DebuggerDashboard />
            </ProtectedRoute>
          } />

          {/* Invite management */}
          <Route path="/invites" element={
            <ProtectedRoute>
              <InvitesManagementPage />
            </ProtectedRoute>
          } />

          {/* Rel8t routes */}
          <Route path="/rel8" element={
            <Rel8ProtectedRoute>
              <Dashboard />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/contacts" element={
            <Rel8ProtectedRoute>
              <Contacts />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/contacts/new" element={
            <Rel8ProtectedRoute>
              <ContactCreate />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/contacts/edit/:id" element={
            <Rel8ProtectedRoute>
              <ContactEdit />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/groups" element={
            <Rel8ProtectedRoute>
              <Groups />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/categories" element={
            <Rel8ProtectedRoute>
              <Categories />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/relationships" element={
            <Rel8ProtectedRoute>
              <Relationships />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/wizard" element={
            <Rel8ProtectedRoute>
              <RelationshipWizard />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/triggers" element={
            <Rel8ProtectedRoute>
              <Settings />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/triggers/wizard" element={
            <Rel8ProtectedRoute>
              <TriggerWizard />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/notifications" element={
            <Rel8ProtectedRoute>
              <Notifications />
            </Rel8ProtectedRoute>
          } />
          <Route path="/rel8/import" element={
            <Rel8ProtectedRoute>
              <ImportContacts />
            </Rel8ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </UserProvider>
    </Router>
  );
};

export default AppRoutes;
