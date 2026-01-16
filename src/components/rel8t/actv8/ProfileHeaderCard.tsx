import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ProfileHeaderCardProps {
  contact: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    role?: string | null;
    company?: string | null;
    avatar_url?: string | null;
  };
  actv8Contact: {
    id: string;
    last_touchpoint_at?: string | null;
    connection_strength?: string | null;
  };
  totalOutreaches?: number;
  engagementPercent?: number;
  onBack?: () => void;
}

const strengthConfig: Record<string, { label: string; color: string; gradient: string }> = {
  spark: { 
    label: "Spark", 
    color: "text-rose-400",
    gradient: "from-rose-500/30 to-rose-600/10"
  },
  ember: { 
    label: "Ember", 
    color: "text-amber-400",
    gradient: "from-amber-500/30 to-amber-600/10"
  },
  flame: { 
    label: "Flame", 
    color: "text-teal-400",
    gradient: "from-teal-500/30 to-teal-600/10"
  },
  star: { 
    label: "Star", 
    color: "text-primary",
    gradient: "from-primary/30 to-primary/10"
  },
};

export function ProfileHeaderCard({
  contact,
  actv8Contact,
  totalOutreaches = 0,
  engagementPercent = 0,
  onBack,
}: ProfileHeaderCardProps) {
  const initials = contact.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const strength = actv8Contact.connection_strength?.toLowerCase() || "spark";
  const strengthInfo = strengthConfig[strength] || strengthConfig.spark;

  const lastInteraction = actv8Contact.last_touchpoint_at
    ? formatDistanceToNow(new Date(actv8Contact.last_touchpoint_at), { addSuffix: true })
    : "No interactions yet";

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-primary/20 overflow-hidden">
      {/* Ambient glow based on connection strength */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none",
        strengthInfo.gradient
      )} />
      
      <CardContent className="relative p-6">
        {/* Back button */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}

        <div className="flex flex-col items-center text-center pt-8 sm:pt-4">
          {/* Avatar */}
          <Link to={`/rel8/contacts/${contact.id}`}>
            <Avatar className="h-20 w-20 border-2 border-primary/30 hover:border-primary/60 transition-colors cursor-pointer">
              <AvatarImage src={contact.avatar_url || undefined} alt={contact.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Name & Role */}
          <div className="mt-4 space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {contact.name}
            </h1>
            {(contact.role || contact.company) && (
              <p className="text-muted-foreground">
                {contact.role}
                {contact.role && contact.company && " @ "}
                {contact.company}
              </p>
            )}
          </div>

          {/* Contact Info Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="max-w-[150px] truncate">{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{contact.phone}</span>
              </a>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {lastInteraction}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-xs">
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{totalOutreaches}</p>
              <p className="text-xs text-muted-foreground">Total Outreaches</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{engagementPercent}%</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
          </div>

          {/* Connection Strength Bar */}
          <div className="w-full mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Connection Strength</span>
              <Badge variant="outline" className={cn("text-xs", strengthInfo.color)}>
                {strengthInfo.label}
              </Badge>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                  strength === "spark" && "from-rose-500 to-rose-400 w-1/4",
                  strength === "ember" && "from-amber-500 to-amber-400 w-2/4",
                  strength === "flame" && "from-teal-500 to-teal-400 w-3/4",
                  strength === "star" && "from-primary to-accent w-full"
                )}
              />
            </div>
          </div>

          {/* View Full Profile Link */}
          <Link
            to={`/rel8/contacts/${contact.id}`}
            className="mt-4 text-sm text-primary hover:underline flex items-center gap-1"
          >
            View Full Profile
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
