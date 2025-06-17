import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Modul8Dashboard from './pages/modul8/Modul8Dashboard';
import Labr8Dashboard from './pages/labr8/Labr8Dashboard';
import ServiceRequestForm from './pages/modul8/ServiceRequestForm';
import ProviderRequestPortal from './pages/modul8/ProviderRequestPortal';
import OrganizerSetup from './pages/modul8/OrganizerSetup';
import ServiceProviderSetup from './pages/labr8/ServiceProviderSetup';
import RequestStatusPage from './pages/modul8/RequestStatusPage';
import EnhancedLabr8Dashboard from './pages/labr8/EnhancedLabr8Dashboard';
import ProjectDashboard from './components/labr8/ProjectDashboard';
import ModernLabr8Dashboard from './pages/labr8/ModernLabr8Dashboard';
import GridLabr8Dashboard from "@/pages/labr8/GridLabr8Dashboard";
import FixedRequestStatusPage from "@/components/modul8/FixedRequestStatusPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/modul8" element={<Modul8Dashboard />} />
          <Route path="/labr8" element={<Labr8Dashboard />} />
          <Route path="/modul8/request/new" element={<ServiceRequestForm />} />
          <Route path="/modul8/provider/:providerId" element={<ProviderRequestPortal />} />
          <Route path="/modul8/setup/organizer" element={<OrganizerSetup />} />
          <Route path="/labr8/setup" element={<ServiceProviderSetup />} />
          <Route path="/modul8/request/:requestId/status" element={<RequestStatusPage />} />
          <Route path="/modul8/provider/:providerId/:requestId/status" element={<RequestStatusPage />} />
          <Route path="/labr8/dashboard" element={<EnhancedLabr8Dashboard />} />
          <Route path="/labr8/projects" element={<ProjectDashboard />} />
          <Route path="/labr8/modern" element={<ModernLabr8Dashboard />} />
          
          {/* Update LAB-R8 dashboard route */}
          <Route path="/labr8/dashboard" element={<GridLabr8Dashboard />} />
          
          {/* Update status page routes to use fixed version */}
          <Route path="/modul8/request/:requestId/status" element={<FixedRequestStatusPage />} />
          <Route path="/modul8/provider/:providerId/:requestId/status" element={<FixedRequestStatusPage />} />
          <Route path="/labr8/:providerId/:requestId/status" element={<FixedRequestStatusPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
