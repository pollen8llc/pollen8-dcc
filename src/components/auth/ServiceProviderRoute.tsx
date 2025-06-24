
import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { getUserServiceProvider } from "@/services/modul8Service";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ServiceProviderRouteProps {
  children: React.ReactNode;
}

const ServiceProviderRoute = ({ children }: ServiceProviderRouteProps) => {
  const { session, isLoading: sessionLoading } = useSession();
  const [isServiceProvider, setIsServiceProvider] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServiceProvider = async () => {
      if (!session?.user?.id) {
        setIsServiceProvider(false);
        setLoading(false);
        return;
      }

      try {
        const provider = await getUserServiceProvider(session.user.id);
        setIsServiceProvider(!!provider);
      } catch (error) {
        console.error('Error checking service provider status:', error);
        setIsServiceProvider(false);
      } finally {
        setLoading(false);
      }
    };

    if (!sessionLoading) {
      checkServiceProvider();
    }
  }, [session?.user?.id, sessionLoading]);

  if (sessionLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (!isServiceProvider) {
    return <Navigate to="/labr8/setup" replace />;
  }

  return <>{children}</>;
};

export default ServiceProviderRoute;
