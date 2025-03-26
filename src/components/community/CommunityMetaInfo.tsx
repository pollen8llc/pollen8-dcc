
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Target, Activity, Code, Award, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import { getCommunityById } from "@/data/dataUtils";

interface MetaItem {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const CommunityMetaInfo = () => {
  const { id } = useParams<{ id: string }>();
  const community = getCommunityById(id || "");
  
  // Define different meta information based on community ID
  let communityMeta: MetaItem[] = [];
  
  if (id === "7") { // Humanize HQ
    communityMeta = [
      { 
        icon: <MessageSquare className="h-5 w-5" />, 
        title: "Mission and Purpose", 
        value: "Supporting early-stage founders, emphasizing the human element of entrepreneurship" 
      },
      { 
        icon: <Users className="h-5 w-5" />, 
        title: "Community Size", 
        value: "67 members" 
      },
      { 
        icon: <Award className="h-5 w-5" />, 
        title: "Current Following", 
        value: "67 LinkedIn followers" 
      },
      { 
        icon: <Activity className="h-5 w-5" />, 
        title: "Event Turnout", 
        value: "30-50 attendees" 
      },
      { 
        icon: <Calendar className="h-5 w-5" />, 
        title: "Events Organized", 
        value: "Curated conversations and panels" 
      },
      { 
        icon: <MessageSquare className="h-5 w-5" />, 
        title: "Event Formats", 
        value: "Invitation-based, purposefully curated" 
      },
      { 
        icon: <Target className="h-5 w-5" />, 
        title: "Target Audience", 
        value: "Early-stage founders without established networks" 
      },
      { 
        icon: <Code className="h-5 w-5" />, 
        title: "Tech Stack", 
        value: "Luma, Notion, LinkedIn" 
      }
    ];
  } else {
    // Default meta information for other communities
    communityMeta = [
      { icon: <MessageSquare className="h-5 w-5" />, title: "Mission and Purpose", value: "Supporting founders" },
      { icon: <Users className="h-5 w-5" />, title: "Community Size", value: community?.memberCount + "+ members" },
      { icon: <Award className="h-5 w-5" />, title: "Current Following", value: "350+ followers" },
      { icon: <Activity className="h-5 w-5" />, title: "Event Turnout", value: "30-50 attendees" },
      { icon: <Calendar className="h-5 w-5" />, title: "Events Organized", value: "12 this year" },
      { icon: <MessageSquare className="h-5 w-5" />, title: "Event Formats", value: "Workshops, Fireside Chats" },
      { icon: <Target className="h-5 w-5" />, title: "Target Audience", value: "Early-stage founders" },
      { icon: <Code className="h-5 w-5" />, title: "Tech Stack", value: "Discord, Notion, Luma" }
    ];
  }

  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 appear-animate" style={{animationDelay: "0.3s"}}>
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
  );
};

export default CommunityMetaInfo;
