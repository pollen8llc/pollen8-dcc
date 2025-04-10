import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Activity, Code, MessageSquare, Link } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as communityService from "@/services/communityService";

interface MetaItem {
  icon: React.ReactNode;
  title: string;
  value: string;
}

interface CommunityMetaInfoProps {
  communityId: string;
}

const CommunityMetaInfo = ({ communityId }: CommunityMetaInfoProps) => {
  const { data: community } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId),
    enabled: !!communityId
  });
  
  // Define different meta information based on community ID
  let communityMeta: MetaItem[] = [];
  
  if (communityId === "10") { // NIN (Nigerians in New York)
    communityMeta = [
      { 
        icon: <Users className="h-5 w-5" />, 
        title: "Community Size", 
        value: "700+ members" 
      },
      { 
        icon: <Activity className="h-5 w-5" />, 
        title: "Event Turnout", 
        value: "Various sizes based on event type" 
      },
      { 
        icon: <Calendar className="h-5 w-5" />, 
        title: "Event Formats", 
        value: "Professional panels, Demo Days, Day parties, Sports events, Fitness activities" 
      },
      { 
        icon: <MessageSquare className="h-5 w-5" />, 
        title: "Communication", 
        value: "Main WhatsApp group and interest-based subgroups" 
      },
      { 
        icon: <Code className="h-5 w-5" />, 
        title: "Tech Stack", 
        value: "WhatsApp, Canva Premium, Google Forms, PartiFul" 
      },
      { 
        icon: <Link className="h-5 w-5" />, 
        title: "Subgroups", 
        value: "NIN Jobs, NIN Fitness, NIN Investment" 
      }
    ];
  } else if (communityId === "7") { // Humanize HQ
    communityMeta = [
      { 
        icon: <Users className="h-5 w-5" />, 
        title: "Community Size", 
        value: "67 members" 
      },
      { 
        icon: <Activity className="h-5 w-5" />, 
        title: "Event Turnout", 
        value: "30-50 attendees" 
      },
      { 
        icon: <Calendar className="h-5 w-5" />, 
        title: "Total Events", 
        value: "1" 
      },
      { 
        icon: <MessageSquare className="h-5 w-5" />, 
        title: "Event Formats", 
        value: "Invitation-based, Curated conversations and panels" 
      },
      { 
        icon: <Code className="h-5 w-5" />, 
        title: "Tech Stack", 
        value: "Luma, Notion, LinkedIn" 
      },
      { 
        icon: <Link className="h-5 w-5" />, 
        title: "Communication Channels", 
        value: "Email, Slack, WhatsApp" 
      }
    ];
  } else {
    communityMeta = [
      { icon: <Users className="h-5 w-5" />, title: "Community Size", value: community?.memberCount + "+ members" },
      { icon: <Activity className="h-5 w-5" />, title: "Event Turnout", value: "30-50 attendees" },
      { icon: <Calendar className="h-5 w-5" />, title: "Total Events", value: "12 this year" },
      { icon: <MessageSquare className="h-5 w-5" />, title: "Event Formats", value: "Workshops, Fireside Chats" },
      { icon: <Code className="h-5 w-5" />, title: "Tech Stack", value: "Discord, Notion, Luma" },
      { icon: <Link className="h-5 w-5" />, title: "Communication Channels", value: "Discord, Email, Telegram" }
    ];
  }

  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 appear-animate" style={{animationDelay: "0.3s"}}>
        {communityMeta.map((meta, index) => (
          <Card key={index} className="glass dark:glass-dark rounded-xl overflow-hidden border-b-2 border-aquamarine transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="bg-muted/50 rounded-full p-2 text-foreground mt-1 flex-shrink-0">
                {meta.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{meta.title}</p>
                <p className="text-base text-muted-foreground line-clamp-3">
                  {meta.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityMetaInfo;
