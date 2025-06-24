
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Home from '@/pages/Index';
import Login from '@/pages/Auth';
import Dashboard from '@/pages/rel8t/Dashboard';
import Discover from '@/pages/ProfileSearchPage';
import Community from '@/components/community/NotFoundState';
import Settings from '@/pages/Settings';
import InviteCreate from '@/pages/InvitesManagementPage';
import InviteAccept from '@/pages/InvitePage';
import KnowledgeHub from '@/pages/knowledge/KnowledgeBase';
import RMSDashboard from '@/pages/rel8t/Dashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ProfilePage from '@/pages/ProfilePage';
import ProfileEditPage from '@/pages/ProfileEditPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';

// LAB-R8 Components
import Labr8Auth from '@/pages/labr8/Labr8Auth';
import Labr8Setup from '@/pages/labr8/Labr8Setup';
import ProviderInbox from '@/pages/labr8/ProviderInbox';
import ModernLabr8Dashboard from '@/pages/labr8/ModernLabr8Dashboard';

// MODUL-8 Components  
import DomainProviders from '@/pages/modul8/DomainProviders';
import Modul8Dashboard from '@/pages/modul8/Modul8Dashboard';

const AppRoutes = () => {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Login />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/discover" element={
        <ProtectedRoute>
          <Discover />
        </ProtectedRoute>
      } />
      
      <Route path="/community/:id" element={
        <ProtectedRoute>
          <Community />
        </ProtectedRoute>
      } />
      
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
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="/invite/create" element={
        <ProtectedRoute>
          <InviteCreate />
        </ProtectedRoute>
      } />
      
      <Route path="/invite/:linkId" element={<InviteAccept />} />
      
      {/* Knowledge Hub Routes */}
      <Route path="/knowledge/*" element={
        <ProtectedRoute>
          <KnowledgeHub />
        </ProtectedRoute>
      } />
      
      <Route path="/knowledge/resources" element={
        <ProtectedRoute>
          <KnowledgeHub />
        </ProtectedRoute>
      } />
      
      <Route path="/rms/*" element={
        <ProtectedRoute>
          <RMSDashboard />
        </ProtectedRoute>
      } />

      {/* LAB-R8 Routes */}
      <Route path="/labr8/auth" element={<Labr8Auth />} />
      <Route path="/labr8/setup" element={
        <ProtectedRoute>
          <Labr8Setup />
        </ProtectedRoute>
      } />
      <Route path="/labr8/inbox" element={
        <ProtectedRoute>
          <ProviderInbox />
        </ProtectedRoute>
      } />
      <Route path="/labr8/dashboard" element={
        <ProtectedRoute>
          <ModernLabr8Dashboard />
        </ProtectedRoute>
      } />

      {/* MODUL-8 Routes */}
      <Route path="/modul8" element={
        <ProtectedRoute>
          <Modul8Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/modul8/domain/:domainId" element={
        <ProtectedRoute>
          <DomainProviders />
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Catch-all route for 404 */}
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
