
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Community } from "@/models/types";
import AdminMembersTab from "./AdminMembersTab";
import AdminSettingsTab from "./AdminSettingsTab";
import AdminStatsTab from "./AdminStatsTab";

interface CommunityManagementDashboardProps {
  community: Community;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CommunityManagementDashboard = ({ 
  community, 
  activeTab, 
  setActiveTab 
}: CommunityManagementDashboardProps) => {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Managing: {community.name}</h1>
          <p className="text-muted-foreground mt-1">
            Make changes to your community settings and manage members
          </p>
        </div>
        <div className="flex gap-2">
          <a 
            href={`/community/${community.id}`} 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            target="_blank" 
            rel="noopener noreferrer"
          >
            View public page →
          </a>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-8 glass dark:glass-dark">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Created: {community.createdAt || 'Not available'}</p>
                <p>Last updated: {community.updatedAt || 'Not available'}</p>
                <p>Visibility: {community.isPublic ? 'Public' : 'Private'}</p>
                <p>Total members: {community.memberCount}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <AdminMembersTab communityId={community.id} />
        </TabsContent>
        
        <TabsContent value="statistics">
          <AdminStatsTab communityId={community.id} />
        </TabsContent>
        
        <TabsContent value="settings">
          <AdminSettingsTab community={community} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityManagementDashboard;
