
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';

// Authentication
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Main Pages
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import ProfilePage from '@/pages/ProfilePage';
import ProfileEditPage from '@/pages/ProfileEditPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';
import ProfileSearchPage from '@/pages/ProfileSearchPage';
import Onboarding from '@/pages/Onboarding';
import NotFound from '@/pages/NotFound';
import InvitePage from '@/pages/InvitePage';
import InvitesManagementPage from '@/pages/InvitesManagementPage';
import Documentation from '@/pages/Documentation';

// Knowledge Base (includes former core functionality)
import KnowledgeBase from '@/pages/knowledge/KnowledgeBase';
import ArticleView from '@/pages/knowledge/ArticleView';
import ContentCreator from '@/pages/knowledge/ContentCreator';
import PostWizard from '@/pages/knowledge/PostWizard';
import PostTypeSelector from '@/pages/knowledge/PostTypeSelector';
import TopicsPage from '@/pages/knowledge/TopicsPage';
import UserKnowledgeResource from '@/pages/knowledge/UserKnowledgeResource';

// Core Content (now integrated into knowledge)
import TagView from '@/pages/core/TagView';
import ArticleCreate from '@/pages/core/ArticleCreate';
import ArticleEdit from '@/pages/core/ArticleEdit';

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DebuggerDashboard from '@/pages/admin/DebuggerDashboard';
import OrganizerDashboard from '@/pages/OrganizerDashboard';
import DotConnectorDashboard from '@/pages/DotConnectorDashboard';

// Rel8 CRM
import Dashboard from '@/pages/rel8t/Dashboard';
import Contacts from '@/pages/rel8t/Contacts';
import ContactCreate from '@/pages/rel8t/ContactCreate';
import ContactEdit from '@/pages/rel8t/ContactEdit';
import ImportContacts from '@/pages/rel8t/ImportContacts';
import Groups from '@/pages/rel8t/Groups';
import Categories from '@/pages/rel8t/Categories';
import Relationships from '@/pages/rel8t/Relationships';
import RelationshipWizard from '@/pages/rel8t/RelationshipWizard';
import TriggerWizard from '@/pages/rel8t/TriggerWizard';
import Notifications from '@/pages/rel8t/Notifications';
import Settings from '@/pages/rel8t/Settings';
import EmailTest from '@/pages/rel8t/EmailTest';

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/invite/:code" element={<InvitePage />} />
        <Route path="/docs" element={<Documentation />} />

        {/* Protected Routes */}
        <Route path="/welcome" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        {/* Profile Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile/:id" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile/setup" element={
          <ProtectedRoute>
            <ProfileSetupPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile/search" element={
          <ProtectedRoute>
            <ProfileSearchPage />
          </ProtectedRoute>
        } />

        {/* Knowledge Base Routes (includes former core functionality) */}
        <Route path="/knowledge" element={
          <ProtectedRoute>
            <KnowledgeBase />
          </ProtectedRoute>
        } />
        
        <Route path="/knowledge/resources" element={
          <ProtectedRoute>
            <UserKnowledgeResource />
          </ProtectedRoute>
        } />
        
        <Route path="/knowledge/:id" element={
          <ProtectedRoute>
            <ArticleView />
          </ProtectedRoute>
        } />
        
        <Route path="/knowledge/create" element={
          <ProtectedRoute>
            <PostTypeSelector />
          </ProtectedRoute>
        } />
        
        <Route path="/knowledge/wizard" element={
          <ProtectedRoute>
            <PostWizard />
          </ProtectedRoute>
        } />
        
        <Route path="/knowledge/topics" element={
          <ProtectedRoute>
            <TopicsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/knowledge/tags/:tag" element={
          <ProtectedRoute>
            <TagView />
          </ProtectedRoute>
        } />
        
        <Route path="/knowledge/:id/edit" element={
          <ProtectedRoute>
            <ArticleEdit />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
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
        
        <Route path="/organizer" element={
          <ProtectedRoute>
            <OrganizerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dot-connector" element={
          <ProtectedRoute>
            <DotConnectorDashboard />
          </ProtectedRoute>
        } />

        {/* Invites Management */}
        <Route path="/invites" element={
          <ProtectedRoute>
            <InvitesManagementPage />
          </ProtectedRoute>
        } />

        {/* Rel8 CRM Routes */}
        <Route path="/rel8" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/contacts" element={
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/contacts/create" element={
          <ProtectedRoute>
            <ContactCreate />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/contacts/:id/edit" element={
          <ProtectedRoute>
            <ContactEdit />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/contacts/import" element={
          <ProtectedRoute>
            <ImportContacts />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/groups" element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/categories" element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/relationships" element={
          <ProtectedRoute>
            <Relationships />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/wizard" element={
          <ProtectedRoute>
            <RelationshipWizard />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/triggers/wizard" element={
          <ProtectedRoute>
            <TriggerWizard />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="/rel8/email-test" element={
          <ProtectedRoute>
            <EmailTest />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
