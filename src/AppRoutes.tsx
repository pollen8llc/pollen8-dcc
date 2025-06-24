
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
      
      <Route path="/knowledge" element={
        <ProtectedRoute>
          <KnowledgeHub />
        </ProtectedRoute>
      } />
      
      <Route path="/rms/*" element={
        <ProtectedRoute>
          <RMSDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
