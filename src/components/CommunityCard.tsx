
import { Link } from "react-router-dom";
import { MapPin, Globe2, Calendar } from "lucide-react";
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
      <div className="relative h-full overflow-hidden rounded-xl bg-card border border-border/20 transition-all duration-300 hover:shadow-md hover:border-primary/30">
        <div className="p-4 grid grid-cols-12 gap-3 items-center">
          {/* Community Name and Tags */}
          <div className="col-span-3 flex flex-col">
            <h3 className="text-base font-medium text-foreground truncate">
              {community.name}
            </h3>
            <div 
              ref={tagContainerRef} 
              className="flex flex-wrap gap-1 mt-1 items-center"
            >
              {displayTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-primary/5 text-primary text-[10px] font-normal px-1.5 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {community.tags.length > displayTagCount && (
                <span className="text-[10px] text-muted-foreground ml-1">
                  +{community.tags.length - displayTagCount}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="col-span-3 flex items-center space-x-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="text-xs truncate">{community.location}</span>
          </div>

          {/* Format */}
          <div className="col-span-2 flex items-center space-x-1.5 text-muted-foreground">
            <Globe2 className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="text-xs">{community.format || 'Mixed'}</span>
          </div>

          {/* Event Frequency */}
          <div className="col-span-2 flex items-center space-x-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="text-xs">{community.eventFrequency || 'Flexible'}</span>
          </div>

          {/* Last Active */}
          {community.updatedAt && (
            <div className="col-span-2 text-[10px] text-muted-foreground text-right">
              Active: {new Date(community.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
