
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { AlertTriangle } from "lucide-react";

/**
 * @deprecated This component is maintained for backward compatibility.
 * Community functionality has been removed from the platform.
 */
const CommunityPicker = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      // No-op as communities have been removed
      console.warn("CommunityPicker: Community functionality has been removed");
      setIsLoading(false);
    };

    fetchCommunities();
  }, []);

  const handleJoinCommunity = async () => {
    // No-op as communities have been removed
    console.warn("handleJoinCommunity: Community functionality has been removed");
    navigate("/rel8/dashboard");
  };

  const handleSkip = () => {
    navigate("/rel8/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Join Communities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="mb-2">Community functionality has been deprecated</p>
          <p className="text-sm text-muted-foreground mb-4">
            Community features have been removed from the platform.
            Please continue to your dashboard.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2">
        <Button onClick={handleSkip}>Continue to Dashboard</Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityPicker;
