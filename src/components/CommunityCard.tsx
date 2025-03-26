import { Link } from "react-router-dom";
import { Users, MapPin } from "lucide-react";
import { Community } from "@/data/types";
import { Badge } from "@/components/ui/badge";

interface CommunityCardProps {
  community: Community;
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  // Only show first two tags
  const displayTags = community.tags.slice(0, 2);
  
  // Simplify the location display to just state code or "Remote"/"Global"
  const simplifiedLocation = () => {
    const location = community.location.trim();
    if (location.toLowerCase() === "remote" || location.toLowerCase() === "global") {
      return location;
    }
    
    // Check if there's a comma indicating city, state format
    if (location.includes(",")) {
      const parts = location.split(",");
      return parts[parts.length - 1].trim(); // Return just the state part
    }
    
    // If it's short (likely already a state code), return as is
    if (location.length <= 3) {
      return location;
    }
    
    // Otherwise return first 3 chars as abbreviation
    return location.substring(0, 3);
  };
  
  return (
    <Link
      to={`/community/${community.id}`}
      className="group relative h-full w-full"
    >
      <div className="relative h-full overflow-hidden rounded-xl glass dark:glass-dark border border-border/40 transition-all duration-300 group-hover:shadow-md transform group-hover:translate-y-[-4px] p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{community.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
          {community.description}
        </p>
        
        <div className="mt-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">{community.memberCount}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{simplifiedLocation()}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {displayTags.map((tag) => (
              <Badge
                key={tag}
                className="bg-aquamarine/80 text-primary-foreground text-xs font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
