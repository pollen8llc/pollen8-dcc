
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, Layers, MapPin, Calendar, Users, 
  Link as LinkIcon, Mail, MessageSquare 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as communityService from "@/services/communityService";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { SocialMediaLinks } from "./SocialMediaLinks";
import { Skeleton } from "@/components/ui/skeleton";

interface CommunityMetaInfoProps {
  communityId: string;
}

const CommunityMetaInfo = ({ communityId }: CommunityMetaInfoProps) => {
  const { data: community, isLoading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId),
    enabled: !!communityId
  });

  if (isLoading) {
    return <Skeleton className="w-full h-48" />;
  }

  if (!community) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  interface InfoItem {
    icon: JSX.Element;
    title: string;
    value: string;
  }

  const basicInfo: InfoItem[] = [
    {
      icon: <User className="h-5 w-5" />,
      title: "Founder",
      value: community.founder_name || "Not specified"
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Community Type",
      value: community.type || "Not specified"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Location",
      value: community.location || "Remote"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Created",
      value: formatDate(community.created_at)
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Current Size",
      value: `${community.member_count || 0} members`
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Format",
      value: community.format?.charAt(0).toUpperCase() + community.format?.slice(1) || "Not specified"
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
                  {info.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Details */}
      <Card className="glass dark:glass-dark">
        <CardContent className="p-6 space-y-6">
          {/* Target Audience */}
          {community.target_audience && community.target_audience.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Target Audience</h3>
                <div className="flex flex-wrap gap-2">
                  {community.target_audience.map((audience, index) => (
                    <span key={index} className="px-3 py-1 bg-muted rounded-full text-sm">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Newsletter */}
          {community.newsletter_url && (
            <>
              <div>
                <a 
                  href={community.newsletter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Subscribe to Newsletter
                </a>
              </div>
              <Separator className="my-4" />
            </>
          )}
          
          {/* Social Media */}
          {community.social_media && Object.keys(community.social_media).length > 0 && (
            <SocialMediaLinks socialMedia={community.social_media} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityMetaInfo;
