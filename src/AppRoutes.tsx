
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ServiceProviderProtectedRoute from '@/components/auth/ServiceProviderProtectedRoute';
import NonServiceProviderRoute from '@/components/auth/NonServiceProviderRoute';
import Rel8ProtectedRoute from '@/components/auth/Rel8ProtectedRoute';

// Import all pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import ProfileEditPage from '@/pages/ProfileEditPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import ProfilePage from '@/pages/ProfilePage';
import ProfileSearchPage from '@/pages/ProfileSearchPage';
import InvitePage from '@/pages/InvitePage';
import InvitesManagementPage from '@/pages/InvitesManagementPage';
import Onboarding from '@/pages/Onboarding';

// Knowledge Base
import KnowledgeBase from '@/pages/knowledge/KnowledgeBase';
import ArticleView from '@/pages/knowledge/ArticleView';
import ContentCreator from '@/pages/knowledge/ContentCreator';
import PostWizard from '@/pages/knowledge/PostWizard';
import TopicsPage from '@/pages/knowledge/TopicsPage';
import UserKnowledgeResource from '@/pages/knowledge/UserKnowledgeResource';

// Core Knowledge
import CoreLandingPage from '@/pages/core/CoreLandingPage';
import ArticleCreate from '@/pages/core/ArticleCreate';
import ArticleEdit from '@/pages/core/ArticleEdit';
import TagView from '@/pages/core/TagView';
import CoreArticleView from '@/pages/core/ArticleView';

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DebuggerDashboard from '@/pages/admin/DebuggerDashboard';

// Modul8 (Organizer) pages
import Modul8Dashboard from '@/pages/modul8/Modul8Dashboard';
import ModernModul8Dashboard from '@/pages/modul8/ModernModul8Dashboard';
import EnhancedModul8Dashboard from '@/pages/modul8/EnhancedModul8Dashboard';
import DomainProviders from '@/pages/modul8/DomainProviders';
import RequestWizard from '@/pages/modul8/RequestWizard';
import ServiceRequestForm from '@/pages/modul8/ServiceRequestForm';
import ServiceRequestDetails from '@/pages/modul8/ServiceRequestDetails';
import RequestStatus from '@/pages/modul8/RequestStatus';
import ProjectStatusView from '@/pages/modul8/ProjectStatusView';
import ProviderDirectory from '@/pages/modul8/ProviderDirectory';
import ProviderRequestPortal from '@/pages/modul8/ProviderRequestPortal';
import OrganizerSetup from '@/pages/modul8/OrganizerSetup';

// LAB-R8 (Service Provider) pages
import Labr8Landing from '@/pages/labr8/Labr8Landing';
import Labr8Auth from '@/pages/labr8/Labr8Auth';
import Labr8Setup from '@/pages/labr8/Labr8Setup';
import Labr8Dashboard from '@/pages/labr8/Labr8Dashboard';
import GridLabr8Dashboard from '@/pages/labr8/GridLabr8Dashboard';
import ModernLabr8Dashboard from '@/pages/labr8/ModernLabr8Dashboard';
import EnhancedLabr8Dashboard from '@/pages/labr8/EnhancedLabr8Dashboard';
import ClientDatabase from '@/pages/labr8/ClientDatabase';
import ProviderInbox from '@/pages/labr8/ProviderInbox';
import Labr8ProjectStatus from '@/pages/labr8/Labr8ProjectStatus';
import Labr8RequestStatus from '@/pages/labr8/Labr8RequestStatus';
import Labr8ProjectDetails from '@/pages/labr8/Labr8ProjectDetails';
import Labr8RequestDetails from '@/pages/labr8/Labr8RequestDetails';
import ProjectDetails from '@/pages/labr8/ProjectDetails';
import ProjectWorkspace from '@/pages/labr8/ProjectWorkspace';

// REL8-T pages
import ContactCreate from '@/pages/rel8t/ContactCreate';
import ContactView from '@/pages/rel8t/ContactView';
import Categories from '@/pages/rel8t/Categories';
import ContactList from '@/pages/rel8t/ContactList';
import Triggers from '@/pages/rel8t/Triggers';
import SmartEngage from '@/pages/rel8t/SmartEngage';
import BuildRapport from '@/pages/rel8t/BuildRapport';
import Rel8tDashboard from '@/pages/rel8t/Rel8tDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/invite/:code" element={<InvitePage />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Profile routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      <Route path="/profile/setup" element={<ProfileSetupPage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/profiles/search" element={<ProfileSearchPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/invites" element={<InvitesManagementPage />} />

      {/* Knowledge Base routes */}
      <Route path="/knowledge" element={<KnowledgeBase />} />
      <Route path="/knowledge/resources" element={<UserKnowledgeResource />} />
      <Route path="/knowledge/articles/:id" element={<ArticleView />} />
      <Route path="/knowledge/create" element={<ContentCreator />} />
      <Route path="/knowledge/wizard" element={<PostWizard />} />
      <Route path="/knowledge/topics" element={<TopicsPage />} />

      {/* Core Knowledge routes */}
      <Route path="/core" element={<CoreLandingPage />} />
      <Route path="/core/articles/create" element={<ArticleCreate />} />
      <Route path="/core/articles/:id/edit" element={<ArticleEdit />} />
      <Route path="/core/articles/:id" element={<CoreArticleView />} />
      <Route path="/core/tags/:tagName" element={<TagView />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/debugger" element={<DebuggerDashboard />} />

      {/* Modul8 (Organizer) routes - Protected */}
      <Route path="/modul8" element={
        <NonServiceProviderRoute>
          <Modul8Dashboard />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/modern" element={
        <NonServiceProviderRoute>
          <ModernModul8Dashboard />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/enhanced" element={
        <NonServiceProviderRoute>
          <EnhancedModul8Dashboard />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/domain/:domainId" element={
        <NonServiceProviderRoute>
          <DomainProviders />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/request/create" element={
        <NonServiceProviderRoute>
          <RequestWizard />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/request/form" element={
        <NonServiceProviderRoute>
          <ServiceRequestForm />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/request/:requestId" element={
        <NonServiceProviderRoute>
          <ServiceRequestDetails />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/request/:requestId/status" element={
        <NonServiceProviderRoute>
          <RequestStatus />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/project/:projectId/status" element={
        <NonServiceProviderRoute>
          <ProjectStatusView />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/providers" element={
        <NonServiceProviderRoute>
          <ProviderDirectory />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/providers/:providerId" element={
        <NonServiceProviderRoute>
          <ProviderRequestPortal />
        </NonServiceProviderRoute>
      } />
      <Route path="/modul8/setup" element={
        <NonServiceProviderRoute>
          <OrganizerSetup />
        </NonServiceProviderRoute>
      } />

      {/* LAB-R8 (Service Provider) routes */}
      <Route path="/labr8" element={<Labr8Landing />} />
      <Route path="/labr8/auth" element={<Labr8Auth />} />
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
      <Route path="/labr8/grid" element={
        <ServiceProviderProtectedRoute>
          <GridLabr8Dashboard />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/modern" element={
        <ServiceProviderProtectedRoute>
          <ModernLabr8Dashboard />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/enhanced" element={
        <ServiceProviderProtectedRoute>
          <EnhancedLabr8Dashboard />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/inbox" element={
        <ServiceProviderProtectedRoute>
          <ProviderInbox />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/:providerId/:requestId/status" element={
        <ServiceProviderProtectedRoute>
          <Labr8ProjectStatus />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/request/:requestId/status" element={
        <ServiceProviderProtectedRoute>
          <Labr8RequestStatus />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/project/:projectId" element={
        <ServiceProviderProtectedRoute>
          <Labr8ProjectDetails />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/request/:requestId" element={
        <ServiceProviderProtectedRoute>
          <Labr8RequestDetails />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/projects/:projectId" element={
        <ServiceProviderProtectedRoute>
          <ProjectDetails />
        </ServiceProviderProtectedRoute>
      } />
      <Route path="/labr8/workspace/:projectId" element={
        <ServiceProviderProtectedRoute>
          <ProjectWorkspace />
        </ServiceProviderProtectedRoute>
      } />

      {/* REL8-T routes - Protected */}
      <Route path="/rel8t" element={
        <Rel8ProtectedRoute>
          <Rel8tDashboard />
        </Rel8ProtectedRoute>
      } />
      <Route path="/rel8t/contacts" element={
        <Rel8ProtectedRoute>
          <ContactList />
        </Rel8ProtectedRoute>
      } />
      <Route path="/rel8t/contacts/create" element={
        <Rel8ProtectedRoute>
          <ContactCreate />
        </Rel8ProtectedRoute>
      } />
      <Route path="/rel8t/contacts/:id" element={
        <Rel8ProtectedRoute>
          <ContactView />
        </Rel8ProtectedRoute>
      } />
      <Route path="/rel8t/categories" element={
        <Rel8ProtectedRoute>
          <Categories />
        </Rel8ProtectedRoute>
      } />
      <Route path="/rel8t/triggers" element={
        <Rel8ProtectedRoute>
          <Triggers />
        </Rel8ProtectedRoute>
      } />
      <Route path="/rel8t/smart-engage" element={
        <Rel8ProtectedRoute>
          <SmartEngage />
        </Rel8ProtectedRoute>
      } />
      <Route path="/rel8t/build-rapport" element={
        <Rel8ProtectedRoute>
          <BuildRapport />
        </Rel8ProtectedRoute>
      } />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
