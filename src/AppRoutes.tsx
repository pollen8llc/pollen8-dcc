import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import CommunityProfile from "./pages/CommunityProfile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
import CreateAdminForm from "./components/admin/CreateAdminForm";
import Documentation from "./pages/Documentation";
import Onboarding from "./pages/Onboarding";
import CreateCommunity from "./pages/CreateCommunity";
import JoinCommunities from "./pages/JoinCommunities";
import React from 'react';
import DebuggerDashboard from './pages/admin/DebuggerDashboard';
import OrganizerDashboard from "./pages/OrganizerDashboard";
import DotConnectorDashboard from "./pages/DotConnectorDashboard";
import InvitePage from "./pages/InvitePage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ProfileSearchPage from "./pages/ProfileSearchPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import InvitesManagementPage from "./pages/InvitesManagementPage";

const AppRoutes = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();

  console.log("AppRoutes - Current user state:", { 
    id: currentUser?.id,
    role: currentUser?.role,
    isOrganizer: currentUser?.role === UserRole.ORGANIZER || (currentUser?.managedCommunities?.length || 0) > 0,
    isAdmin: currentUser?.role === UserRole.ADMIN
  });

  useEffect(() => {
    const shouldRedirectToAdmin = localStorage.getItem('shouldRedirectToAdmin');
    
    if (shouldRedirectToAdmin === 'true' && currentUser?.role === UserRole.ADMIN) {
      navigate('/admin');
      localStorage.removeItem('shouldRedirectToAdmin');
    }
  }, [currentUser, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/create-community" element={<CreateCommunity />} />
      <Route path="/communities/join" element={
        <ProtectedRoute requiredRole="MEMBER">
          <JoinCommunities />
        </ProtectedRoute>
      } />
      <Route path="/create-admin" element={<CreateAdminForm />} />
      <Route path="/community/:id" element={<CommunityProfile />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/profile" element={
        <ProtectedRoute requiredRole="MEMBER">
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Profile setup wizard route */}
      <Route path="/profile/setup" element={
        <ProtectedRoute requiredRole="MEMBER">
          <ProfileSetupPage />
        </ProtectedRoute>
      } />
      
      {/* Profile search page */}
      <Route path="/profiles/search" element={
        <ProtectedRoute requiredRole="MEMBER">
          <ProfileSearchPage />
        </ProtectedRoute>
      } />
      
      {/* Existing profile and connection routes */}
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/profile/edit" element={
        <ProtectedRoute requiredRole="MEMBER">
          <ProfileEditPage />
        </ProtectedRoute>
      } />
      <Route path="/connections" element={
        <ProtectedRoute requiredRole="MEMBER">
          <ConnectionsPage />
        </ProtectedRoute>
      } />
      <Route path="/invite/:code" element={<InvitePage />} />
      
      {/* Organizer routes */}
      <Route path="/organizer/invites" element={
        <ProtectedRoute requiredRole="ORGANIZER">
          <InvitesManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/organizer/community/:id" element={
        <ProtectedRoute requiredRole="ORGANIZER">
          <OrganizerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/organizer/dot-connector" element={
        <ProtectedRoute requiredRole="ORGANIZER">
          <DotConnectorDashboard />
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/community/:id" element={
        <ProtectedRoute requiredRole="ORGANIZER">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/debug" element={
        <ProtectedRoute requiredRole="ADMIN">
          <DebuggerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
