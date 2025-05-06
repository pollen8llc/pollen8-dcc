
import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import UnifiedProfileForm from "@/components/profile/UnifiedProfileForm";
import { Clipboard, User, UserCheck } from "lucide-react";

const ProfileSetupPage: React.FC = () => {
  const { currentUser, refreshUser } = useUser();
  const navigate = useNavigate();

  const handleComplete = async () => {
    await refreshUser();
    navigate('/profile');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Welcome! Let's set up your profile so others can find you and you can connect with the community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <UnifiedProfileForm 
                mode="setup" 
                existingData={currentUser} 
                onComplete={handleComplete}
              />
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg">Why complete your profile?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">A complete profile helps you:</p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 shrink-0 mt-0.5">✓</div>
                      <span>Connect with like-minded people</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 shrink-0 mt-0.5">✓</div>
                      <span>Find relevant communities to join</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 shrink-0 mt-0.5">✓</div>
                      <span>Share your interests and expertise</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Clipboard className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">Profile Tips</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="text-muted-foreground">Add a profile photo to make your profile more recognizable</li>
                    <li className="text-muted-foreground">Include specific interests to help with matching</li>
                    <li className="text-muted-foreground">Set your location to find nearby communities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
