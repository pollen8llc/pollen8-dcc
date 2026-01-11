import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Zap, ExternalLink, Loader2, Power } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useActv8FullStatus } from '@/hooks/useActv8Contacts';
import { activateContact } from '@/services/actv8Service';
import { toast } from 'sonner';
import { getStrengthConfig, ConnectionStrengthLevel } from '@/config/connectionStrengthConfig';
import { cn } from '@/lib/utils';

interface ContactHeaderProps {
  contactId: string;
  name: string;
  category?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  tags?: string[];
  affiliatedUserId?: string;
  onEdit?: () => void;
}

export function ContactHeader({
  contactId,
  name,
  category,
  avatar,
  status = 'active',
  tags = [],
  affiliatedUserId,
  onEdit
}: ContactHeaderProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isActivating, setIsActivating] = useState(false);

  const { data: actv8FullStatus } = useActv8FullStatus(contactId);

  const handleActivate = async () => {
    if (actv8FullStatus?.isActive) {
      // Already active - navigate to Actv8 profile
      navigate(`/rel8/actv8/${actv8FullStatus.actv8Contact?.id}/profile`);
      return;
    }

    setIsActivating(true);
    try {
      await activateContact(contactId);
      queryClient.invalidateQueries({ queryKey: ['actv8-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['actv8-full-status'] });
      
      const message = actv8FullStatus?.exists 
        ? `${name} reactivated in Actv8!` 
        : `${name} added to Actv8!`;
      toast.success(message);
      navigate('/rel8/actv8');
    } catch (error) {
      console.error('Failed to activate contact:', error);
      toast.error('Failed to activate contact. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  // Helper to render the activate button content
  const renderActivateButtonContent = () => {
    if (isActivating) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {actv8FullStatus?.exists && !actv8FullStatus?.isActive ? 'Reactivating...' : 'Adding...'}
        </>
      );
    }
    if (actv8FullStatus?.isActive) {
      return (
        <>
          <ExternalLink className="h-4 w-4" />
          View in Actv8
        </>
      );
    }
    if (actv8FullStatus?.exists) {
      return (
        <>
          <Power className="h-4 w-4" />
          Reactivate
        </>
      );
    }
    return (
      <>
        <Zap className="h-4 w-4" />
        Activate
      </>
    );
  };

  // Get strength indicator styling
  const getStrengthIndicator = () => {
    if (!actv8FullStatus?.isActive) {
      return { gradientClass: 'from-muted-foreground/40 to-muted-foreground/30', isActive: false };
    }
    const strength = actv8FullStatus.actv8Contact?.connection_strength as ConnectionStrengthLevel || 'spark';
    const config = getStrengthConfig(strength);
    return { gradientClass: config.gradientClass, isActive: true };
  };
  
  const strengthIndicator = getStrengthIndicator();

  return (
    <Card className="relative overflow-hidden glass-morphism bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-md border-primary/20 shadow-xl">
      {/* Ambient glow effects */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-accent/15 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative p-5 sm:p-6 lg:p-8">
        {/* Unified Responsive Layout */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Avatar with enhanced ring */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
            <Avatar 
              userId={affiliatedUserId || "UXI8000"} 
              size={isMobile ? 96 : 88} 
              className="relative ring-2 ring-primary/30 ring-offset-2 ring-offset-background shadow-lg" 
            />
            {/* Strength indicator */}
            <div className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background shadow-md bg-gradient-to-r",
              strengthIndicator.gradientClass,
              strengthIndicator.isActive && "animate-pulse"
            )} />
          </div>
          
          {/* Name and category */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text truncate">
              {name}
            </h1>
            {category && (
              <p className="mt-1 text-sm sm:text-base text-muted-foreground font-medium">
                {category}
              </p>
            )}
          </div>
        </div>

        {/* Glowing Separator */}
        <div className="relative h-px w-full my-5 sm:my-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-sm" />
        </div>

        {/* Action Buttons - Responsive Grid */}
        <div className="flex flex-col xs:flex-row gap-3">
          <Button 
            onClick={handleActivate} 
            variant="default" 
            size={isMobile ? "default" : "lg"}
            className="flex-1 gap-2 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
            disabled={isActivating}
          >
            {renderActivateButtonContent()}
          </Button>
          <Button 
            onClick={onEdit} 
            variant="outline" 
            size={isMobile ? "default" : "lg"}
            className="flex-1 gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}