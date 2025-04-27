
import { Link } from "react-router-dom";
import { Community } from "@/models/types";
import { ExternalLink, MapPin, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlexusBackground from "./PlexusBackground";

interface CommunityHeaderProps {
  community: Community;
}

const CommunityHeader = ({ community }: CommunityHeaderProps) => {
  // Extract tags from targetAudience array
  const displayTags = community.target_audience || [];

  return (
    <div className="relative">
      <div className="h-56 sm:h-64 md:h-80 relative overflow-hidden">
        {community.logo_url ? (
          <img
            src={community.logo_url}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <PlexusBackground />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 sm:-mt-32 mb-12 appear-animate">
          <div className="glass dark:glass-dark rounded-xl p-6 sm:p-8 border border-border/40 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{community.name}</h1>
                <div className="flex flex-wrap items-center mt-3 gap-3">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{community.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{community.member_count || "0"} member{community.member_count !== "1" ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                <Button className="bg-aquamarine text-primary-foreground hover:bg-aquamarine/90 shadow-sm">
                  Connect
                </Button>
                {community.website && (
                  <a href={community.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </a>
                )}
              </div>
            </div>
            
            <p className="mt-6 text-lg">{community.description}</p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {displayTags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-muted text-muted-foreground flex items-center"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
