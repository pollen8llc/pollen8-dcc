
import { User, UserRole } from "@/models/types";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MemberCardProps {
  member: User;
  role?: string; // Added to support role designation
  communityId?: string; // Added optional communityId
  onClick?: (member: User) => void;
}

const MemberCard = ({ member, role, communityId, onClick }: MemberCardProps) => {
  const getBadgeColorClass = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-[#00eada] text-black";
      case UserRole.ORGANIZER:
        return "bg-[#00eada]/80 text-black";
      case UserRole.MEMBER:
        return "bg-green-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick(member);
  };
  
  // Safely check if tags exist and have items
  const hasTags = member && 'tags' in member && Array.isArray((member as any).tags) && (member as any).tags.length > 0;
  
  // Check if the user is an admin
  const isAdmin = member.role === UserRole.ADMIN;

  return (
    <div 
      className={`rounded-xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 
                shadow-lg hover:shadow-[#00eada]/10 hover:border-[#00eada]/20 
                cursor-pointer transition-all duration-300 h-[180px] ${isAdmin ? 'admin-profile-border' : ''}`}
      onClick={handleCardClick}
    >
      <div className="w-full h-1 bg-[#00eada]"></div>
      <div className="flex flex-col p-4 h-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-white">{member.name}</h3>
            <Badge className={`mt-1 ${getBadgeColorClass(member.role)}`}>
              {role || UserRole[member.role]}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={`Email ${member.name}`}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${member.email}`;
            }}
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="mt-3 text-sm text-white/70 line-clamp-3 flex-grow">
          {member.bio || "No bio available"}
        </p>
        
        {hasTags && (
          <div className="mt-auto pt-2 border-t border-white/5">
            <div className="flex flex-wrap gap-1">
              {(member as any).tags.slice(0, 2).map((tag: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30">
                  {tag}
                </Badge>
              ))}
              {(member as any).tags.length > 2 && (
                <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                  +{(member as any).tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
