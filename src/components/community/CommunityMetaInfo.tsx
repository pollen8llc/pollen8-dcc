
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Calendar, Code, Layers, Megaphone, Target, Users } from "lucide-react";

interface MetaItem {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const CommunityMetaInfo = () => {
  // Meta information for the community
  const communityMeta: MetaItem[] = [
    { icon: <Target className="h-5 w-5" />, title: "Mission and Purpose", value: "Connect tech professionals" },
    { icon: <Users className="h-5 w-5" />, title: "Community Size", value: "2,500+ members" },
    { icon: <BarChart className="h-5 w-5" />, title: "Current Following", value: "2,450+" },
    { icon: <Calendar className="h-5 w-5" />, title: "Event Turnout", value: "25-40 attendees" },
    { icon: <Megaphone className="h-5 w-5" />, title: "Events Organized", value: "12 this year" },
    { icon: <Layers className="h-5 w-5" />, title: "Event Formats", value: "Workshops & Meetups" },
    { icon: <Target className="h-5 w-5" />, title: "Target Audience", value: "Tech professionals" },
    { icon: <Code className="h-5 w-5" />, title: "Tech Stack", value: "Discord, Notion, Luma" },
  ];

  return (
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
  );
};

export default CommunityMetaInfo;
