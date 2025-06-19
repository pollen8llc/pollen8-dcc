
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Import existing pages
import Index from '@/pages/Index';
import ProfilePage from '@/pages/ProfilePage';
import ProfileEditPage from '@/pages/ProfileEditPage';
import ProfileSetupPage from '@/pages/ProfileSetupPage';
import Relationships from '@/pages/rel8t/Relationships';
import TriggerWizard from '@/pages/rel8t/TriggerWizard';
import RelationshipWizard from '@/pages/rel8t/RelationshipWizard';
import Labr8Auth from '@/pages/labr8/Labr8Auth';

// Import PRD documentation pages
import PRDIndex from '@/pages/docs/PRDIndex';
import PRDOverview from '@/pages/docs/PRDOverview';
import PRDUserManagement from '@/pages/docs/PRDUserManagement';

const AppRoutes = () => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/labr8/auth" element={<Labr8Auth />} />
      
      {/* Documentation routes (public access) */}
      <Route path="/docs/prd" element={<PRDIndex />} />
      <Route path="/docs/prd/overview" element={<PRDOverview />} />
      <Route path="/docs/prd/user-management" element={<PRDUserManagement />} />
      
      {/* Protected routes */}
      {currentUser ? (
        <>
          {/* Profile routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/setup" element={<ProfileSetupPage />} />
          
          {/* REL8T routes */}
          <Route path="/rel8/relationships" element={<Relationships />} />
          <Route path="/rel8/triggers/wizard" element={<TriggerWizard />} />
          <Route path="/rel8/wizard" element={<RelationshipWizard />} />
          
          {/* Fallback for authenticated users */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* Redirect unauthenticated users to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
