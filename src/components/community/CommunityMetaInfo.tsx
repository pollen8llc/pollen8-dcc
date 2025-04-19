
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Globe, Target, Layout, Clock, Link as LinkIcon, MessageSquare, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as communityService from "@/services/communityService";
import { format } from "date-fns";

interface MetaItem {
  icon: React.ReactNode;
  title: string;
  value: string | number | null;
}

interface CommunityMetaInfoProps {
  communityId: string;
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMMM yyyy");
  } catch {
    return "Not specified";
  }
};

const CommunityMetaInfo = ({ communityId }: CommunityMetaInfoProps) => {
  const { data: community } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId),
    enabled: !!communityId
  });

  if (!community) return null;

  const communityMeta: MetaItem[] = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Size",
      value: `${community.memberCount || 0} members`
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Location",
      value: community.location || "Remote"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Started",
      value: formatDate(community.createdAt || "")
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Target Audience",
      value: community.targetAudience || "Not specified"
    },
    {
      icon: <Layout className="h-5 w-5" />,
      title: "Format",
      value: community.format?.toUpperCase() || "Hybrid"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Event Frequency",
      value: community.eventFrequency?.replace("_", " ") || "Not specified"
    },
    {
      icon: <LinkIcon className="h-5 w-5" />,
      title: "Website",
      value: community.website || "Not specified"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Main Platform",
      value: community.primaryPlatforms ? community.primaryPlatforms[0]?.charAt(0).toUpperCase() + community.primaryPlatforms[0]?.slice(1) : "Not specified"
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      title: "Social Media",
      value: community.socialMedia ? Object.keys(community.socialMedia).length + " platforms" : "Not specified"
    }
  ];

  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 appear-animate">
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
