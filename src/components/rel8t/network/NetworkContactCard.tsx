import { Link } from "react-router-dom";
import { Actv8ContactDisplay, useDeactivateContact } from "@/hooks/useActv8Contacts";
import { ConnectionStrengthBar } from "./ConnectionStrengthBar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { relationshipTypes } from "@/services/actv8Service";

interface NetworkContactCardProps {
  contact: Actv8ContactDisplay;
  viewMode: 'grid' | 'list';
}

export function NetworkContactCard({ contact, viewMode }: NetworkContactCardProps) {
  const { deactivate } = useDeactivateContact();
  
  const relationshipType = relationshipTypes.find(rt => rt.id === contact.relationshipType);
  const currentStep = contact.currentStepIndex ?? 0;
  const totalSteps = contact.totalSteps ?? 1;
  const pathProgress = (currentStep / totalSteps) * 100;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatLastInteraction = (dateStr: string) => {
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleDeactivate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Remove ${contact.name} from Actv8?`)) {
      await deactivate(contact.id, contact.name);
    }
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/rel8/actv8/${contact.id}/profile`}>
        <div className="glass-card p-4 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{contact.name}</h3>
              <Badge variant="outline" className="text-[10px]">
                {relationshipType?.label || contact.relationshipType}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {contact.role} at {contact.company}
            </p>
          </div>
          
          <div className="hidden md:block w-32">
            <ConnectionStrengthBar strength={contact.connectionStrength} showLabel={false} size="sm" />
          </div>
          
          <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
            {contact.industry}
          </Badge>
          
          <div className="text-xs text-muted-foreground">
            {formatLastInteraction(contact.lastInteraction)}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={handleDeactivate}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/rel8/actv8/${contact.id}/profile`}>
      <div className="glass-card p-0 hover:border-primary/30 transition-all cursor-pointer h-full flex flex-col group relative">
        {/* Deactivate button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive z-10"
          onClick={handleDeactivate}
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Section 1: Identity */}
        <div className="p-4 flex items-start gap-3 border-b border-border/30">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20 shrink-0">
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{contact.name}</h3>
            <Badge variant="secondary" className="text-[10px] mt-1">
              {contact.industry}
            </Badge>
          </div>
        </div>

        {/* Section 2: Professional */}
        <div className="px-4 py-3 border-b border-border/30">
          <p className="text-sm text-muted-foreground truncate">
            {contact.role}
          </p>
          <p className="text-sm font-medium truncate">
            {contact.company}
          </p>
        </div>

        {/* Section 3: Relationship Type */}
        <div className="px-4 py-3 border-b border-border/30">
          <span className="text-xs text-muted-foreground">Relationship</span>
          <p className="text-sm font-medium mt-0.5">
            {relationshipType?.label || contact.relationshipType || 'Not set'}
          </p>
        </div>

        {/* Section 4: Connection Strength */}
        <div className="px-4 py-3 border-b border-border/30">
          <ConnectionStrengthBar strength={contact.connectionStrength} size="sm" />
        </div>

        {/* Section 5: Development Path */}
        <div className="px-4 py-3 border-b border-border/30 flex-1">
          <span className="text-xs text-muted-foreground">Development Path</span>
          {contact.developmentPathName ? (
            <div className="mt-1">
              <p className="text-sm font-medium">{contact.developmentPathName}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Progress value={pathProgress} className="h-1.5 flex-1" />
                <span className="text-[10px] text-muted-foreground">
                  {currentStep}/{totalSteps}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60 mt-0.5">No path assigned</p>
          )}
        </div>

        {/* Section 6: Meta Info */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{contact.location}</span>
            <span>{formatLastInteraction(contact.lastInteraction)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
