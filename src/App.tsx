
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./hooks/useSession";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Communities from "./pages/Communities";
import CommunityDetails from "./pages/CommunityDetails";
import CreateCommunity from "./pages/CreateCommunity";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CommunityManagement from "./pages/admin/CommunityManagement";
import SystemHealth from "./pages/admin/SystemHealth";
import AuditLogs from "./pages/admin/AuditLogs";
import Knowledge from "./pages/Knowledge";
import KnowledgeArticle from "./pages/KnowledgeArticle";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import RMS from "./pages/rms/RMS";
import RMSContacts from "./pages/rms/RMSContacts";
import RMSSettings from "./pages/rms/RMSSettings";
import RMSCategories from "./pages/rms/RMSCategories";
import RMSContactDetails from "./pages/rms/RMSContactDetails";
import RMSContactImport from "./pages/rms/RMSContactImport";
import Rel8 from "./pages/rel8t/Rel8";
import Rel8Contacts from "./pages/rel8t/Rel8Contacts";
import Rel8ContactDetails from "./pages/rel8t/Rel8ContactDetails";
import Rel8Import from "./pages/rel8t/Rel8Import";
import Rel8Settings from "./pages/rel8t/Rel8Settings";
import Rel8Categories from "./pages/rel8t/Rel8Categories";
import Rel8Relationships from "./pages/rel8t/Rel8Relationships";
import Rel8Groups from "./pages/rel8t/Rel8Groups";
import Rel8Triggers from "./pages/rel8t/Rel8Triggers";
import Rel8RelationshipWizard from "./pages/rel8t/Rel8RelationshipWizard";

// LAB-R8 Pages (without dashboard)
import Labr8Landing from "./pages/labr8/Labr8Landing";
import Labr8Auth from "./pages/labr8/Labr8Auth";
import Labr8Setup from "./pages/labr8/Labr8Setup";
import Labr8RequestStatus from "./pages/labr8/Labr8RequestStatus";
import Labr8ProjectDetails from "./pages/labr8/Labr8ProjectDetails";

// MODUL8 Pages (without dashboard)
import ServiceRequestForm from "./pages/modul8/ServiceRequestForm";
import ServiceRequestDetails from "./pages/modul8/ServiceRequestDetails";
import RequestStatus from "./pages/modul8/RequestStatus";
import ProviderRequestPortal from "./pages/modul8/ProviderRequestPortal";
import DomainProviders from "./pages/modul8/DomainProviders";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/community/:id" element={<CommunityDetails />} />
              <Route path="/create-community" element={<CreateCommunity />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/communities" element={<CommunityManagement />} />
              <Route path="/admin/system" element={<SystemHealth />} />
              <Route path="/admin/audit" element={<AuditLogs />} />
              
              {/* Knowledge Base Routes */}
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/knowledge/article/:id" element={<KnowledgeArticle />} />
              <Route path="/knowledge/create" element={<CreateArticle />} />
              <Route path="/knowledge/edit/:id" element={<EditArticle />} />
              
              {/* RMS Routes */}
              <Route path="/rms" element={<RMS />} />
              <Route path="/rms/contacts" element={<RMSContacts />} />
              <Route path="/rms/contacts/:id" element={<RMSContactDetails />} />
              <Route path="/rms/contacts/import" element={<RMSContactImport />} />
              <Route path="/rms/categories" element={<RMSCategories />} />
              <Route path="/rms/settings" element={<RMSSettings />} />
              
              {/* REL8 Routes */}
              <Route path="/rel8" element={<Rel8 />} />
              <Route path="/rel8/contacts" element={<Rel8Contacts />} />
              <Route path="/rel8/contacts/:id" element={<Rel8ContactDetails />} />
              <Route path="/rel8/import" element={<Rel8Import />} />
              <Route path="/rel8/settings" element={<Rel8Settings />} />
              <Route path="/rel8/categories" element={<Rel8Categories />} />
              <Route path="/rel8/relationships" element={<Rel8Relationships />} />
              <Route path="/rel8/groups" element={<Rel8Groups />} />
              <Route path="/rel8/triggers" element={<Rel8Triggers />} />
              <Route path="/rel8/wizard" element={<Rel8RelationshipWizard />} />
              
              {/* LAB-R8 Routes (without dashboard) */}
              <Route path="/labr8" element={<Labr8Landing />} />
              <Route path="/labr8/auth" element={<Labr8Auth />} />
              <Route path="/labr8/setup" element={<Labr8Setup />} />
              <Route path="/labr8/request/:id/status" element={<Labr8RequestStatus />} />
              <Route path="/labr8/:providerId/:requestId/status" element={<Labr8RequestStatus />} />
              <Route path="/labr8/project/:projectId" element={<Labr8ProjectDetails />} />
              
              {/* MODUL8 Routes (without dashboard) */}
              <Route path="/modul8" element={<Navigate to="/" replace />} />
              <Route path="/modul8/request/new" element={<ServiceRequestForm />} />
              <Route path="/modul8/request/:id" element={<ServiceRequestDetails />} />
              <Route path="/modul8/request/:id/status" element={<RequestStatus />} />
              <Route path="/modul8/provider/:providerId/request" element={<ProviderRequestPortal />} />
              <Route path="/modul8/provider/:providerId/:requestId/status" element={<RequestStatus />} />
              <Route path="/modul8/domain/:domainId" element={<DomainProviders />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
