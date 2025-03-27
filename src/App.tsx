
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
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

// Create a new query client with increased stale time for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create-admin" element={<CreateAdminForm />} />
            <Route path="/community/:id" element={<CommunityProfile />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/profile" element={
              <ProtectedRoute requiredRole="MEMBER">
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Protected routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="ORGANIZER">
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
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
