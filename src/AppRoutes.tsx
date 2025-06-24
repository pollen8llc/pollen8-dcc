
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ServiceProviderRoute from "@/components/auth/ServiceProviderRoute";
import NonServiceProviderRoute from "@/components/auth/NonServiceProviderRoute";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const ProfileSetup = lazy(() => import("@/pages/ProfileSetup"));

// Modul8 components (Organizers)
const Modul8Dashboard = lazy(() => import("@/pages/modul8/Modul8Dashboard"));
const DomainDirectory = lazy(() => import("@/pages/modul8/DomainDirectory"));
const ServiceRequestForm = lazy(() => import("@/pages/modul8/ServiceRequestForm"));
const Modul8RequestDetails = lazy(() => import("@/pages/modul8/Modul8RequestDetails"));

// LAB-R8 components (Service Providers)
const Labr8Dashboard = lazy(() => import("@/pages/labr8/Labr8Dashboard"));
const Labr8RequestDetails = lazy(() => import("@/pages/labr8/Labr8RequestDetails"));
const Labr8Setup = lazy(() => import("@/pages/labr8/Labr8Setup"));

// Knowledge Base
const KnowledgeBase = lazy(() => import("@/pages/KnowledgeBase"));

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    }>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Profile setup route */}
        <Route 
          path="/profile/setup" 
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />

        {/* Knowledge Base - accessible to all authenticated users */}
        <Route 
          path="/knowledge/*" 
          element={
            <ProtectedRoute>
              <NonServiceProviderRoute>
                <KnowledgeBase />
              </NonServiceProviderRoute>
            </ProtectedRoute>
          } 
        />

        {/* LAB-R8 Routes (Service Providers Only) */}
        <Route 
          path="/labr8/setup" 
          element={
            <ProtectedRoute>
              <ServiceProviderRoute>
                <Labr8Setup />
              </ServiceProviderRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/labr8/dashboard" 
          element={
            <ProtectedRoute>
              <ServiceProviderRoute>
                <Labr8Dashboard />
              </ServiceProviderRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/labr8/dashboard/request/:requestId" 
          element={
            <ProtectedRoute>
              <ServiceProviderRoute>
                <Labr8RequestDetails />
              </ServiceProviderRoute>
            </ProtectedRoute>
          } 
        />

        {/* Modul8 Routes (Non-Service Providers) */}
        <Route 
          path="/modul8/dashboard" 
          element={
            <ProtectedRoute>
              <NonServiceProviderRoute>
                <Modul8Dashboard />
              </NonServiceProviderRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/modul8/dashboard/directory/:domainId" 
          element={
            <ProtectedRoute>
              <NonServiceProviderRoute>
                <DomainDirectory />
              </NonServiceProviderRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/modul8/dashboard/request/new" 
          element={
            <ProtectedRoute>
              <NonServiceProviderRoute>
                <ServiceRequestForm />
              </NonServiceProviderRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/modul8/dashboard/request/:requestId" 
          element={
            <ProtectedRoute>
              <NonServiceProviderRoute>
                <Modul8RequestDetails />
              </NonServiceProviderRoute>
            </ProtectedRoute>
          } 
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
