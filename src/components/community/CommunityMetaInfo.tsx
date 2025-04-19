
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Globe, Target, Layout, Clock, Link as LinkIcon, MessageSquare, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as communityService from "@/services/communityService";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

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

  const basicInfo: MetaItem[] = [
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
      value: Array.isArray(community.targetAudience) 
        ? community.targetAudience.join(", ") 
        : (community.targetAudience || "Not specified")
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
    }
  ];

  const onlinePresence = {
    websites: [
      { title: "Website", value: community.website },
      { title: "Newsletter", value: community.newsletterUrl }
    ].filter(item => item.value),
    
    platforms: Array.isArray(community.primaryPlatforms) ? community.primaryPlatforms.map(platform => ({
      title: platform.charAt(0).toUpperCase() + platform.slice(1),
      value: platform
    })) : [],
    
    socialMedia: community.socialMedia ? Object.entries(community.socialMedia).map(([platform, url]) => ({
      title: platform.charAt(0).toUpperCase() + platform.slice(1),
      value: url
    })) : []
  };

  return (
    <div className="container mx-auto px-4 mb-12 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 appear-animate">
        {basicInfo.map((meta, index) => (
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

      {/* Online Presence Section */}
      {(onlinePresence.websites.length > 0 || 
        onlinePresence.platforms.length > 0 || 
        onlinePresence.socialMedia.length > 0) && (
        <Card className="glass dark:glass-dark rounded-xl overflow-hidden border-b-2 border-aquamarine">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-4">Online Presence</h3>
            
            {onlinePresence.websites.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Websites</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {onlinePresence.websites.map((site, index) => (
                    <a
                      key={index}
                      href={site.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {site.title}
                    </a>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}
            
            {onlinePresence.platforms.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Community Platforms</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {onlinePresence.platforms.map((platform, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      {platform.title}
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}
            
            {onlinePresence.socialMedia.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Social Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {onlinePresence.socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      {social.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityMetaInfo;
