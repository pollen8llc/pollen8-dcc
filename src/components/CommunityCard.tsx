
import { Link } from "react-router-dom";
import { MapPin, Globe2, FileText, Circle } from "lucide-react";
import { Community } from "@/models/types";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect, useState } from "react";

interface CommunityCardProps {
  community: Community;
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  const [displayTagCount, setDisplayTagCount] = useState(2);
  const tagContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Determine activity status (you might want to modify this logic based on your specific requirements)
  const isActive = community.updatedAt 
    ? (new Date().getTime() - new Date(community.updatedAt).getTime()) < (30 * 24 * 60 * 60 * 1000) 
    : false;

  return (
    <Link
      to={`/community/${community.id}`}
      className="group relative h-full w-full"
    >
      <div className="relative h-full overflow-hidden rounded-xl bg-card border border-border/40 transition-all duration-300 group-hover:shadow-md transform group-hover:-translate-y-1">
        {/* Activity Indicator */}
        <div className="absolute top-2 right-2 z-10">
          <Circle 
            className={`h-3 w-3 ${isActive ? 'text-green-500' : 'text-muted-foreground'}`} 
            fill={isActive ? '#10B981' : 'transparent'}
          />
        </div>

        {/* Row 1: Name and Tags */}
        <div className="p-3 border-b border-border/40">
          <h3 className="text-base font-semibold text-foreground line-clamp-1">
            {community.name}
          </h3>
          <div ref={tagContainerRef} className="flex flex-wrap gap-1 mt-1.5">
            {displayTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-primary/5 text-primary text-xs font-medium px-2 py-0"
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
        
        {/* Row 2: Description */}
        <div className="p-3 border-b border-border/40">
          <div className="flex items-start space-x-1.5 text-muted-foreground">
            <FileText className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-sm line-clamp-2">{community.description}</p>
          </div>
        </div>
        
        {/* Row 3: Location */}
        <div className="p-3">
          <div className="flex items-center space-x-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="text-sm truncate" title={community.location}>
              {community.location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
