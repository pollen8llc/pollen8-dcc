
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import ProfileSetupWizard from "@/components/profile/ProfileSetupWizard";

const ProfileSetupPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if user is not authenticated
  if (!currentUser) {
    navigate("/auth?redirectTo=/profile/setup");
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProfileSetupWizard />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
