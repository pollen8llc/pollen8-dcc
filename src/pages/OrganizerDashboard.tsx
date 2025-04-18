
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import * as communityService from "@/services/communityService";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: managedCommunities, isLoading } = useQuery({
    queryKey: ['managed-communities', currentUser?.id],
    queryFn: () => communityService.getManagedCommunities(currentUser?.id || ""),
    enabled: !!currentUser?.id
  });

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8 glass dark:glass-dark">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communities">My Communities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Quick Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ) : managedCommunities?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't created any communities yet</p>
                    <Button 
                      onClick={() => navigate("/create-community")}
                      variant="outline"
                    >
                      Create Your First Community
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">{managedCommunities?.length}</CardTitle>
                        <p className="text-sm text-muted-foreground">Communities</p>
                      </CardHeader>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="communities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : managedCommunities?.map((community) => (
                <Card 
                  key={community.id}
                  className="hover:shadow-md cursor-pointer transition-all"
                  onClick={() => navigate(`/admin/community/${community.id}`)}
                >
                  <CardHeader>
                    <CardTitle>{community.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative mb-4 overflow-hidden rounded-md">
                      <img 
                        src={community.imageUrl} 
                        alt={community.name} 
                        className="object-cover w-full h-full" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {community.description}
                    </p>
                    <div className="mt-4 text-sm">
                      <span className="font-medium">{community.memberCount}</span> members
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
