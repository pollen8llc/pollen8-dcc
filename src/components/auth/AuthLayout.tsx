
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import ThemeToggle from "@/components/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = "ECO8",
  subtitle = "Community platform for environmentally conscious organizations"
}) => {
  const { currentUser, isLoading } = useUser();

  // Note: No redirect here - let Auth.tsx handle authenticated user redirects

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
