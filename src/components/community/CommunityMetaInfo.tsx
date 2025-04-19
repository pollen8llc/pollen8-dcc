import { Card, CardContent } from "@/components/ui/card";
import { 
  User, FileText, Layers, MapPin, Calendar, Users, 
  LayoutList, Clock, Link as LinkIcon, Mail,
  Instagram, Twitter, Facebook, Linkedin, MessageSquare, Info
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

  console.log("Community data:", community); // Debug log

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
      value: community.communityType?.charAt(0).toUpperCase() + community.communityType?.slice(1) || "Not specified"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Location",
      value: community.location || "Remote"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Start Date",
      value: formatDate(community.launchDate || null)
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Target Audience",
      value: Array.isArray(community.targetAudience) 
        ? community.targetAudience.join(", ") 
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
      value: community.eventFrequency?.replace("_", " ").charAt(0).toUpperCase() + 
        community.eventFrequency?.slice(1) || "Not specified"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Size",
      value: `${community.memberCount || 0} members`
    }
  ];

  const extractPlatforms = () => {
    if (!community.communication_platforms) return [];
    
    // Handle both object and array formats
    if (Array.isArray(community.communication_platforms)) {
      return community.communication_platforms;
    }
    
    return Object.keys(community.communication_platforms);
  };

  const extractSocialMedia = () => {
    if (!community.socialMedia) return [];
    
    // Try the socialMedia property first
    let socialLinks = community.socialMedia;
    
    // If not found, try social_media from database
    if (!socialLinks && community.social_media) {
      socialLinks = community.social_media;
    }
    
    if (!socialLinks) return [];

    return Object.entries(socialLinks)
      .filter(([_, value]) => {
        if (typeof value === 'string') return value;
        return value?.url;
      })
      .map(([platform, value]) => ({
        platform,
        url: typeof value === 'string' ? value : value?.url
      }));
  };

  const platforms = extractPlatforms();
  const socialMedia = extractSocialMedia();

  return (
    <div className="container mx-auto px-4 mb-12">
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

      <Card className="glass dark:glass-dark">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Platforms
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.length > 0 ? (
                platforms.map((platform) => (
                  <span key={platform} className="text-muted-foreground">
                    {typeof platform === 'string' 
                      ? platform.charAt(0).toUpperCase() + platform.slice(1)
                      : 'Unknown Platform'}
                  </span>
                ))
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground col-span-full">
                  <Info className="h-4 w-4" />
                  <span>No platforms specified</span>
                </div>
              )}
            </div>
            <Separator className="my-4" />
          </div>

          <div className="space-y-3">
            <div>
              {community.website ? (
                <a 
                  href={community.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  Website / Landing Page
                </a>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LinkIcon className="h-4 w-4" />
                  <span>No website specified</span>
                </div>
              )}
            </div>
            
            <div>
              {community.newsletterUrl ? (
                <a 
                  href={community.newsletterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Newsletter
                </a>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>No newsletter available</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Social Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {socialMedia.length > 0 ? (
                socialMedia.map(({ platform, url }) => {
                  let Icon;
                  switch(platform.toLowerCase()) {
                    case 'twitter':
                      Icon = Twitter;
                      break;
                    case 'instagram':
                      Icon = Instagram;
                      break;
                    case 'facebook':
                      Icon = Facebook;
                      break;
                    case 'linkedin':
                      Icon = Linkedin;
                      break;
                    default:
                      Icon = LinkIcon;
                  }

                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  );
                })
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground col-span-full">
                  <Info className="h-4 w-4" />
                  <span>No social media links available</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityMetaInfo;
