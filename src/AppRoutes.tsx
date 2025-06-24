
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Home } from '@/pages/home';
import { Login } from '@/pages/login';
import { Dashboard } from '@/pages/dashboard';
import { Discover } from '@/pages/discover';
import { Community } from '@/pages/community';
import { Profile } from '@/pages/profile';
import { Settings } from '@/pages/settings';
import { InviteCreate } from '@/pages/invite-create';
import { InviteAccept } from '@/pages/invite-accept';
import { KnowledgeHub } from '@/pages/knowledge-hub';
import { RMSDashboard } from '@/pages/rms/dashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { AdminDashboard } from '@/pages/admin/dashboard';
import LoadingSpinner from '@/components/ui/loading-spinner';

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
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
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
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
