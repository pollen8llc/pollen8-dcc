
import { useState } from "react";
import { User } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberCard from "@/components/MemberCard";
import MemberModal from "@/components/MemberModal";

interface CommunityTabsProps {
  communityId: string;
  organizers: User[];
  members: User[];
  memberCount: number;
}

const CommunityTabs = ({ communityId, organizers, members, memberCount }: CommunityTabsProps) => {
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleMemberClick = (member: User) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };
  
  return (
    <div className="container mx-auto px-4 pb-16">
      <Tabs defaultValue="organizers" className="appear-animate" style={{animationDelay: "0.2s"}}>
        <TabsList className="mb-8 glass dark:glass-dark">
          <TabsTrigger value="organizers">Organizers</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="organizers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizers.map((organizer) => (
              <div key={organizer.id}>
                <MemberCard 
                  member={organizer}
                  onClick={handleMemberClick}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="py-8">
          <div className="flex flex-col items-center justify-center text-center h-64">
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              Event functionality will be available in an upcoming update.
            </p>
            <Button variant="outline">
              Get Notified
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Member Modal */}
      <MemberModal
        member={selectedMember}
        open={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default CommunityTabs;
