
import { Link } from "react-router-dom";
import { Users, MapPin } from "lucide-react";
import { Community } from "@/models/types";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect, useState } from "react";
import { getRandomBanner } from "@/utils/defaultBanners";

interface CommunityCardProps {
  community: Community;
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  const [displayTagCount, setDisplayTagCount] = useState(2);
  const tagContainerRef = useRef<HTMLDivElement>(null);
  const [banner, setBanner] = useState(getRandomBanner());
  
  useEffect(() => {
    const checkTagOverflow = () => {
      const container = tagContainerRef.current;
      if (!container || community.tags.length === 0) return;
      
      setDisplayTagCount(2);
      
      const firstTagHeight = container.firstElementChild?.getBoundingClientRect().height || 0;
      const containerHeight = container.getBoundingClientRect().height;
      
      if (containerHeight > firstTagHeight * 1.5 && community.tags.length > 1) {
        setDisplayTagCount(1);
      }
    };
    
    checkTagOverflow();
    window.addEventListener('resize', checkTagOverflow);
    return () => window.removeEventListener('resize', checkTagOverflow);
  }, [community.tags]);
  
  const displayTags = community.tags.slice(0, displayTagCount);
  
  const simplifiedLocation = () => {
    const location = community.location.trim();
    if (location.toLowerCase() === "remote" || location.toLowerCase() === "global") {
      return location;
    }
    
    if (location.includes(",")) {
      const parts = location.split(",");
      return parts[parts.length - 1].trim();
    }
    
    if (location.length <= 3) return location;
    return location.substring(0, 3);
  };
  
  return (
    <Link
      to={`/community/${community.id}`}
      className="group relative h-full w-full"
    >
      <div className="relative h-full overflow-hidden rounded-xl bg-card border border-border/40 transition-all duration-300 group-hover:shadow-md transform group-hover:-translate-y-1">
        {/* Banner Image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={community.imageUrl || banner.url}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white line-clamp-1 drop-shadow-sm">
              {community.name}
            </h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {community.description}
          </p>
          
          <div className="mt-4 space-y-3">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{community.communitySize}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{simplifiedLocation()}</span>
              </div>
            </div>
            
            {/* Tags */}
            <div ref={tagContainerRef} className="flex flex-wrap gap-1.5">
              {displayTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-primary/5 text-primary text-xs font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {community.tags.length > displayTagCount && (
                <span className="text-xs text-muted-foreground">
                  +{community.tags.length - displayTagCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
