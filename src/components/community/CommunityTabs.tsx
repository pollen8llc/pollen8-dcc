
import { useState } from "react";
import { Community } from "@/models/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/models/types";
import MemberCard from "@/components/MemberCard";
import { useUser } from "@/contexts/UserContext";
import { Check, Users, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminMembersTab from "@/components/admin/AdminMembersTab";
import { usePermissions } from "@/hooks/usePermissions";

interface CommunityTabsProps {
  communityId: string;
  organizers: User[];
  members: User[];
  memberCount: number;
}

const CommunityTabs = ({ communityId, organizers, members, memberCount }: CommunityTabsProps) => {
  const [activeTab, setActiveTab] = useState("members");
  const { currentUser } = useUser();
  const { isOrganizer } = usePermissions(currentUser);
  const userIsOrganizer = isOrganizer(communityId);
  
  return (
    <div className="container mx-auto px-4 py-8 mb-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full glass dark:glass-dark mb-6">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Members ({memberCount || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>About</span>
          </TabsTrigger>
          {userIsOrganizer && (
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Manage</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="members">
          <div className="grid grid-cols-1 gap-6">
            {organizers.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Organizers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {organizers.map(organizer => (
                    <MemberCard 
                      key={organizer.id} 
                      member={organizer} 
                      role="Organizer"
                      communityId={communityId}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Note: In our new model, there are no regular members, so this section will be empty */}
            {members.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {members.map(member => (
                    <MemberCard 
                      key={member.id} 
                      member={member} 
                      role="Member"
                      communityId={communityId}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {organizers.length === 0 && members.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No members yet</h3>
                <p className="text-muted-foreground">
                  This community doesn't have any members yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About this Community</CardTitle>
              <CardDescription>Learn more about the community's mission and activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Community Description</h3>
                <p className="text-muted-foreground">
                  This community is a space for like-minded individuals to connect, share knowledge, and collaborate on projects.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Activity</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>Discussion</Badge>
                  <Badge>Knowledge Sharing</Badge>
                  <Badge>Networking</Badge>
                </div>
                <p className="text-muted-foreground">
                  Join our regular meetups and online discussions to connect with other members.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Join Us</h3>
                <p className="text-muted-foreground mb-4">
                  Interested in joining this community? Click the button below to get started!
                </p>
                <Button>Join Community</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {userIsOrganizer && (
          <TabsContent value="manage">
            <AdminMembersTab communityId={communityId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CommunityTabs;
