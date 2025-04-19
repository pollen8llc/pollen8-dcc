
import { Link } from "react-router-dom";
import { Users, MapPin, Calendar, Globe2 } from "lucide-react";
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
  
  return (
    <Link
      to={`/community/${community.id}`}
      className="group relative h-full w-full"
    >
      <div className="relative h-full overflow-hidden rounded-xl bg-card border border-border/40 transition-all duration-300 group-hover:shadow-md transform group-hover:-translate-y-1">
        {/* Header */}
        <div className="p-4 border-b border-border/40">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {community.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {community.description}
          </p>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Key Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{community.communitySize} members</span>
            </div>
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <Globe2 className="h-4 w-4" />
              <span>{community.format || 'Mixed'}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{community.eventFrequency || 'Flexible'}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate" title={community.location}>
                {community.location}
              </span>
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
    </Link>
  );
};

export default CommunityCard;

