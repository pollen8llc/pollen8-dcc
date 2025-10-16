import { Link } from "react-router-dom";
import { MapPin, Users, TrendingUp } from "lucide-react";
import { Community } from "@/hooks/useCommunities";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { memo, useState, useEffect } from "react";
import { useProfiles } from "@/hooks/useProfiles";
import { ExtendedProfile } from "@/services/profileService";

interface CompactCommunityCardProps {
  community: Community;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}

const GROWTH_STATUS_COLORS = {
  growing: 'bg-green-500',
  recruiting: 'bg-blue-500', 
  active: 'bg-primary',
  paused: 'bg-yellow-500'
} as const;

// Compact version of CommunityCard without the banner header
const CompactCommunityCard = memo(({ 
  community, 
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection 
}: CompactCommunityCardProps) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community.owner_id]);
  
  // Fallback data
  const organizerName = organizer 
    ? `${organizer.first_name} ${organizer.last_name}`.trim() || organizer.email || "Community Organizer"
    : "Community Organizer";
  
  // Mock growth status since it's not in current interface
  const growthStatus = 'active';
  const statusColor = GROWTH_STATUS_COLORS[growthStatus as keyof typeof GROWTH_STATUS_COLORS] || 'bg-gray-500';

  const handleClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.preventDefault();
      onToggleSelection?.(community.id);
    }
  };

  const CardContent = (
    <div 
      className={`relative h-full overflow-hidden rounded-2xl bg-card border transition-all duration-300 ${
        isSelected 
          ? 'border-primary/60 bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]' 
          : 'border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
      } ${isSelectionMode ? 'cursor-pointer' : 'group hover:scale-[1.02]'}`}
      onClick={handleClick}
    >
      {/* Content Container - No banner section */}
      <div className="p-4 space-y-3">
        {/* First Section: Logo, Title, Location */}
        <div className="flex items-start space-x-3">
          {isSelectionMode && (
            <div className="pt-0.5 flex-shrink-0">
              <Checkbox 
                checked={isSelected}
                onCheckedChange={() => onToggleSelection?.(community.id)}
                className="h-5 w-5"
              />
            </div>
          )}
          <div className="w-12 h-12 rounded-xl bg-black/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            {community.logo_url ? (
              <img 
                src={community.logo_url} 
                alt={community.name} 
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
              {community.name}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {community.location}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Section: Interest Category Badges */}
        <div className="flex flex-wrap gap-1.5 py-2">
          {(community.tags || []).slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-0"
            >
              {tag}
            </Badge>
          ))}
          {(community.tags || []).length > 3 && (
            <Badge 
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground border-0"
            >
              +{(community.tags || []).length - 3}
            </Badge>
          )}
        </div>

        {/* Bottom Section: Owner Info and Activity */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <Avatar 
              userId={community.owner_id}
              size={28} 
              className="w-7 h-7"
            />
            <span className="text-sm text-muted-foreground truncate">
              {organizerName}
            </span>
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
  );

  if (isSelectionMode) {
    return CardContent;
  }

  return (
    <Link
      to={`/eco8/community/${community.id}`}
      className="h-full w-full animate-fade-in"
    >
      {CardContent}
    </Link>
  );
});

// Set display name for debugging
CompactCommunityCard.displayName = "CompactCommunityCard";

export default CompactCommunityCard;
