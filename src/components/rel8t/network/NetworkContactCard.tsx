import { Link } from "react-router-dom";
import { MockNetworkContact, getRelationshipType, getConnectionStrength } from "@/data/mockNetworkData";
import { ConnectionStrengthGauge } from "./ConnectionStrengthGauge";
import { RelationshipTypeBadge } from "./RelationshipTypeBadge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, ChevronRight, Target, Clock } from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";

interface NetworkContactCardProps {
  contact: MockNetworkContact;
  viewMode: 'grid' | 'list';
}

export function NetworkContactCard({ contact, viewMode }: NetworkContactCardProps) {
  const relationshipType = getRelationshipType(contact.relationshipType);
  const connectionStrength = getConnectionStrength(contact.connectionStrength);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getInfluenceBadge = (influence: string) => {
    const colors: Record<string, string> = {
      low: 'bg-muted text-muted-foreground',
      medium: 'bg-blue-500/20 text-blue-400',
      high: 'bg-purple-500/20 text-purple-400',
      very_high: 'bg-amber-500/20 text-amber-400'
    };
    const labels: Record<string, string> = {
      low: 'Low Influence',
      medium: 'Medium Influence',
      high: 'High Influence',
      very_high: 'Very High Influence'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs ${colors[influence]}`}>
        {labels[influence]}
      </span>
    );
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/rel8/network/${contact.id}/profile`}>
        <div className="glass-card p-4 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer">
          <Avatar className="h-12 w-12">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{contact.name}</h3>
              <RelationshipTypeBadge type={contact.relationshipType} size="sm" showLabel={false} />
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {contact.role} at {contact.company}
            </p>
          </div>
          
          <div className="hidden md:block w-40">
            <ConnectionStrengthGauge strength={contact.connectionStrength} showLabel={false} size="sm" />
          </div>
          
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {contact.industry}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(parseISO(contact.lastInteraction), { addSuffix: true })}
          </div>
          
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/rel8/network/${contact.id}/profile`}>
      <div className="glass-card p-5 hover:border-primary/30 transition-all cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback className="text-lg">{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <Badge variant="secondary" className="mb-1">
              {contact.industry}
            </Badge>
            <div className="mt-1">
              {getInfluenceBadge(contact.networkInfluence)}
            </div>
          </div>
        </div>

        {/* Name & Role */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg">{contact.name}</h3>
          <p className="text-sm text-muted-foreground">
            {contact.role} at {contact.company}
          </p>
        </div>

        {/* Relationship Type */}
        <div className="mb-3">
          <RelationshipTypeBadge type={contact.relationshipType} size="sm" />
        </div>

        {/* Connection Strength */}
        <div className="mb-4">
          <ConnectionStrengthGauge strength={contact.connectionStrength} size="sm" />
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-sm text-muted-foreground mt-auto">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>{contact.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            <span>{contact.mutualConnections} mutual connections</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last: {formatDistanceToNow(parseISO(contact.lastInteraction), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Strategy Indicator */}
        {contact.strategy && (
          <div className="mt-4 pt-3 border-t border-border/30">
            <div className="flex items-center gap-2 text-xs text-primary">
              <Target className="h-3.5 w-3.5" />
              <span>Strategy: {contact.strategy.intention}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
