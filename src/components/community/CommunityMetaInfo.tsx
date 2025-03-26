
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
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
  
  // Reduced to only show two key meta items
  const communityMeta: MetaItem[] = [
    { icon: <Users className="h-5 w-5" />, title: "Community Size", value: community?.memberCount + "+ members" },
    { icon: <Calendar className="h-5 w-5" />, title: "Events Organized", value: "12 this year" }
  ];

  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 appear-animate" style={{animationDelay: "0.3s"}}>
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
