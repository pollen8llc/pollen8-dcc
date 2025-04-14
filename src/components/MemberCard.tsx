
import { User, UserRole } from "@/models/types";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MemberCardProps {
  member: User;
  onClick: (member: User) => void;
}

const MemberCard = ({ member, onClick }: MemberCardProps) => {
  const getBadgeColorClass = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-500 text-white";
      case UserRole.ORGANIZER:
        return "bg-blue-500 text-white";
      case UserRole.MEMBER:
        return "bg-green-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div 
      className="glass dark:glass-dark rounded-xl overflow-hidden border border-border/40 cursor-pointer transition-all duration-300 hover:shadow-md transform hover:translate-y-[-2px]"
      onClick={() => onClick(member)}
    >
      <div className="flex flex-col sm:flex-row items-center p-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-aquamarine/30 flex-shrink-0 mb-3 sm:mb-0">
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="sm:ml-4 text-center sm:text-left flex-grow">
          <h3 className="font-medium">{member.name}</h3>
          <Badge className={`mt-1 ${getBadgeColorClass(member.role)}`}>
            {UserRole[member.role]}
          </Badge>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {member.bio}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="mt-2 sm:mt-0 ml-0 sm:ml-2"
          aria-label={`Email ${member.name}`}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `mailto:${member.email}`;
          }}
        >
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MemberCard;
