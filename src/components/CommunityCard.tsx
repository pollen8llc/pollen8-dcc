
import { Link } from "react-router-dom";
import { User, Users } from "lucide-react";
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
      <div className="relative h-full overflow-hidden rounded-xl glass dark:glass-dark border border-border/40 transition-all duration-300 group-hover:shadow-md transform group-hover:translate-y-[-4px]">
        <div className="relative h-40 overflow-hidden rounded-t-xl">
          <img
            src={community.imageUrl}
            alt={community.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent dark:from-background/80"></div>
          <div className="absolute bottom-2 left-4 flex space-x-1">
            {community.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                className="bg-aquamarine/80 text-primary-foreground text-xs font-medium"
              >
                {tag}
              </Badge>
            ))}
            {community.tags.length > 2 && (
              <Badge className="bg-muted/80 text-muted-foreground text-xs font-medium">
                +{community.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{community.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {community.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">{community.memberCount}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm">{community.organizerIds.length}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {community.location}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
