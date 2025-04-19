import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Globe, Target, Layout, Clock, Link as LinkIcon, MessageSquare, Share2, Video, Mail, Bell } from "lucide-react";
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

interface SocialMediaLink {
  title: string;
  value: string;
}

interface PlatformLink {
  name: string;
  url?: string;
  details?: string;
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

  // Format the online presence data
  const onlinePresence = {
    websites: [
      { title: "Website", value: community.website },
      { title: "Newsletter", value: community.newsletterUrl }
    ].filter(item => item.value),
    
    socialMedia: community.socialMedia && typeof community.socialMedia === 'object' 
      ? Object.entries(community.socialMedia).map(([platform, url]) => {
          if (typeof url === 'string') {
            return {
              title: platform.charAt(0).toUpperCase() + platform.slice(1),
              value: url
            };
          } else if (url && typeof url === 'object' && 'url' in url) {
            return {
              title: platform.charAt(0).toUpperCase() + platform.slice(1),
              value: url.url || ''
            };
          }
          return null;
        }).filter(item => item !== null) as SocialMediaLink[]
      : [],

    eventPlatforms: community.event_platforms 
      ? Object.entries(community.event_platforms).map(([name, details]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          ...(typeof details === 'string' ? { url: details } : details)
        })) 
      : [],

    communicationPlatforms: community.communication_platforms 
      ? Object.entries(community.communication_platforms).map(([name, details]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          ...(typeof details === 'string' ? { url: details } : details)
        }))
      : [],

    notificationPlatforms: community.notification_platforms 
      ? Object.entries(community.notification_platforms).map(([name, details]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          ...(typeof details === 'string' ? { url: details } : details)
        }))
      : []
  };

  const platformCategories = [
    {
      title: "Event Platforms",
      icon: <Video className="h-4 w-4" />,
      platforms: onlinePresence.eventPlatforms
    },
    {
      title: "Communication Platforms",
      icon: <MessageSquare className="h-4 w-4" />,
      platforms: onlinePresence.communicationPlatforms
    },
    {
      title: "Notification Channels",
      icon: <Bell className="h-4 w-4" />,
      platforms: onlinePresence.notificationPlatforms
    }
  ];

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
        onlinePresence.socialMedia.length > 0 || 
        platformCategories.some(cat => cat.platforms.length > 0)) && (
        <Card className="glass dark:glass-dark rounded-xl overflow-hidden border-b-2 border-aquamarine">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-4">Online Presence</h3>
            
            {/* Websites Section */}
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
            
            {/* Social Media Section */}
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
                <Separator className="my-4" />
              </div>
            )}

            {/* Platform Categories */}
            {platformCategories.map((category, idx) => (
              category.platforms.length > 0 && (
                <div key={idx} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.platforms.map((platform, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-sm">
                        {platform.url ? (
                          <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            <LinkIcon className="h-4 w-4" />
                            {platform.name}
                          </a>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4" />
                            {platform.name}
                          </>
                        )}
                        {platform.details && (
                          <span className="text-muted-foreground">({platform.details})</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {idx < platformCategories.length - 1 && category.platforms.length > 0 && (
                    <Separator className="my-4" />
                  )}
                </div>
              )
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityMetaInfo;
