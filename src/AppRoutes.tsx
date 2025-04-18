import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import CommunityProfile from "./pages/CommunityProfile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import KnowledgeBase from "./pages/knowledge/KnowledgeBase";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
import CreateAdminForm from "./components/admin/CreateAdminForm";
import Documentation from "./pages/Documentation";
import Onboarding from "./pages/Onboarding";
import CreateCommunity from "./pages/CreateCommunity";
import JoinCommunities from "./pages/JoinCommunities";
import OrganizerDashboard from "./pages/admin/OrganizerDashboard";

const AppRoutes = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const shouldRedirectToAdmin = localStorage.getItem('shouldRedirectToAdmin');
    
    if (shouldRedirectToAdmin === 'true' && currentUser?.role === UserRole.ADMIN) {
      navigate('/admin');
      localStorage.removeItem('shouldRedirectToAdmin');
    }
  }, [currentUser, navigate]);

  console.log("Current user role in AppRoutes:", currentUser?.role);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/create-community" element={
        <ProtectedRoute requiredRole="MEMBER">
          <CreateCommunity />
        </ProtectedRoute>
      } />
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
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/community/:id" 
        element={
          <ProtectedRoute requiredRole="ORGANIZER">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/knowledge/:communityId" 
        element={
          <ProtectedRoute requiredRole="MEMBER">
            <KnowledgeBase />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/organizer" 
        element={
          <ProtectedRoute requiredRole="ORGANIZER">
            <OrganizerDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
