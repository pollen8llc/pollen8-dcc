
import { Link } from "react-router-dom";
import { Users, MapPin } from "lucide-react";
import { Community } from "@/data/types";
import { Badge } from "@/components/ui/badge";

interface CommunityCardProps {
  community: Community;
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  return (
    <Link
      to={`/community/${community.id}`}
      className="group relative h-full"
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
              <span className="text-sm">{community.memberCount} members</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{community.location}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {community.tags.map((tag) => (
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
