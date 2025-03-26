
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MemberCard from "@/components/MemberCard";
import MemberModal from "@/components/MemberModal";
import { User } from "@/data/types";
import { getCommunityById, getCommunityOrganizers, getCommunityRegularMembers } from "@/data/mockData";
import { Users, MapPin, Tag, ExternalLink, Target, Calendar, Megaphone, BarChart, Layers, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const CommunityProfile = () => {
  const { id } = useParams<{ id: string }>();
  const community = getCommunityById(id || "");
  const organizers = getCommunityOrganizers(id || "");
  const members = getCommunityRegularMembers(id || "");
  
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Community Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The community you're looking for doesn't exist or has been removed.
          </p>
          <Button
            className="bg-aquamarine text-primary-foreground hover:bg-aquamarine/90"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  const handleMemberClick = (member: User) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };
  
  // Meta information for the community
  const communityMeta = [
    { icon: <Target className="h-5 w-5" />, title: "Mission and Purpose", value: "Connect tech professionals" },
    { icon: <Users className="h-5 w-5" />, title: "Community Size", value: `${community.memberCount} members` },
    { icon: <BarChart className="h-5 w-5" />, title: "Current Following", value: "2,450+" },
    { icon: <Calendar className="h-5 w-5" />, title: "Event Turnout", value: "25-40 attendees" },
    { icon: <Megaphone className="h-5 w-5" />, title: "Events Organized", value: "12 this year" },
    { icon: <Layers className="h-5 w-5" />, title: "Event Formats", value: "Workshops & Meetups" },
    { icon: <Target className="h-5 w-5" />, title: "Target Audience", value: "Tech professionals" },
    { icon: <Code className="h-5 w-5" />, title: "Tech Stack", value: "Discord, Notion, Luma" },
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <div className="relative pt-20">
        <div className="h-56 sm:h-64 md:h-80 relative overflow-hidden">
          <img
            src={community.imageUrl}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="relative -mt-24 sm:-mt-32 mb-12 appear-animate">
            <div className="glass dark:glass-dark rounded-xl p-6 sm:p-8 border border-border/40 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold">{community.name}</h1>
                  <div className="flex flex-wrap items-center mt-3 gap-3">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{community.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{community.memberCount} members</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                  <Button className="bg-aquamarine text-primary-foreground hover:bg-aquamarine/90 shadow-sm">
                    Join Community
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              <p className="mt-6 text-lg">{community.description}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {community.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-muted text-muted-foreground flex items-center"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Community Meta Information */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 appear-animate" style={{animationDelay: "0.3s"}}>
          {communityMeta.map((meta, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-muted rounded-full p-2 text-foreground">
                  {meta.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{meta.title}</p>
                  <p className="font-semibold">{meta.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Tabs Content */}
      <div className="container mx-auto px-4 pb-16">
        <Tabs defaultValue="members" className="appear-animate" style={{animationDelay: "0.2s"}}>
          <TabsList className="mb-8 glass dark:glass-dark">
            <TabsTrigger value="members">All Members</TabsTrigger>
            <TabsTrigger value="organizers">Organizers</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Members ({community.memberCount})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizers.map((organizer) => (
                <div key={organizer.id} className="slide-up-animate" style={{animationDelay: `${parseInt(organizer.id) * 0.1}s`}}>
                  <MemberCard 
                    member={organizer}
                    onClick={handleMemberClick}
                  />
                </div>
              ))}
              
              {members.map((member) => (
                <div key={member.id} className="slide-up-animate" style={{animationDelay: `${parseInt(member.id) * 0.1}s`}}>
                  <MemberCard 
                    member={member}
                    onClick={handleMemberClick}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="organizers" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Organizers ({organizers.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizers.map((organizer) => (
                <div key={organizer.id} className="slide-up-animate" style={{animationDelay: `${parseInt(organizer.id) * 0.1}s`}}>
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
      </div>
      
      {/* Member Modal */}
      <MemberModal
        member={selectedMember}
        open={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default CommunityProfile;
