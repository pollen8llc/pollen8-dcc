
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, Layers, MapPin, Calendar, Users, 
  LayoutList, Clock, Link as LinkIcon, Mail,
  MessageSquare, Info
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as communityService from "@/services/communityService";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { SocialMediaLinks } from "./SocialMediaLinks";
import { PlatformsList } from "./PlatformsList";

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
      title: "Members",
      value: `${community.communitySize || 0} members`
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Target Size",
      value: community.size_demographics || "Not specified"
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
      icon: <LinkIcon className="h-5 w-5" />,
      title: "Website",
      value: community.website || "Not specified",
      isLink: true
    }
  ];

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
                <p className="text-base text-muted-foreground break-words">
                  {info.title === "Website" && info.value !== "Not specified" ? (
                    <a 
                      href={info.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    info.value
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass dark:glass-dark">
        <CardContent className="p-6 space-y-6">
          {/* Platforms */}
          <PlatformsList platforms={community.communication_platforms} />
          <Separator className="my-4" />

          {/* Newsletter */}
          <div className="space-y-3">
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
          
          {/* Social Media */}
          <SocialMediaLinks socialMedia={community.socialMedia} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityMetaInfo;
