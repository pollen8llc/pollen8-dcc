
import { Link } from "react-router-dom";
import { MapPin, Users, TrendingUp } from "lucide-react";
import { Community } from "@/hooks/useCommunities";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { memo, useState, useEffect } from "react";
import { useProfiles } from "@/hooks/useProfiles";
import { ExtendedProfile } from "@/services/profileService";

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
  const { getProfileById } = useProfiles();
  const [organizer, setOrganizer] = useState<ExtendedProfile | null>(null);
  
  // Fetch organizer profile data
  useEffect(() => {
    const fetchOrganizer = async () => {
      if (community.owner_id) {
        try {
          const profile = await getProfileById(community.owner_id);
          setOrganizer(profile);
        } catch (error) {
          console.error('Failed to fetch organizer profile:', error);
        }
      }
    };
    
    fetchOrganizer();
  }, [community.owner_id, getProfileById]);
  
  // Fallback data
  const organizerName = organizer 
    ? `${organizer.first_name} ${organizer.last_name}`.trim() || organizer.email || "Community Organizer"
    : "Community Organizer";
  const organizerAvatar = null; // Simplified avatar system
  
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
        <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
          
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
            <div className="w-12 h-12 rounded-xl bg-black/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {community.name}
              </h3>
              {/* Topic badges */}
              <div className="flex flex-wrap gap-1 mt-1">
                {(community.tags || []).slice(0, 2).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-0"
                  >
                    {tag}
                  </Badge>
                ))}
                {(community.tags || []).length > 2 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground border-0"
                  >
                    +{(community.tags || []).length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Organizer Section */}
          <div className="flex items-center space-x-2">
            <Avatar 
              userId={community.owner_id}
              size={24} 
              className="w-6 h-6"
            />
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
                  {community.community_size || '1'}
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
