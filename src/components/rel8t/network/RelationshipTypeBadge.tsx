import { relationshipTypes } from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";
import { 
  Users, Brain, Palette, Network, GraduationCap, 
  Sprout, Star, Briefcase, Sparkles 
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Brain,
  Palette,
  Network,
  GraduationCap,
  Sprout,
  Star,
  Briefcase,
  Sparkles,
};

interface RelationshipTypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RelationshipTypeBadge({ 
  type, 
  size = 'md',
  showLabel = true 
}: RelationshipTypeBadgeProps) {
  const typeData = relationshipTypes.find(t => t.id === type);
  
  if (!typeData) return null;

  const Icon = iconMap[typeData.icon] || Users;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size]
      )}
      style={{ 
        backgroundColor: `${typeData.color}20`,
        color: typeData.color
      }}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{typeData.label}</span>}
    </span>
  );
}
