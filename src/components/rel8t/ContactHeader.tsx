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

  return (
    <Card className="relative overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-4">
            {/* Avatar Row */}
            <div className="flex items-center justify-center">
              <Avatar userId={affiliatedUserId || "UXI8000"} size={100} className="ring-2 ring-primary/20" />
            </div>

            {/* Name Row */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">{name}</h1>
            </div>

            {/* Glowing Separator */}
            <div className="relative h-px w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleActivate} 
                variant="default" 
                size="sm" 
                className="gap-2"
                disabled={isActivating}
              >
                {renderActivateButtonContent()}
              </Button>
              <Button onClick={onEdit} variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <>
            {/* Contact Info Section */}
            <div className="flex items-start gap-6 mb-6">
              <Avatar userId={affiliatedUserId || "UXI8000"} size={80} className="ring-2 ring-primary/20" />
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{name}</h1>
              </div>
            </div>

            {/* Glowing Separator */}
            <div className="relative h-px w-full mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleActivate} 
                variant="default" 
                className="flex-1 gap-2"
                disabled={isActivating}
              >
                {renderActivateButtonContent()}
              </Button>
              <Button onClick={onEdit} variant="outline" className="flex-1 gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}