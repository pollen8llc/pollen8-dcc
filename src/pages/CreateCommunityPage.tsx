
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";
import { useNavigate } from "react-router-dom";
import { Shell } from "@/components/layout/Shell";
import { CommunityForm } from "@/components/community/CommunityForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateCommunityPage() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Check if user is logged in and has proper role
  const isOrganizer = currentUser?.role === UserRole.ORGANIZER || currentUser?.role === UserRole.ADMIN;

  // If user is not an organizer, show permission message
  if (!isOrganizer) {
    return (
      <Shell>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permission Required</AlertTitle>
          <AlertDescription>
            You need organizer permissions to create a community. Please contact an administrator.
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create a New Community</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to create your own community. All fields marked with an asterisk (*) are required.
          </p>
        </div>
        
        <CommunityForm mode="create" />
      </div>
    </Shell>
  );
}
