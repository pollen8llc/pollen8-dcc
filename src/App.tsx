
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import AppRoutes from "./AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a new query client with increased stale time for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <Router>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </Router>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
