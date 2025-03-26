
import { Link } from "react-router-dom";
import { Users, MapPin } from "lucide-react";
import { Community } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect, useState } from "react";

interface CommunityCardProps {
  community: Community;
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  const [displayTagCount, setDisplayTagCount] = useState(2);
  const tagContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if tags would overflow and adjust count if needed
  useEffect(() => {
    const checkTagOverflow = () => {
      const container = tagContainerRef.current;
      if (!container || community.tags.length === 0) return;
      
      // Reset to show two tags first
      setDisplayTagCount(2);
      
      // Check if tags overflow to a second line
      const firstTagHeight = container.firstElementChild?.getBoundingClientRect().height || 0;
      const containerHeight = container.getBoundingClientRect().height;
      
      // If the container height is greater than a single tag's height (plus a small margin),
      // we have overflow to a second line
      if (containerHeight > firstTagHeight * 1.5 && community.tags.length > 1) {
        setDisplayTagCount(1);
      }
    };
    
    // Check on mount and when window resizes
    checkTagOverflow();
    window.addEventListener('resize', checkTagOverflow);
    return () => window.removeEventListener('resize', checkTagOverflow);
  }, [community.tags]);
  
  // Get tags to display based on calculated count
  const displayTags = community.tags.slice(0, displayTagCount);
  
  // Simplify the location display to just state code or full "Remote"/"Global"
  const simplifiedLocation = () => {
    const location = community.location.trim();
    if (location.toLowerCase() === "remote" || location.toLowerCase() === "global") {
      return location; // Show full word for Remote or Global
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
          
          <div ref={tagContainerRef} className="flex flex-wrap gap-1 mt-2 min-h-[24px]">
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
