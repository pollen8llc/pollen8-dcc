
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, FileText, Layers, MapPin, Calendar, Users, 
  LayoutList, Clock, Link as LinkIcon, Mail,
  Instagram, Twitter, Facebook, Linkedin, MessageSquare
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as communityService from "@/services/communityService";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface CommunityMetaInfoProps {
  communityId: string;
}

const CommunityMetaInfo = ({ communityId }: CommunityMetaInfoProps) => {
  const { data: community } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId),
    enabled: !!communityId
  });

  if (!community) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const basicInfo = [
    {
      icon: <User className="h-5 w-5" />,
      title: "Community Name",
      value: community.name
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Description",
      value: community.description
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Community Type",
      value: community.community_type?.charAt(0).toUpperCase() + community.community_type?.slice(1) || "Not specified"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Location",
      value: community.location || "Remote"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Start Date",
      value: formatDate(community.start_date)
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Target Audience",
      value: Array.isArray(community.target_audience) 
        ? community.target_audience.join(", ") 
        : "Not specified"
    },
    {
      icon: <LayoutList className="h-5 w-5" />,
      title: "Format",
      value: community.format?.toUpperCase() || "Not specified"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Event Frequency",
      value: community.event_frequency?.replace("_", " ").charAt(0).toUpperCase() + 
        community.event_frequency?.slice(1) || "Not specified"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Size",
      value: `${community.member_count || 0} members`
    }
  ];

  const platforms = community.communication_platforms && typeof community.communication_platforms === 'object'
    ? Object.keys(community.communication_platforms)
    : [];

  const socialMedia = community.social_media && typeof community.social_media === 'object'
    ? Object.entries(community.social_media).filter(([_, url]) => url)
    : [];

  return (
    <div className="container mx-auto px-4 mb-12">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {basicInfo.map((info, index) => (
          <Card key={index} className="glass dark:glass-dark">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="bg-muted/50 rounded-full p-2 text-foreground mt-1 flex-shrink-0">
                {info.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{info.title}</p>
                <p className="text-base text-muted-foreground break-words">{info.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Online Presence */}
      <Card className="glass dark:glass-dark">
        <CardContent className="p-6 space-y-6">
          {/* Platforms */}
          {platforms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Platforms
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platforms.map((platform) => (
                  <span key={platform} className="text-muted-foreground">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Website and Newsletter */}
          <div className="space-y-3">
            {community.website && (
              <a 
                href={community.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <LinkIcon className="h-4 w-4" />
                Website / Landing Page
              </a>
            )}
            
            {community.newsletter_url && (
              <a 
                href={community.newsletter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                Newsletter
              </a>
            )}
          </div>

          {/* Social Media */}
          {socialMedia.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Social Media</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {socialMedia.map(([platform, url]) => {
                    const Icon = {
                      twitter: Twitter,
                      instagram: Instagram,
                      facebook: Facebook,
                      linkedin: Linkedin
                    }[platform.toLowerCase()] || LinkIcon;

                    return (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityMetaInfo;
