
import { Link } from "react-router-dom";
import { MapPin, Users, TrendingUp } from "lucide-react";
import { Community } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memo } from "react";

interface CommunityCardProps {
  community: Community;
}

const GROWTH_STATUS_COLORS = {
  growing: 'bg-green-500',
  recruiting: 'bg-blue-500', 
  active: 'bg-primary',
  paused: 'bg-yellow-500'
} as const;

// Using memo to prevent unnecessary re-renders
const CommunityCard = memo(({ community }: CommunityCardProps) => {
  // Mock organizer data since it's not in the current Community interface
  const organizerName = "Community Organizer";
  const organizerAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&q=80";
  
  // Mock growth status since it's not in current interface
  const growthStatus = 'active';
  const statusColor = GROWTH_STATUS_COLORS[growthStatus as keyof typeof GROWTH_STATUS_COLORS] || 'bg-gray-500';

  return (
    <Link
      to={`/eco8/community/${community.id}`}
      className="group relative h-full w-full animate-fade-in"
    >
      <div className="relative h-full overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
        {/* Banner Section */}
        <div className="relative h-32 bg-cover bg-center" style={{ backgroundImage: `url(${community.imageUrl}?w=800&q=80)` }}>
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className={`${statusColor} text-white text-xs font-medium px-2 py-1 rounded-full border-0`}>
              {growthStatus.charAt(0).toUpperCase() + growthStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 space-y-3">
          {/* Header Section */}
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-xl border border-border bg-background overflow-hidden flex-shrink-0">
              <img 
                src={`${community.imageUrl}?w=100&q=80`} 
                alt={`${community.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {community.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {community.tags[0] || 'Community'}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {community.description}
          </p>

          {/* Organizer Section */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={organizerAvatar} alt={organizerName} />
              <AvatarFallback className="text-xs">CO</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              by {organizerName}
            </span>
          </div>

          {/* Stats Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-border/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {community.communitySize}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate max-w-20">
                  {community.location}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground capitalize">
                {growthStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Set display name for debugging
CommunityCard.displayName = "CommunityCard";

export default CommunityCard;
