
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import LandingPage from "./LandingPage";

const Index = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && currentUser) {
      // Check if profile is complete before redirecting
      if (!currentUser.profile_complete) {
        navigate("/profile/setup");
      } else {
        // If user is logged in and profile is complete, redirect to knowledge resources page
        navigate("/knowledge/resources");
      }
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not logged in, show the landing page with heroMode=true for full-width layout
  return (
    <Shell heroMode={true}>
      <LandingPage />
    </Shell>
  );
};

export default Index;
