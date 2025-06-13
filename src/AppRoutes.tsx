
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ProfileEditPage = lazy(() => import('@/pages/ProfileEditPage'));
const ProfileSetupPage = lazy(() => import('@/pages/ProfileSetupPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// REL8T pages - these exist and are imported directly (not lazy)
import Dashboard from '@/pages/rel8t/Dashboard';
import Contacts from '@/pages/rel8t/Contacts';
import ImportContacts from '@/pages/rel8t/ImportContacts';
import Relationships from '@/pages/rel8t/Relationships';
import Settings from '@/pages/rel8t/Settings';
import TriggerWizard from '@/pages/rel8t/TriggerWizard';
import Categories from '@/pages/rel8t/Categories';
import RelationshipWizard from '@/pages/rel8t/RelationshipWizard';
import EmailTest from '@/pages/rel8t/EmailTest';
import ContactCreate from '@/pages/rel8t/ContactCreate';
import ContactEdit from "@/pages/rel8t/ContactEdit";

const AppRoutes: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  
  // Protected route component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (!currentUser) {
      return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
  };

  // REL8 Protected route component
  const Rel8ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (!currentUser) {
      return <Navigate to="/auth?redirectTo=/rel8" replace />;
    }
    return <>{children}</>;
  };
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
        <Route path="/profile/setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />

        {/* REL8 Routes */}
        <Route path="/rel8" element={<Rel8ProtectedRoute><Dashboard /></Rel8ProtectedRoute>} />
        <Route path="/rel8/contacts" element={<Rel8ProtectedRoute><Contacts /></Rel8ProtectedRoute>} />
        <Route path="/rel8/contacts/create" element={<Rel8ProtectedRoute><ContactCreate /></Rel8ProtectedRoute>} />
        <Route path="/rel8/contacts/:id/edit" element={<Rel8ProtectedRoute><ContactEdit /></Rel8ProtectedRoute>} />
        <Route path="/rel8/contacts/import" element={<Rel8ProtectedRoute><ImportContacts /></Rel8ProtectedRoute>} />
        <Route path="/rel8/relationships" element={<Rel8ProtectedRoute><Relationships /></Rel8ProtectedRoute>} />
        <Route path="/rel8/wizard" element={<Rel8ProtectedRoute><RelationshipWizard /></Rel8ProtectedRoute>} />
        <Route path="/rel8/triggers" element={<Rel8ProtectedRoute><Settings /></Rel8ProtectedRoute>} />
        <Route path="/rel8/triggers/wizard" element={<Rel8ProtectedRoute><TriggerWizard /></Rel8ProtectedRoute>} />
        <Route path="/rel8/categories" element={<Rel8ProtectedRoute><Categories /></Rel8ProtectedRoute>} />
        <Route path="/rel8/settings" element={<Rel8ProtectedRoute><Settings /></Rel8ProtectedRoute>} />
        <Route path="/rel8/email-test" element={<Rel8ProtectedRoute><EmailTest /></Rel8ProtectedRoute>} />

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
