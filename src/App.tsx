
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";

// Main pages
import Index from "./pages/Index";
import Dashboard from "./pages/rel8t/Dashboard";
import Contacts from "./pages/rel8t/Contacts";
import Groups from "./pages/rel8t/Groups";
import Settings from "./pages/rel8t/Settings";
import Import from "./pages/rel8t/Import";
import Relationships from "./pages/rel8/Relationships";
import Notifications from "./pages/rel8t/Notifications";
import RelationshipWizard from "./pages/rel8t/RelationshipWizard";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rel8" element={<Dashboard />} />
            <Route path="/rel8/contacts" element={<Contacts />} />
            <Route path="/rel8/groups" element={<Groups />} />
            <Route path="/rel8/settings" element={<Settings />} />
            <Route path="/rel8/import" element={<Import />} />
            <Route path="/rel8/relationships" element={<Relationships />} />
            <Route path="/rel8/notifications" element={<Notifications />} />
            <Route path="/rel8/wizard" element={<RelationshipWizard />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
