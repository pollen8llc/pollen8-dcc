
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
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
import Navbar from "./components/Navbar";

const AppRoutes = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to stored location after login (if any)
  useEffect(() => {
    if (currentUser && !isLoading) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
    }
  }, [currentUser, isLoading, navigate]);
  
  // Handle admin redirect after login
  useEffect(() => {
    const shouldRedirectToAdmin = localStorage.getItem('shouldRedirectToAdmin');
    
    if (shouldRedirectToAdmin === 'true' && currentUser?.role === UserRole.ADMIN) {
      navigate('/admin');
      localStorage.removeItem('shouldRedirectToAdmin');
    }
  }, [currentUser, navigate]);

  // Render layout with common components
  const renderWithNavbar = (element: JSX.Element) => (
    <>
      <Navbar />
      {element}
    </>
  );

  return (
    <Routes>
      <Route path="/" element={renderWithNavbar(<Index />)} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/create-admin" element={<CreateAdminForm />} />
      <Route path="/community/:id" element={renderWithNavbar(<CommunityProfile />)} />
      <Route path="/documentation" element={renderWithNavbar(<Documentation />)} />
      <Route path="/profile" element={
        <ProtectedRoute requiredRole="MEMBER">
          {renderWithNavbar(<Profile />)}
        </ProtectedRoute>
      } />
      
      {/* Protected routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="ORGANIZER">
            {renderWithNavbar(<AdminDashboard />)}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/community/:id" 
        element={
          <ProtectedRoute requiredRole="ORGANIZER">
            {renderWithNavbar(<AdminDashboard />)}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/knowledge/:communityId" 
        element={
          <ProtectedRoute requiredRole="MEMBER">
            {renderWithNavbar(<KnowledgeBase />)}
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route */}
      <Route path="*" element={renderWithNavbar(<NotFound />)} />
    </Routes>
  );
};

export default AppRoutes;
