
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Added this import
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import * as communityService from '@/services/communityService';

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();  // Added this line
  const { currentUser, isLoading } = useUser();

  const { data: managedCommunities, isLoading: isLoadingCommunities } = useQuery({
    queryKey: ['managed-communities', currentUser?.id],
    queryFn: () => communityService.getManagedCommunities(currentUser?.id || ""),
    enabled: !!currentUser?.id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Community Management</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your communities
            </p>
          </div>
          <Button 
            onClick={() => navigate("/create-community")} 
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Community
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full mb-8 glass dark:glass-dark">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communities">My Communities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingCommunities ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">{managedCommunities?.length || 0}</CardTitle>
                        <p className="text-sm text-muted-foreground">Communities Managed</p>
                      </CardHeader>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
